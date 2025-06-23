'use client'

import Image from 'next/image';
import { assets } from '../../public/assets/assets'
import { BsHeadset, BsInstagram } from "react-icons/bs";
import { IoMail } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { BiSolidPhoneCall } from "react-icons/bi";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useForm } from 'react-hook-form';
import { BiMailSend } from "react-icons/bi";
import { FaTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa6";
import { FaLinkedinIn } from 'react-icons/fa';

// Fix default icon paths for Leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});
const ContactUsPage = () => {
  const position = [22.62808147427098, 88.41374893510228]
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    reset();
  };
  return (
    <>
      <div className='w-full xl:h-[600px] md:h-[430px] max-md:h-[300px] mt-10 flex justify-center bg-[var(--bgColor)] dark:bg-gray-900 relative overflow-hidden'>
        <div className='w-[70%] max-md:w-[90%] max-md:h-[200px] flex flex-col items-center gap-4 z-10'>
          <h1 className='text-3xl max-md:text-xl text-center font-semibold text-[var(--textColor)] dark:text-gray-100'>
            We'd Love to Hear From You — <br className='max-md:hidden' />
            <span className="dark:text-[#FFB74D]">Let's Stay Connected!</span>
          </h1>
        </div>

        <div className='w-full xl:h-[650px] md:h-[450px] max-md:h-[330px] absolute bottom-0'>
          <Image
            src={assets.ContactUsPageBannerImage}
            alt='ContactUsBannerImage'
            className='w-full h-full object-contain dark:brightness-90'
            priority
          />
        </div>
      </div>
      <div className='w-full grid gap-6 md:grid-cols-2 xl:flex xl:justify-evenly xl:items-center p-4'>
        <div className='border-2 border-[var(--primaryColor)] rounded-md p-6 w-full h-[150px] bg-[var(--bgColor)] dark:bg-gray-800 dark:border-gray-700'>
          <div className='flex items-center justify-center mb-3 gap-3 text-xl text-[var(--textColor)] dark:text-gray-100 font-semibold'>
            <span className='px-4 rounded-sm py-2 bg-[var(--primaryColor)] dark:bg-gray-700/50 text-white'>
              <BsHeadset />
            </span>
            <h3>Live Support</h3>
          </div>
          <p className='text-center text-sm dark:text-gray-300'>Our team is available 24/7 to answer
            your questions and provide real-time
            assistance.</p>
        </div>

        <div className='border-2 border-[var(--primaryColor)] rounded-md p-6 w-full h-[150px] bg-[var(--bgColor)] dark:bg-gray-800 dark:border-gray-700'>
          <div className='flex items-center justify-center mb-3 gap-3 text-xl text-[var(--textColor)] dark:text-gray-100 font-semibold'>
            <span className='px-4 rounded-sm py-2 bg-[var(--primaryColor)] dark:bg-gray-700/50 text-white'>
              <IoMail />
            </span>
            <h3> Email Us Anytime</h3>
          </div>
          <p className='text-center text-sm dark:text-gray-300'>Reach us via email at
            support@example.com – we'll get
            back to you within 24 hours.</p>
        </div>

        <div className='border-2 border-[var(--primaryColor)] rounded-md p-6 w-full h-[150px] bg-[var(--bgColor)] dark:bg-gray-800 dark:border-gray-700'>
          <div className='flex items-center justify-center mb-3 gap-3 text-xl text-[var(--textColor)] dark:text-gray-100 font-semibold'>
            <span className='px-4 rounded-sm py-2 bg-[var(--primaryColor)] dark:bg-gray-700/50 text-white'>
              <FaLocationDot />
            </span>
            <h3>Our Office Locations</h3>
          </div>
          <p className='text-center text-sm dark:text-gray-300'>Visit our offices in over 50 cities
            worldwide. Find your nearest branch.</p>
        </div>

        <div className='border-2 border-[var(--primaryColor)] rounded-md p-6 w-full h-[150px] bg-[var(--bgColor)] dark:bg-gray-800 dark:border-gray-700'>
          <div className='flex items-center justify-center mb-3 gap-3 text-xl text-[var(--textColor)] dark:text-gray-100 font-semibold'>
            <span className='px-4 rounded-sm py-2 bg-[var(--primaryColor)] dark:bg-gray-700/50 text-white'>
              <BiSolidPhoneCall />
            </span>
            <h3>Call Us Directly</h3>
          </div>
          <p className='text-center text-sm dark:text-gray-300'>Speak with our support team by
            calling +1 (800) 123-4567.
            We're here to help!</p>
        </div>
      </div>
      <div className='w-full h-fit'>
        <div className='w-[80%] max-sm:w-[90%] flex flex-col items-center justify-center gap-2 my-12 max-sm:my-8 text-[var(--textColor)] mx-auto'>
          <h2 className='text-2xl font-semibold dark:text-gray-100'>Contact Our Team</h2>
          <p className='text-center max-sm:text-justify text-sm px-6 max-sm:px-0 font-medium dark:text-gray-300'>Our team is dedicated to providing you with the support you need — whether it's a question about your order, a product inquiry, or just general feedback. We value every message and strive to respond as quickly and helpfully as possible. Don't hesitate to get in touch —
            we're here to ensure your FreshCart experience is smooth and satisfying.</p>
        </div>

        <div className="w-full min-h-screen p-8 max-sm:p-5 bg-[var(--bgColor)] dark:bg-gray-900 text-[var(--textColor)]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Left side: Contact Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3">
                <div className='flex flex-col gap-1'>
                  <label htmlFor="firstName" className="dark:text-gray-200">First name</label>
                  <input
                    type="text"
                    id='firstName'
                    placeholder="First name"
                    {...register('firstName')}
                    className="border p-2 outline-none rounded bg-[var(--bgColor)] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 placeholder:dark:text-gray-500"
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="lastName" className="dark:text-gray-200">Last name</label>
                  <input
                    type="text"
                    id='lastName'
                    placeholder="Last name"
                    {...register('lastName')}
                    className="border p-2 outline-none rounded bg-[var(--bgColor)] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 placeholder:dark:text-gray-500"
                  />
                </div>
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor="email" className="dark:text-gray-200">Email</label>
                <input
                  type="email"
                  id='email'
                  placeholder="Where can we reply with good news?"
                  {...register('email')}
                  className="border p-2 outline-none rounded bg-[var(--bgColor)] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 placeholder:dark:text-gray-500"
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor="phone" className="dark:text-gray-200">Phone number</label>
                <input
                  type="tel"
                  id='phone'
                  placeholder="Need a quick call? Drop your digits here"
                  {...register('phone')}
                  className="border p-2 outline-none rounded bg-[var(--bgColor)] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 placeholder:dark:text-gray-500"
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor="message" className="dark:text-gray-200">Message</label>
                <textarea
                  id='message'
                  rows="8"
                  placeholder="Tell us everything — we're all ears"
                  {...register('message')}
                  className="border p-2 resize-none outline-none rounded bg-[var(--bgColor)] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 placeholder:dark:text-gray-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-[var(--primaryColor)] xl:w-[40%] max-sm:w-full sm:w-[50%] border border-[var(--primaryColor)] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-transparent hover:text-[var(--primaryColor)] hover:border-[var(--primaryColor)] transition-all duration-200 dark:bg-[#FFB74D] dark:border-[#FFB74D] dark:hover:bg-transparent dark:hover:text-[#FFB74D] dark:hover:border-[#FFB74D]"
              >
                Send Message
              </button>
            </form>

            {/* Right side: Map and Info */}
            <div className="flex flex-col gap-4 z-50">
              <div className="h-72 w-full rounded -z-50 overflow-hidden">
                <MapContainer center={position} zoom={13} scrollWheelZoom={true} className="h-full w-full">
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={position}>
                    <Popup>
                      <div className="text-center">
                        <h2 className="text-sm text-[var(--textColor)] font-semibold dark:text-gray-200">FreshCart Grosery Store</h2>
                        <img
                          src="/assets/ourStoreImage.png"
                          alt="Office Location"
                          className="w-full h-20 object-contain mt-2 rounded dark:brightness-90"
                        />
                        <p className="text-xs font-semibold text-[var(--textColor)] dark:text-gray-300">Visit us for fresh groceries daily!</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-[var(--primaryColor)] dark:text-[#FFB74D] text-lg font-semibold mb-3">Call Us</h3>
                <p className="mb-2 text-sm dark:text-gray-300">Call us between 8:00am – 10:00pm.</p>
                <p className="font-medium text-sm dark:text-gray-200 hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] transition-colors duration-200 cursor-pointer">+1 (800) 123-4567</p>

                <h3 className="text-[var(--primaryColor)] dark:text-[#FFB74D] font-semibold text-lg mt-6 mb-3">Chat with us</h3>
                <ul className="text-sm space-y-3 dark:text-gray-300">
                  <li className='flex items-center gap-2 hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] transition-colors duration-200 cursor-pointer group'>
                    <BiMailSend className="text-[var(--primaryColor)] dark:text-[#FFB74D] group-hover:rotate-12 transition-transform duration-300" />
                    Send us your thoughts via chat</li>
                  <li className='flex items-center gap-2 hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] transition-colors duration-200 cursor-pointer group'>
                    <FaTwitter className="text-[var(--primaryColor)] dark:text-[#FFB74D] group-hover:rotate-12 transition-transform duration-300" />
                    Message us on Twitter</li>
                  <li className='flex items-center gap-2 hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] transition-colors duration-200 cursor-pointer group'>
                    <FaFacebookF className="text-[var(--primaryColor)] dark:text-[#FFB74D] group-hover:rotate-12 transition-transform duration-300" />
                    Message us on Facebook</li>
                </ul>

                <div className="flex gap-3 mt-6">
                  <div className="w-8 h-8 flex justify-center items-center rounded-full text-white bg-[var(--primaryColor)] dark:bg-gray-700 hover:bg-transparent hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] hover:border hover:border-[var(--primaryColor)] dark:hover:border-[#FFB74D] transition-all duration-200 cursor-pointer group">
                    <span className="group-hover:-rotate-y-180 transition-transform duration-500">
                      <BsInstagram />
                    </span>
                  </div>
                  <div className="w-8 h-8 flex justify-center items-center rounded-full text-white bg-[var(--primaryColor)] dark:bg-gray-700 hover:bg-transparent hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] hover:border hover:border-[var(--primaryColor)] dark:hover:border-[#FFB74D] transition-all duration-200 cursor-pointer group">
                    <span className="group-hover:-rotate-y-180 transition-transform duration-500">
                      <FaFacebookF />
                    </span>
                  </div>
                  <div className="w-8 h-8 flex justify-center items-center rounded-full text-white bg-[var(--primaryColor)] dark:bg-gray-700 hover:bg-transparent hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] hover:border hover:border-[var(--primaryColor)] dark:hover:border-[#FFB74D] transition-all duration-200 cursor-pointer group">
                    <span className="group-hover:-rotate-y-180 transition-transform duration-500">
                      <FaTwitter />
                    </span>
                  </div>
                  <div className="w-8 h-8 flex justify-center items-center rounded-full text-white bg-[var(--primaryColor)] dark:bg-gray-700 hover:bg-transparent hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] hover:border hover:border-[var(--primaryColor)] dark:hover:border-[#FFB74D] transition-all duration-200 cursor-pointer group">
                    <span className="group-hover:-rotate-y-180 transition-transform duration-500">
                      <FaLinkedinIn />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactUsPage
