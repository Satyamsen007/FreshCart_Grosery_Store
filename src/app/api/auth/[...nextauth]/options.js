import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { connectDb } from '@/lib/dbConnect';
import User from '@/models/User.model';
import bcrypt from 'bcrypt'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/google",
        }
      }
    }),

    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDb();
        try {
          const user = await User.findOne({ email: credentials.email }).select('+password')
          if (!user) {
            throw new Error('No User found with this email address')
          }
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error('Incorrect password')
          }
        } catch (err) {
          throw new Error(err)
        }
      }
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        await connectDb();

        try {
          const email = user?.email;
          const avatarUrl = profile?.image?.trim() || user?.image?.trim() || null;

          // Handle missing email (Google sometimes doesn't return it if not verified)
          if (!email) {
            return '/error?message=Google account did not return an email';
          }

          // Check if user already exists
          let existingUser = await User.findOne({ email });

          if (!existingUser) {
            // Generate a random dummy password (used to satisfy the schema)
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            // Create new user
            existingUser = await User.create({
              fullName: user?.name,
              email,
              password: hashedPassword,
              avatar: {
                public_id: '',
                url: avatarUrl
              },
              role: email === 'democoders2004@gmail.com' ? 'admin' : 'user'
            });
          } else if (!existingUser.avatar && avatarUrl) {
            // Update avatar if missing
            existingUser.avatar = {
              public_id: '',
              url: avatarUrl
            };
            await existingUser.save();
          }

          // Extend the `user` session object with necessary properties
          user._id = existingUser._id.toString();
          user.email = existingUser.email;
          user.fullName = existingUser.fullName || ''; // Fallback if missing
          user.avatar = existingUser.avatar;
          user.role = existingUser.role;

          return true; // Continue sign-in
        } catch (error) {
          console.error('Error during Google sign-in:', error);
          return '/error?message=Google sign-in failed';
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token._id;
        session.user._id = token._id;
        session.user.email = token.email;
        session.user.fullName = token.fullName;
        session.user.avatar = token.avatar;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        // When updating, merge the new session data with the existing token
        return {
          ...token,
          fullName: session.user.fullName,
          avatar: session.user.avatar,
          // Preserve other token data
          _id: token._id,
          email: token.email,
          role: token.role
        }
      }
      if (user) {
        // Initial sign in
        return {
          _id: user._id?.toString(),
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar || user.image || '',
          role: user.role
        }
      }
      return token
    }
  },
  pages: {
    signIn: '/auth',
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET_KEY,
}