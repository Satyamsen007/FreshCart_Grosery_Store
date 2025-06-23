import Image from 'next/image';
import { assets } from '../../../public/assets/assets';

const WhyAreTheBestSection = () => {
  return (
    <section className="w-full h-[600px] max-lg:h-fit gap-8 max-sm:gap-4 flex justify-center items-center p-8 bg-[#E9F5F1] dark:bg-gray-800 max-lg:flex-col">
      <div className="xl:w-full lg:w-[70%] max-lg:w-[90%] h-[410px] max-sm:h-[300px] relative">
        <div className="w-full h-full">
          <Image src={assets.WhyAreTheBestSideImage} alt="" className="w-full h-full object-contain dark:brightness-90" />
        </div>
        <div className="absolute max-lg:hidden left-[47%] -bottom-5 rotate-90 w-[6%] h-[2px] bg-[var(--primaryColor)] dark:bg-gray-600"></div>
        <div className="absolute max-lg:hidden xl:left-[32%] lg:left-[32%] flex justify-center items-center rounded-4xl -bottom-20 xl:w-[35%] max-lg:w-[40%] h-fit bg-white dark:bg-gray-700">
          <div className="flex items-center gap-5">
            <div className="w-14 h-12 px-2">
              <Image src={assets.ExpressTruck} alt="" className="w-full h-full object-contain dark:brightness-90" />
            </div>
            <div>
              <h4 className="text-sm text-[#5651E6] dark:text-blue-400 font-semibold">Express Delivery</h4>
              <p className="text-xs text-[var(--textColor)] dark:text-gray-300 font-medium">In 40 min</p>
            </div>
          </div>
        </div>
      </div>
      <div className="xl:w-full lg:w-[70%] max-lg:w-[100%] h-fit">
        <h2 className="text-3xl max-sm:text-2xl text-[var(--primaryColor)] dark:text-gray-100 max-sm:text-center font-bold">Why Are The Best?</h2>
        <div className="mt-6 flex flex-col gap-5">
          <div className="flex items-center gap-5 max-sm:flex-col">
            <div className="bg-[var(--primaryColor)] dark:bg-gray-700 w-14 h-12 px-2 rounded-sm">
              <Image src={assets.TrackIcon} alt="" className="w-full h-full object-contain dark:brightness-90" />
            </div>
            <div>
              <h4 className="text-lg text-[var(--textColor)] dark:text-gray-100 max-sm:text-center font-semibold">Express Delivery in 40 Minutes</h4>
              <p className="text-xs text-[var(--textColor)] dark:text-gray-300 max-sm:text-center font-medium">Get your groceries delivered to your doorstep in as little as 40 minutes.</p>
            </div>
          </div>

          <div className="flex items-center gap-5 max-sm:flex-col">
            <div className="bg-[var(--primaryColor)] dark:bg-gray-700 w-14 h-12 px-2 rounded-sm">
              <Image src={assets.FarmFreshIcon} alt="" className="w-full h-full object-contain dark:brightness-90" />
            </div>
            <div>
              <h4 className="text-lg text-[var(--textColor)] dark:text-gray-100 max-sm:text-center font-semibold">Farm-Fresh Quality</h4>
              <p className="text-xs text-[var(--textColor)] dark:text-gray-300 max-sm:text-center font-medium">We source our fruits and vegetables directly from trusted farms, ensuring you get thefreshest
                and most nutritious produce every time.</p>
            </div>
          </div>

          <div className="flex items-center gap-5 max-sm:flex-col">
            <div className="bg-[var(--primaryColor)] dark:bg-gray-700 w-14 h-12 px-2 rounded-sm">
              <Image src={assets.BestPriceIcon} alt="" className="w-full h-full object-contain dark:brightness-90" />
            </div>
            <div>
              <h4 className="text-lg text-[var(--textColor)] dark:text-gray-100 max-sm:text-center font-semibold">Best Price Guarantee</h4>
              <p className="text-xs text-[var(--textColor)] dark:text-gray-300 max-sm:text-center font-medium">Enjoy competitive pricing with seasonal deals and exclusive discounts you won't find
                anywhere else.</p>
            </div>
          </div>

          <div className="flex items-center gap-5 max-sm:flex-col">
            <div className="bg-[var(--primaryColor)] dark:bg-gray-700 w-14 h-12 px-2 rounded-sm">
              <Image src={assets.HygenicIcon} alt="" className="w-full h-full object-contain dark:brightness-90" />
            </div>
            <div>
              <h4 className="text-lg text-[var(--textColor)] dark:text-gray-100 max-sm:text-center font-semibold">Safe & Hygienic Packaging</h4>
              <p className="text-xs text-[var(--textColor)] dark:text-gray-300 max-sm:text-center font-medium">Every order is carefully packed to maintain freshness and hygiene, so your groceries
                reach you in perfect condition.</p>
            </div>
          </div>

          <div className="flex items-center gap-5 max-sm:flex-col">
            <div className="bg-[var(--primaryColor)] dark:bg-gray-700 w-14 h-12 px-2 rounded-sm">
              <Image src={assets.TrustedIcon} alt="" className="w-full h-full object-contain dark:brightness-90" />
            </div>
            <div>
              <h4 className="text-lg text-[var(--textColor)] dark:text-gray-100 max-sm:text-center font-semibold">Trusted by Thousands</h4>
              <p className="text-xs text-[var(--textColor)] dark:text-gray-300 max-sm:text-center font-medium">Over 10,000+ customers rely on us for their daily groceries. Join our growing community
                of fresh produce lovers and experience the difference today!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyAreTheBestSection