import Image from 'next/image'
import { assets } from '../../public/assets/assets'
import { FaBoxOpen } from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import { FaCity } from "react-icons/fa6";
import { TfiShoppingCartFull } from "react-icons/tfi";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
const AboutUsPage = () => {
  return (
    <>
      <div className='w-full dark:bg-gray-900 xl:h-[600px] md:h-[430px] max-md:h-[300px] mt-10 flex justify-center bg-[var(--bgColor)] relative overflow-hidden'>
        <div className='w-[70%] max-md:w-[90%] max-md:h-[200px] flex flex-col items-center gap-4 z-10'>
          <h1 className='text-3xl dark:text-gray-100 max-md:text-xl text-center font-semibold text-[var(--textColor)]'>
            Bringing Freshness to Your Door,<br className='max-md:hidden' />
            <span className="dark:text-[#FFB74D]">Anytime, Anywhere.</span>
          </h1>
        </div>

        <div className='w-full xl:h-[600px] md:h-[400px] max-md:h-[280px] absolute bottom-0'>
          <Image
            src={assets.AboutUsPageBannerImage}
            alt='ContactUsBannerImage'
            className='w-full h-full object-contain'
            priority
          />
        </div>
      </div>

      <div className='w-full grid gap-6 md:grid-cols-2 xl:flex xl:justify-evenly xl:items-center p-4'>
        <div className='border-2 border-[var(--primaryColor)] rounded-md p-6 w-full h-[150px] bg-[var(--bgColor)] dark:bg-gray-800 dark:border-gray-700'>
          <div className='flex items-center justify-center mb-3 gap-3 text-xl max-sm:text-lg text-[var(--textColor)] dark:text-gray-100 font-semibold'>
            <span className='px-4 rounded-sm py-2 bg-[var(--primaryColor)] dark:bg-gray-700/50 text-white'>
              <FaBoxOpen />
            </span>
            <h3>1 Billion Product</h3>
          </div>
          <p className='text-center text-sm max-sm:text-xs text-[var(--textColor)] dark:text-gray-300'>Seamlessly shop from a vast collection
            of products available throughout our
            entire catalog.</p>
        </div>

        <div className='border-2 border-[var(--primaryColor)] rounded-md p-6 w-full h-[150px] bg-[var(--bgColor)] dark:bg-gray-800 dark:border-gray-700'>
          <div className='flex items-center justify-center mb-3 gap-3 text-xl max-sm:text-lg text-[var(--textColor)] dark:text-gray-100 font-semibold'>
            <span className='px-4 rounded-sm py-2 bg-[var(--primaryColor)] dark:bg-gray-700/50 text-white'>
              <IoStorefrontSharp />
            </span>
            <h3>80,000 stores</h3>
          </div>
          <p className='text-center text-sm max-sm:text-xs text-[var(--textColor)] dark:text-gray-300'>Easily connect and shop from
            a global network of over
            80,000 stores.  </p>
        </div>

        <div className='border-2 border-[var(--primaryColor)] rounded-md p-6 w-full h-[150px] bg-[var(--bgColor)] dark:bg-gray-800 dark:border-gray-700'>
          <div className='flex items-center justify-center mb-3 gap-3 text-xl max-sm:text-lg text-[var(--textColor)] dark:text-gray-100 font-semibold'>
            <span className='px-4 rounded-sm py-2 bg-[var(--primaryColor)] dark:bg-gray-700/50 text-white'>
              <FaCity />
            </span>
            <h3>14,000 cities</h3>
          </div>
          <p className='text-center text-sm max-sm:text-xs text-[var(--textColor)] dark:text-gray-300'>Now available in more than
            14,000 cities for seamless shopping
            and delivery.</p>
        </div>

        <div className='border-2 border-[var(--primaryColor)] rounded-md p-6 w-full h-[150px] bg-[var(--bgColor)] dark:bg-gray-800 dark:border-gray-700'>
          <div className='flex items-center justify-center mb-3 gap-3 text-xl max-sm:text-lg text-[var(--textColor)] dark:text-gray-100 font-semibold'>
            <span className='px-4 rounded-sm py-2 bg-[var(--primaryColor)] dark:bg-gray-700/50 text-white'>
              <TfiShoppingCartFull />
            </span>
            <h3>Millions of orders</h3>
          </div>
          <p className='text-center text-sm max-sm:text-xs text-[var(--textColor)] dark:text-gray-300'>Trusted by customers with millions
            of successful orders delivered
            worldwide.</p>
        </div>
      </div>

      <div className='py-14 max-sm:py-8'>
        <div className='flex flex-col justify-center items-center gap-4 w-[70%] max-lg:w-[90%] text-[var(--textColor)] mx-auto'>
          <h3 className='text-xl max-sm:text-lg text-[var(--primaryColor)] dark:text-[var(--primaryColor)] font-semibold'>Why Choose Us?</h3>
          <h2 className='text-2xl max-sm:text-xl text-center font-semibold dark:text-gray-100'>Fresh groceries, unbeatable value, and a <br className='max-sm:hidden' />
            seamless shopping experience — made for you.</h2>
          <p className='text-center text-sm max-sm:text-xs text-[var(--textColor)]/70 dark:text-gray-300'>We deliver the freshest products at the best prices with a hassle-free, reliable service you can count on. From over 1 billion products
            and 80,000+ stores to serving 14,000 cities with millions of successful orders, FreshCart is your trusted grocery partner for quality, variety, and convenience.</p>
        </div>
      </div>

      <div className='w-full p-4 flex flex-col gap-8 xl:gap-4 bg-white dark:bg-gray-900'>
        <div className='grid grid-cols-[1.5fr_1fr] max-lg:grid-cols-1 max-lg:w-[95%] max-lg:gap-5 w-[85%] mx-auto gap-28 place-items-center'>
          <div className='text-[var(--textColor)] dark:text-gray-100'>
            <h3 className='text-2xl max-sm:text-xl font-semibold mb-2 max-lg:text-center'>Fresh Groceries Delivered to
              Your Doorstep.</h3>
            <p className='text-sm max-sm:text-xs font-medium text-justify dark:text-gray-300'>At FreshCart, we understand the importance of fresh, high-quality groceries for you
              and your family. That's why we carefully pick the freshest fruits, vegetables, dairy,
              and pantry essentials and deliver them straight to your doorstep. No more long
              queues or crowded stores — just quick, convenient, and hassle-free grocery
              shopping from the comfort of your home. We ensure that every order reaches you
              in perfect condition, preserving the natural taste and goodness of every product.
            </p>
          </div>
          <div className="lg:w-full max-sm:w-full sm:w-[60%] h-auto">
            <Image
              src={assets.AboutPageSideImage_01}
              alt="FreshCart About Image"
              className="w-full h-full object-contain"
              width={600}
              height={400}
              priority
            />
          </div>
        </div>

        <div className='grid grid-cols-[1fr_1.5fr] max-lg:flex max-lg:flex-wrap-reverse max-lg:w-[95%] max-lg:gap-5 w-[85%] mx-auto gap-28 place-items-center'>
          <div className="lg:w-full mx-auto max-sm:w-full sm:w-[60%] h-auto">
            <Image
              src={assets.AboutPageSideImage_02}
              alt="FreshCart About Image"
              className="w-full h-full object-contain"
              width={600}
              height={400}
              priority
            />
          </div>
          <div className='text-[var(--textColor)] dark:text-gray-100'>
            <h3 className='text-2xl max-sm:text-xl font-semibold mb-2 max-lg:text-center'>1 Billion+ Products from 80,000+
              Trusted Stores.</h3>
            <p className='text-sm max-sm:text-xs font-medium text-justify dark:text-gray-300'>We take pride in offering one of the largest online grocery selections, featuring over 1 billion products from 80,000+ trusted stores. Whether you need international brands, local favorites, organic choices, or specialty items, you'll find everything you need on FreshCart. Our wide product range means you'll never have to visit multiple stores again. Shop all your essentials in one place and discover exciting new products every time you browse.
            </p>
          </div>
        </div>

        <div className='grid grid-cols-[1.5fr_1fr] max-lg:grid-cols-1 max-lg:w-[95%] max-lg:gap-5 w-[85%] mx-auto gap-28 place-items-center'>
          <div className='text-[var(--textColor)] dark:text-gray-100'>
            <h3 className='text-2xl max-sm:text-xl font-semibold mb-2 max-lg:text-center'>Millions of Orders Successfully Delivered.</h3>
            <p className='text-sm max-sm:text-xs font-medium text-justify dark:text-gray-300'>With millions of successful orders delivered to happy customers, FreshCart has earned the trust of families in over 14,000 cities. Our dedicated delivery network ensures that your groceries arrive fresh and on time, no matter where you are. From the moment you place your order to the time it arrives at your door, we handle every step with care, accuracy, and efficiency. Join the growing FreshCart community and experience worry-free online grocery shopping.
            </p>
          </div>
          <div className="lg:w-full max-sm:w-full sm:w-[60%] h-auto">
            <Image
              src={assets.AboutPageSideImage_03}
              alt="FreshCart About Image"
              className="w-full h-full object-contain"
              width={600}
              height={400}
              priority
            />
          </div>
        </div>

        <div className='grid grid-cols-[1fr_1.5fr] max-lg:flex max-lg:flex-wrap-reverse max-lg:w-[95%] max-lg:gap-5 w-[85%] mx-auto gap-28 place-items-center'>
          <div className="lg:w-full mx-auto max-sm:w-full sm:w-[60%] h-auto">
            <Image
              src={assets.AboutPageSideImage_04}
              alt="FreshCart About Image"
              className="w-full h-full object-contain"
              width={600}
              height={400}
              priority
            />
          </div>
          <div className='text-[var(--textColor)] dark:text-gray-100'>
            <h3 className='text-2xl max-sm:text-xl font-semibold mb-2 max-lg:text-center'>FreshCart — Built for Convenience
              and Value.</h3>
            <p className='text-sm max-sm:text-xs font-medium text-justify dark:text-gray-300'>Life gets busy, and we believe grocery shopping should be simple, affordable, and stress-free. FreshCart is designed to save you time and money with an easy-to-use website and app, fast checkout process, and flexible delivery slots to fit your schedule. We regularly offer exclusive deals, discounts, and seasonal offers so you can stock up on your favorite essentials without breaking the bank. With FreshCart, grocery shopping becomes an effortless part of your routine.
            </p>
          </div>
        </div>

        <div className='grid grid-cols-[1.5fr_1fr] max-lg:grid-cols-1 max-lg:w-[95%] max-lg:gap-5 w-[85%] mx-auto gap-28 place-items-center'>
          <div className='text-[var(--textColor)] dark:text-gray-100'>
            <h3 className='text-2xl max-sm:text-xl font-semibold mb-2 max-lg:text-center'>Because You Deserve a Smarter
              Grocery Experience.</h3>
            <p className='text-sm max-sm:text-xs font-medium text-justify dark:text-gray-300'>At FreshCart, we go beyond just selling groceries — we create experiences. We believe every shopper deserves fresh, quality products at fair prices, delivered with care. That's why we've built a platform that focuses on your needs first, offering seamless navigation, personalized recommendations, and customer support that's always ready to help. Discover a smarter, fresher, and better way to shop for your everyday essentials, and see why thousands of families trust FreshCart as their go-to grocery partner.
            </p>
          </div>
          <div className="lg:w-full max-sm:w-full sm:w-[60%] h-auto">
            <Image
              src={assets.AboutPageSideImage_05}
              alt="FreshCart About Image"
              className="w-full h-full object-contain"
              width={600}
              height={400}
              priority
            />
          </div>
        </div>
      </div>

      <div className='py-14'>
        <div className='flex flex-col justify-center items-center gap-2 w-[70%] max-lg:w-[90%] text-[var(--textColor)] dark:text-gray-100 mx-auto'>
          <h3 className='text-xl max-sm:text-lg text-[var(--primaryColor)] dark:text-[var(--primaryColor)] font-semibold'>Frequently Asked Questions</h3>
          <h2 className='text-2xl max-sm:text-xl text-center font-semibold'>Got questions? We've got answers. Here's everything you need
            to know about shopping with FreshCart.</h2>
        </div>
      </div>
      <div className='xl:w-[80%] max-sm:w-full sm:w-[90%] max-sm:px-4 mx-auto pb-10'>
        <Accordion type="single" collapsible className="w-full flex flex-col gap-8">
          <AccordionItem value="item-1" className='border-b border-[var(--primaryColor)] dark:border-gray-700'>
            <AccordionTrigger className='text-xl max-sm:text-lg text-[var(--textColor)] dark:text-gray-100 font-semibold no-underline hover:no-underline focus:no-underline'>How does FreshCart work?</AccordionTrigger>
            <AccordionContent className='text-sm max-sm:text-xs text-[var(--textColor)] dark:text-gray-300'>
              FreshCart is an online grocery store where you can order fresh fruits, vegetables, pantry staples, beverages,
              and household essentials from the comfort of your home. Simply browse our store, add products to your cart,
              select a delivery slot, and get your groceries delivered right to your doorstep.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className='border-b border-[var(--primaryColor)] dark:border-gray-700'>
            <AccordionTrigger className='text-xl max-sm:text-lg text-[var(--textColor)] dark:text-gray-100 font-semibold no-underline hover:no-underline focus:no-underline'>Which areas do you deliver to?</AccordionTrigger>
            <AccordionContent className='text-sm max-sm:text-xs text-[var(--textColor)] dark:text-gray-300'>
              We currently deliver to over 14,000 cities and continue to expand our service network every month.
              You can check if we deliver to your area by entering your location details during checkout or on our homepage.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className='border-b border-[var(--primaryColor)] dark:border-gray-700'>
            <AccordionTrigger className='text-xl max-sm:text-lg text-[var(--textColor)] dark:text-gray-100 font-semibold no-underline hover:no-underline focus:no-underline'>Are your products fresh and good quality?</AccordionTrigger>
            <AccordionContent className='text-sm max-sm:text-xs text-[var(--textColor)] dark:text-gray-300'>
              Absolutely! Freshness and quality are our top priorities. Every product is carefully picked, checked,
              and packed to ensure it reaches you in the best possible condition. We partner with trusted suppliers and local
              stores to maintain the highest quality standards.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className='border-b border-[var(--primaryColor)] dark:border-gray-700'>
            <AccordionTrigger className='text-xl max-sm:text-lg text-[var(--textColor)] dark:text-gray-100 font-semibold no-underline hover:no-underline focus:no-underline'>What payment methods do you accept?</AccordionTrigger>
            <AccordionContent className='text-sm max-sm:text-xs text-[var(--textColor)] dark:text-gray-300'>
              We accept all major payment options including credit/debit cards, digital wallets, UPI, net banking, and
              cash on delivery (COD) in select areas. You can choose your preferred payment method at checkout.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className='border-b border-[var(--primaryColor)] dark:border-gray-700'>
            <AccordionTrigger className='text-xl max-sm:text-lg text-[var(--textColor)] dark:text-gray-100 font-semibold no-underline hover:no-underline focus:no-underline'>Can I schedule a delivery at my preferred time?</AccordionTrigger>
            <AccordionContent className='text-sm max-sm:text-xs text-[var(--textColor)] dark:text-gray-300'>
              Yes! FreshCart offers flexible delivery slots so you can choose a time that suits your schedule. Whether you
              need same-day delivery or a specific time slot for the next day, we make it easy and convenient for you.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className='border-b border-[var(--primaryColor)] dark:border-gray-700'>
            <AccordionTrigger className='text-xl max-sm:text-lg text-[var(--textColor)] dark:text-gray-100 font-semibold no-underline hover:no-underline focus:no-underline'>What if I receive a wrong or damaged product?</AccordionTrigger>
            <AccordionContent className='text-sm max-sm:text-xs text-[var(--textColor)] dark:text-gray-300'>
              No worries — customer satisfaction is very important to us. If you receive a wrong or damaged item, you can
              easily request a replacement or refund through your order history page or by contacting our customer support.
              We'll resolve it quickly and make sure you're happy with your order.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  )
}

export default AboutUsPage