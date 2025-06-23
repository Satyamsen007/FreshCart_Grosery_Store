import Image from 'next/image'
import React from 'react'
import { assets, demoTestimonials } from '../../../public/assets/assets'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css/pagination'
import 'swiper/css';
import { Rating } from '@mui/material'
import { TiStarFullOutline, TiStarOutline } from 'react-icons/ti'

const TestimonialSlider = () => {
  return (
    <div className='w-full xl:h-[500px] max-sm:h-[600px] sm:h-[480px] lg:h-[400px] xl:mb-10 relative'>
      <div className='xl:w-[450px] xl:h-[450px] max-sm:w-[250px] max-sm:h-[250px] sm:w-[340px] sm:h-[340px] absolute xl:-top-[75px] max-sm:-top-[42px] sm:-top-[57px] left-0'>
        <Image src={assets.TestimonialsLeftTopCornerimage} alt='' className='w-full h-full object-contain dark:brightness-90' />
      </div>
      <div className='xl:w-[450px] xL:h-[450px] max-sm:w-[250px] max-sm:h-[250px] sm:w-[340px] sm:h-[340px] absolute xl:-bottom-[75px] max-sm:-bottom-[42px] sm:-bottom-[57px] right-0'>
        <Image src={assets.TestimonialsRightBottomCornerimage} alt='' className='w-full h-full object-contain dark:brightness-90' />
      </div>
      <div className='relative z-10 flex justify-center items-center w-full h-full'>
        <Swiper
          modules={[Pagination, Autoplay]}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1}
          speed={800}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          slideToClickedSlide={true}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          className='w-[60%] max-sm:w-[90%]'
        >
          {
            demoTestimonials.map((testimonial, i) => (
              <SwiperSlide key={i} className="flex justify-center items-center py-10 px-4">
                <div className="relative bg-white dark:bg-gray-800 border flex flex-col xl:gap-20 max-sm:gap-3 sm:gap-5 border-green-200 dark:border-gray-700 rounded-md p-6 max-sm:p-4 w-full max-xl:h-fit h-[350px] shadow-md max-sm:text-center">
                  <div className='flex justify-between items-center max-sm:flex-col'>
                    <div>
                      <h3 className="text-[var(--primaryColor)] dark:text-[var(--primaryColor)] font-semibold text-lg mb-1">{testimonial.title}</h3>
                      <p className="text-[var(--textColor)]/90 dark:text-gray-300 font-medium text-sm mb-2">{testimonial.name}, {testimonial.date}</p>
                    </div>
                    <div className="flex justify-center mb-4">
                      <Rating name="read-only" value={testimonial.rating} readOnly
                        icon={<TiStarFullOutline className="text-lg text-yellow-400" />}
                        emptyIcon={<TiStarOutline className="text-lg text-yellow-400" />}
                      />
                    </div>
                  </div>
                  <div className="text-[var(--primaryColor)] dark:text-gray-300 text-sm max-sm:text-xs leading-relaxed text-center px-4 relative">
                    <span className="w-7 h-7 max-xl:w-5 max-xl:h-5 absolute -left-2 -top-10 max-xl:top-0 rotate-180">
                      <Image src={assets.Commas} alt='' className='w-full h-full object-contain dark:brightness-90' />
                    </span>
                    {testimonial.comment}
                    <span className="w-7 h-7 max-xl:w-5 max-xl:h-5 absolute -right-2 -bottom-10 max-xl:bottom-0">
                      <Image src={assets.Commas} alt='' className='w-full h-full object-contain dark:brightness-90' />
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
      <div className="swiper-pagination my-6 flex justify-center z-10 max-sm:hidden relative" />
    </div>
  )
}

export default TestimonialSlider