import Image from 'next/image';
import { clientLogosSecondRow } from '../../../public/assets/assets';

const HappyClientsSection = () => {
  const renderLogoRow = (logos, direction) => (
    <div className='w-[90%] max-w-[1536px] mx-auto relative xl:h-[100px] sm:h-[80px] max-sm:h-[60px] overflow-hidden flex items-center side-mask mb-4'>
      {logos.map((logo, index) => (
        <div
          key={index}
          className={`xl:w-[160px] xl:h-[100px] sm:w-[120px] sm:h-[80px] max-sm:w-[90px] max-sm:h-[60px] absolute ${direction === 'left' ? 'left-full scroll-animation-left' : 'right-full scroll-animation-right'} logo${index + 1} rounded-sm overflow-hidden`}
        >
          <Image
            src={logo}
            alt={`Client Logo ${index + 1}`}
            className="w-full h-full object-contain bg-white/80 dark:bg-gray-800/80 dark:filter dark:invert dark:brightness-[0.85] dark:contrast-[1.1] p-2 transition-all duration-300 hover:scale-110"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className='mb-6 xl:mt-20 sm:mt-10 max-sm:mb-12 max-sm:mt-5'>
        <h2 className="text-[var(--textColor)] dark:text-gray-100 text-center text-3xl max-md:text-2xl font-semibold">Happy Clients</h2>
        <p className="text-center text-[var(--textColor)]/60 dark:text-gray-400 my-2 text-sm max-md:text-xs">
          Trusted by top companies around the globe — our clients speak for our quality.
        </p>

        {renderLogoRow(clientLogosSecondRow, 'left')}
        {renderLogoRow(clientLogosSecondRow, 'right')}
      </div>
    </div>
  )
}

export default HappyClientsSection;
