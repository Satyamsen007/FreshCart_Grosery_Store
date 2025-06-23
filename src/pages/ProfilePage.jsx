'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Camera, Mail, User, Phone, MapPin, Shield, CreditCard, Package, Heart, LogOut, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation'
import { signOut, useSession, update } from 'next-auth/react'
import Image from 'next/image'
import { assets } from '../../public/assets/assets'
import { getAuthUser, selectUser, selectAuthLoading } from '@/store/features/authSlice'
import { updateUserProfile, deleteUserAccount } from '@/store/features/updateUserProfileSlice'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const ProfilePage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { data: session, status: sessionStatus, update: updateSession } = useSession()
  const user = useSelector(selectUser)
  const isLoading = useSelector(selectAuthLoading)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [formData, setFormData] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileInputRef = useRef(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    dispatch(getAuthUser())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
      })
      setAvatarPreview(user.avatar?.url || assets.userDefaultAvatar)
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const updatedUser = await dispatch(updateUserProfile({
        fullName: formData.name,
        avatar: avatarPreview
      })).unwrap()

      // Update the session with new user data
      await updateSession({
        user: {
          ...session.user,
          fullName: updatedUser.fullName,
          avatar: updatedUser.avatar
        }
      })

      // Refresh the user data in Redux store
      dispatch(getAuthUser())

      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'FRESHCART') {
      toast.error('Please type FRESHCART to confirm')
      return
    }

    setIsDeleting(true)
    try {
      await dispatch(deleteUserAccount()).unwrap()
      toast.success('Account deleted successfully')
      signOut({ callbackUrl: '/' })
    } catch (error) {
      toast.error(error.message || 'Failed to delete account')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setDeleteConfirmText('')
    }
  }

  if (isLoading || sessionStatus === 'loading') {
    return (
      <div className="min-h-[80vh] bg-gray-50/30 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-md">
              {/* Profile Header Skeleton */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <Skeleton className="w-32 h-32 rounded-full dark:bg-gray-700" />
                <div className="flex-1 w-full">
                  <Skeleton className="h-8 w-48 mb-4 dark:bg-gray-700" />
                  <Skeleton className="h-6 w-64 dark:bg-gray-700" />
                </div>
              </div>

              {/* Form Fields Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24 dark:bg-gray-700" />
                  <Skeleton className="h-12 w-full dark:bg-gray-700" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24 dark:bg-gray-700" />
                  <Skeleton className="h-12 w-full dark:bg-gray-700" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24 dark:bg-gray-700" />
                  <Skeleton className="h-12 w-full dark:bg-gray-700" />
                </div>
              </div>

              {/* Quick Links Skeleton */}
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <Skeleton className="w-6 h-6 rounded-full dark:bg-gray-700" />
                    <Skeleton className="h-4 w-20 dark:bg-gray-700" />
                  </div>
                ))}
              </div>

              {/* Danger Zone Skeleton */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <Skeleton className="h-6 w-32 mb-4 dark:bg-gray-700" />
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-5 h-5 rounded-full dark:bg-gray-700" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-full dark:bg-gray-700" />
                      <Skeleton className="h-10 w-32 mt-4 dark:bg-gray-700" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session || !user) {
    return (
      <div className="min-h-[80vh] bg-gray-50/30 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[var(--textColor)] dark:text-white mb-4">
            Please sign in to view your profile
          </h2>
          <Button
            onClick={() => router.push('/auth')}
            className="bg-[var(--primaryColor)] hover:bg-[var(--primaryColor)]/90 dark:bg-[#FFB74D] dark:hover:bg-[#FFB74D]/90"
          >
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] bg-gray-50/30 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-md"
          >
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--primaryColor)] dark:border-[#FFB74D]">
                  <Image
                    src={avatarPreview || assets.userDefaultAvatar}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                  disabled={!isEditing}
                />
                <div className={`absolute inset-0 flex items-center justify-center bg-black/50 rounded-full transition-opacity duration-300 ${isEditing ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => isEditing && fileInputRef.current?.click()}
                    className="text-white hover:text-white cursor-pointer hover:bg-transparent"
                    disabled={!isEditing}
                  >
                    <Camera className="w-6 h-6" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-semibold text-[var(--textColor)] dark:text-white mb-2">
                  {user?.fullName || 'User Name'}
                </h1>
                <p className="text-[var(--textColor)]/60 dark:text-gray-400">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-[var(--textColor)] dark:text-gray-200">
                    <User className="w-4 h-4" /> Full Name
                  </Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${!isEditing ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''
                      }`}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-[var(--textColor)] dark:text-gray-200">
                    <Mail className="w-4 h-4" /> Email Address
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled={true}
                    className="bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white cursor-not-allowed"
                  />
                  <p className="text-xs text-[var(--textColor)]/60 dark:text-gray-400 mt-1">
                    Email address cannot be changed
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-[var(--textColor)] dark:text-gray-200">
                    <Phone className="w-4 h-4" /> Contact Number
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--textColor)]/60 dark:text-gray-400">
                      +91
                    </span>
                    <Input
                      name="phone"
                      value={formData.phone?.replace('+91', '') || ''}
                      disabled={true}
                      placeholder={!formData.phone ? "Contact number will be set from your primary delivery address" : ""}
                      className="bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white cursor-not-allowed pl-12"
                    />
                  </div>
                  <p className="text-xs text-[var(--textColor)]/60 dark:text-gray-400 mt-1">
                    Contact number cannot be changed directly
                  </p>
                  {!formData.phone && (
                    <div className="flex items-start gap-2 mt-2">
                      <MapPin className="w-4 h-4 text-[var(--primaryColor)] dark:text-[#FFB74D] mt-0.5" />
                      <p className="text-sm text-[var(--textColor)]/70 dark:text-gray-400">
                        To add your contact number, please set up a primary delivery address in the Addresses section
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="dark:border-gray-700 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700"
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                )}
                {isEditing ? (
                  <>
                    <Button
                      type="submit"
                      className="bg-[var(--primaryColor)] cursor-pointer hover:bg-[var(--primaryColor)]/90 dark:bg-[#FFB74D] dark:hover:bg-[#FFB74D]/90"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="bg-[var(--primaryColor)] cursor-pointer hover:bg-[var(--primaryColor)]/90 dark:bg-[#FFB74D] dark:hover:bg-[#FFB74D]/90"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>

            {/* Quick Links */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/delivery-addresses')}
                className="flex flex-col cursor-pointer items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <MapPin className="w-6 h-6 text-[var(--primaryColor)] dark:text-[#FFB74D]" />
                <span className="text-sm text-[var(--textColor)] dark:text-gray-200">Addresses</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/orders')}
                className="flex flex-col items-center cursor-pointer gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <Package className="w-6 h-6 text-[var(--primaryColor)] dark:text-[#FFB74D]" />
                <span className="text-sm text-[var(--textColor)] dark:text-gray-200">Orders</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/wishlist')}
                className="flex flex-col items-center cursor-pointer gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <Heart className="w-6 h-6 text-[var(--primaryColor)] dark:text-[#FFB74D]" />
                <span className="text-sm text-[var(--textColor)] dark:text-gray-200">Wishlist</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex flex-col cursor-pointer items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <LogOut className="w-6 h-6 text-red-500 dark:text-red-400" />
                <span className="text-sm text-red-500 dark:text-red-400">Logout</span>
              </motion.button>
            </div>

            {/* Danger Zone */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-red-500 dark:text-red-400 mb-4">
                Danger Zone
              </h2>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-500 dark:text-red-400">
                      Delete Account
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button
                      variant="destructive"
                      className="mt-4 cursor-pointer"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Delete Account Modal */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-red-500">Delete Account</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Please type <span className="font-semibold">FRESHCART</span> to confirm:
                    </p>
                    <Input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type FRESHCART to confirm"
                      className="border-red-200 dark:border-red-800"
                      disabled={isDeleting}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteModal(false)}
                    className='cursor-pointer'
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== 'FRESHCART' || isDeleting}
                    className='cursor-pointer'
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete Account'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage 