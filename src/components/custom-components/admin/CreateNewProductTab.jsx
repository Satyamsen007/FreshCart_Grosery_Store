'use client'

import MultipleSelector from '@/components/ui/multipleSelect';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { uploadToCloudinary } from '@/helper/uploadToCloudinary';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { HiOutlineUpload } from "react-icons/hi";
import { toast } from 'sonner';
import { RxCross2 } from "react-icons/rx";
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { HashLoader } from 'react-spinners'
import { allCategorys, babyCareBrands, babyCareWeights, cleaningGoodBrands, cleaningGoodsWeights, coldDrinksBrands, coldDrinksWeights, cookingOilBrands, cookingOilsWeights, dairyProductBrands, dairyProductsWeights, freshBakeryBrands, freshBakeryWeights, freshFruitsBrands, freshFruitsWeights, frozenFoodBrands, frozenFoodsWeights, grainsCerealsBrands, grainsCerealsWeights, healthDrinkBrands, healthDrinksWeights, instantMealsBrands, instantMealsWeights, masalaZoneBrands, masalaZoneWeights, organicVagiesBrands, organicVagiesWeights, sweetTreatBrands, sweetTreatsWeights } from '../../../../public/assets/assets';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion'

const CreateNewProductTab = ({ setChangeToCreateProductTab }) => {
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageError, setImageError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState(Array(4).fill(false));

  useEffect(() => {
    const storedImages = localStorage.getItem('imageUrls');
    if (storedImages) {
      try {
        const parsedImages = JSON.parse(storedImages);
        setImageUrls(Array.isArray(parsedImages) ? parsedImages : []);
      } catch (error) {
        console.error("Failed to parse stored image URLs:", error);
        setImageUrls([]);
      }
    }
  }, []);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      variants: [{
        weight: '',
        regularPrice: '',
        discountPrice: '',
        stock: '',
        shippingFee: 0
      }],
      taxRate: 0
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants"
  });

  const variants = watch("variants");

  const onSubmit = async (data) => {
    const finalProduct = {
      ...data,
      images: imageUrls,
      variants: data.variants.filter(v => v.weight && v.regularPrice) // Remove empty variants
    };

    try {
      setCreatingProduct(true);
      const response = await axios.post('/api/create-product', finalProduct);
      if (response.data.success && response.status === 201) {
        toast.success('🎉 Product created successfully! It will appear in your store shortly.', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
          progress: undefined,
        });
        localStorage.removeItem('imageUrls');
        setChangeToCreateProductTab(false);
      }
    } catch (error) {
      console.error("Product creation failed:", error);
      let errorMessage = "Failed to create product. Please try again later.";

      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = "Please log in to create products.";
            break;
          case 403:
            errorMessage = "Admin privileges required to create products.";
            break;
          case 400:
            errorMessage = error.response.data.message || "Invalid product data. Please check all fields.";
            break;
          default:
            errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      toast.error(`❌ ${errorMessage}`, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    } finally {
      setCreatingProduct(false);
    }
  };

  const handleImageChange = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingStatus(prev => {
      const newStatus = [...prev];
      newStatus[index] = true;
      return newStatus;
    });

    try {
      const url = await uploadToCloudinary(file, 'freshCartStore/products/images');
      const updatedUrls = [...imageUrls];
      updatedUrls[index] = url;
      const trimmedUrls = updatedUrls.slice(0, 4);
      localStorage.setItem("imageUrls", JSON.stringify(trimmedUrls));
      setImageUrls(trimmedUrls);
      toast.success('Image uploaded successfully 🎉', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploadingStatus(prev => {
        const newStatus = [...prev];
        newStatus[index] = false;
        return newStatus;
      });
    }
  };

  const brandOptionsMap = {
    'Organic Veggies': organicVagiesBrands,
    'Fresh Fruits': freshFruitsBrands,
    'Cold Drinks': coldDrinksBrands,
    'Instant Meals': instantMealsBrands,
    'Dairy Products': dairyProductBrands,
    'Fresh Bakery': freshBakeryBrands,
    'Grains & Cereals': grainsCerealsBrands,
    'Frozen Foods': frozenFoodBrands,
    'Sweet Treats': sweetTreatBrands,
    'Cooking Oils': cookingOilBrands,
    'Baby Care': babyCareBrands,
    'Masala Zone': masalaZoneBrands,
    'Health Drinks': healthDrinkBrands,
    'Cleaning Goods': cleaningGoodBrands,
  };

  const weightOptionsMap = {
    'Organic Veggies': organicVagiesWeights,
    'Fresh Fruits': freshFruitsWeights,
    'Cold Drinks': coldDrinksWeights,
    'Instant Meals': instantMealsWeights,
    'Dairy Products': dairyProductsWeights,
    'Fresh Bakery': freshBakeryWeights,
    'Grains & Cereals': grainsCerealsWeights,
    'Frozen Foods': frozenFoodsWeights,
    'Sweet Treats': sweetTreatsWeights,
    'Cooking Oils': cookingOilsWeights,
    'Baby Care': babyCareWeights,
    'Masala Zone': masalaZoneWeights,
    'Health Drinks': healthDrinksWeights,
    'Cleaning Goods': cleaningGoodsWeights,
  };

  const selectedBrands = brandOptionsMap[selectedCategory];
  const selectedWeights = weightOptionsMap[selectedCategory] || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='my-5 w-full xl:h-[520px] max-sm:h-[350px] sm:h-[420px] overflow-auto srollbar-hidden border border-[var(--primaryColor)] dark:border-[#FFB74D] rounded-md p-4 dark:bg-gray-900'>
      {/* Product Images Section */}
      <div>
        <h2 className='text-sm font-semibold mb-3 text-[var(--textColor)] dark:text-white'>Product Snapshots</h2>
        <div>
          <div className='flex justify-evenly items-center max-lg:grid lg:grid-cols-none sm:grid-cols-2 max-sm:grid-cols-1 gap-6'>
            {[...Array(4)].map((_, index) => (
              imageUrls[index] ? (
                <div key={index} className='w-full p-1 h-28 border-2 relative border-[var(--primaryColor)]/40 dark:border-[#FFB74D]/40 rounded-md'>
                  <RxCross2 onClick={() => {
                    const updatedUrls = imageUrls.filter((_, i) => i !== index);
                    setImageUrls(updatedUrls);
                    localStorage.setItem('imageUrls', JSON.stringify(updatedUrls));
                  }} className='absolute -right-2 -top-2 cursor-pointer text-white rounded-full p-[2px] bg-[var(--primaryColor)] dark:bg-[#FFB74D] font-semibold text-xl' />
                  <Image src={imageUrls[index]} alt=' ' width={80} height={80} className='w-full h-full object-contain' />
                </div>
              ) : (
                <div key={index} className={`relative select-none w-full h-28 border-2 rounded-md flex flex-col items-center justify-center transition-all duration-200 ${!uploadingStatus[index] && uploadingStatus.some(status => status)
                  ? 'border-[var(--primaryColor)]/20 dark:border-[#FFB74D]/20 cursor-not-allowed z-10 bg-[var(--primaryColor)]/20 dark:bg-[#FFB74D]/20 opacity-70'
                  : 'border-[var(--textColor)]/80 dark:border-gray-600 cursor-pointer hover:border-[var(--primaryColor)] dark:hover:border-[#FFB74D] border-dashed group'
                  }`}>
                  {uploadingStatus[index] ? (
                    <div className='flex items-center justify-center'>
                      <HashLoader color="#4FBF8B" size={26} />
                    </div>
                  ) : (
                    <>
                      <HiOutlineUpload className={`text-xl transition-all duration-200 mb-2 ${!uploadingStatus[index] && uploadingStatus.some(status => status)
                        ? 'text-[var(--primaryColor)]/80 dark:text-[#FFB74D]/80'
                        : 'group-hover:text-[var(--primaryColor)] dark:group-hover:text-[#FFB74D] text-[var(--textColor)]/80 dark:text-gray-400'
                        }`} />
                      <p className={`transition-all duration-200 text-sm font-medium ${!uploadingStatus[index] && uploadingStatus.some(status => status)
                        ? 'text-[var(--primaryColor)]/80 dark:text-[#FFB74D]/80'
                        : 'text-[var(--textColor)]/80 dark:text-gray-400 group-hover:text-[var(--primaryColor)] dark:group-hover:text-[#FFB74D]'
                        }`}>Upload</p>
                      <input
                        onChange={(e) => handleImageChange(e, index)}
                        type="file"
                        className={`absolute w-full h-full opacity-0 ${!uploadingStatus[index] && uploadingStatus.some(status => status)
                          ? 'cursor-not-allowed pointer-events-none'
                          : 'cursor-pointer'
                          }`}
                        disabled={uploadingStatus.some(status => status)}
                      />
                    </>
                  )}
                </div>
              )
            ))}
          </div>
          {imageError && <p className="text-xs text-red-500 mt-2">{imageError}</p>}
        </div>
        <p className='text-xs text-[var(--textColor)]/90 dark:text-gray-300 mt-3'>⚠️ Tip: The first uploaded image will be shown as the primary display image for the product.</p>
      </div>

      {/* Basic Product Info */}
      <div className='flex flex-col mt-5'>
        <label htmlFor="productName" className='text-sm text-[var(--textColor)] dark:text-white font-semibold mb-1'>Product Name</label>
        <input
          {...register("name", { required: "Product name is required" })}
          type="text"
          id='productName'
          placeholder="What' s your product called?"
          className='w-1/2 max-lg:w-full p-3 text-[var(--textColor)] dark:text-white rounded-sm outline-none border border-[var(--textColor)]/30 dark:border-gray-600 font-medium text-sm dark:bg-gray-800'
        />
        {errors.name && <p className="text-xs text-red-500 mt-2">{errors.name.message}</p>}
      </div>

      <div className='mt-5'>
        <div className='flex flex-col'>
          <label htmlFor="productDescription" className="text-sm text-[var(--textColor)] dark:text-white font-semibold mb-1">
            Product Description
          </label>
          <textarea
            {...register("description", { required: "Product Description is required" })}
            id="productDescription"
            rows={9}
            placeholder='Enter a detailed and appealing product description...'
            className='w-1/2 max-lg:w-full p-3 text-[var(--textColor)] dark:text-white rounded-sm outline-none border border-[var(--textColor)]/30 dark:border-gray-600 font-medium text-sm resize-none dark:bg-gray-800'
          />
          {errors.description && <p className="text-xs text-red-500 mt-2">{errors.description.message}</p>}
        </div>
        <p className='text-xs text-[var(--textColor)]/90 dark:text-gray-300 mt-3'>📘 Reminder: A well-written description with key features, benefits, and usage tips attracts more customers.</p>
      </div>

      {/* Category and Brand */}
      <div className='mt-5 grid grid-cols-2 max-sm:grid-cols-1 gap-x-10 gap-y-6'>
        <div className='flex flex-col gap-1'>
          <label htmlFor="category" className='text-sm text-[var(--textColor)] dark:text-white font-semibold'>Category</label>
          <Controller
            name='category'
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  setSelectedCategory(val);
                  setValue('brand', '');
                }}
                value={field.value}
              >
                <SelectTrigger id="category" className="w-[70%] max-lg:w-full border border-[var(--textColor)]/30 dark:border-gray-600 dark:bg-gray-800 [&>span]:dark:text-gray-400 cursor-pointer">
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectGroup>
                    <SelectLabel className='text-[var(--textColor)] dark:text-white'>Category</SelectLabel>
                    {allCategorys.map((category, i) => (
                      <SelectItem key={i} value={category} className='text-[var(--textColor)] dark:text-white cursor-pointer'>{category}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
          )}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="brand" className='text-sm text-[var(--textColor)] dark:text-white font-semibold'>Brand</label>
          <Controller
            name='brand'
            control={control}
            render={({ field }) => (
              <Select disabled={!selectedBrands?.length} onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="brand" className={`w-[70%] max-lg:w-full border ${!selectedBrands?.length
                  ? '!border-[var(--primaryColor)]/20 dark:!border-[#FFB74D]/20 !text-[var(--primaryColor)]/90 dark:!text-[#FFB74D]/90 !bg-[var(--primaryColor)]/20 dark:!bg-[#FFB74D]/20 !opacity-70 [&>span]:dark:text-[#FFB74D]/70'
                  : 'border-[var(--textColor)]/30 dark:border-gray-600 dark:bg-gray-800 [&>span]:dark:text-gray-400'
                  } cursor-pointer`}>
                  <SelectValue placeholder={!selectedBrands?.length ? "Select a category first" : "Select a Brand"} />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectGroup>
                    {selectedBrands && (
                      <>
                        <SelectLabel className='text-[var(--textColor)] dark:text-white'>{selectedCategory}</SelectLabel>
                        {selectedBrands.map((brand, i) => (
                          <SelectItem key={i} value={brand} className='text-[var(--textColor)] dark:text-white cursor-pointer'>
                            {brand}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Variants Section */}
      <div className="mt-5">
        <h3 className="text-sm font-semibold mb-3 text-[var(--textColor)] dark:text-white">Product Variants</h3>

        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 max-sm:grid-cols-1 gap-x-10 gap-y-6 mb-6 p-4 border border-[var(--primaryColor)]/20 dark:border-[#FFB74D]/20 rounded-md dark:bg-gray-800">
              <div className="col-span-2 flex justify-between items-center">
                <h4 className="text-sm font-medium dark:text-white">Variant #{index + 1}</h4>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 cursor-pointer text-xs flex items-center"
                  >
                    <RxCross2 className="mr-1" /> Remove
                  </button>
                )}
              </div>

              {/* Weight */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className='flex flex-col gap-1'>
                <label className='text-sm text-[var(--textColor)] dark:text-white font-semibold'>Weight</label>
                <Controller
                  name={`variants.${index}.weight`}
                  control={control}
                  rules={{ required: "Weight is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedWeights.length}
                    >
                      <SelectTrigger className={`w-full border ${!selectedWeights.length
                        ? '!border-[var(--primaryColor)]/20 dark:!border-[#FFB74D]/20 !text-[var(--primaryColor)]/90 dark:!text-[#FFB74D]/90 !bg-[var(--primaryColor)]/20 dark:!bg-[#FFB74D]/20 !opacity-70 [&>span]:dark:text-[#FFB74D]/70'
                        : 'border-[var(--textColor)]/30 dark:border-gray-600 dark:bg-gray-800 [&>span]:dark:text-gray-400'
                        } cursor-pointer`}>
                        <SelectValue placeholder={!selectedWeights.length ? "Select a category first" : "Select weight"} />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        <SelectGroup>
                          {selectedWeights?.map((weight, i) => (
                            <SelectItem key={i} value={weight} className="dark:text-white cursor-pointer">{weight}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.variants?.[index]?.weight && (
                  <p className="text-xs text-red-500 mt-1">{errors.variants[index].weight.message}</p>
                )}
              </motion.div>

              {/* Regular Price */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className='flex flex-col gap-1'>
                <label className='text-sm text-[var(--textColor)] dark:text-white font-semibold'>Regular Price</label>
                <input
                  {...register(`variants.${index}.regularPrice`, {
                    required: "Price is required",
                    valueAsNumber: true
                  })}
                  type="number"
                  placeholder="Regular price"
                  className='w-full p-2 text-[var(--textColor)] dark:text-white rounded-sm outline-none border border-[var(--textColor)]/30 dark:border-gray-600 font-medium text-sm dark:bg-gray-800'
                />
                {errors.variants?.[index]?.regularPrice && (
                  <p className="text-xs text-red-500 mt-1">{errors.variants[index].regularPrice.message}</p>
                )}
              </motion.div>

              {/* Discount Price */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='flex flex-col gap-1'>
                <label className='text-sm text-[var(--textColor)] dark:text-white font-semibold'>Discount Price</label>
                <input
                  {...register(`variants.${index}.discountPrice`, {
                    valueAsNumber: true,
                    validate: (value) => {
                      if (value && value >= variants[index]?.regularPrice) {
                        return "Discount must be less than regular price";
                      }
                      return true;
                    }
                  })}
                  type="number"
                  placeholder="Discount price"
                  className='w-full p-2 text-[var(--textColor)] dark:text-white rounded-sm outline-none border border-[var(--textColor)]/30 dark:border-gray-600 font-medium text-sm dark:bg-gray-800'
                />
                {errors.variants?.[index]?.discountPrice && (
                  <p className="text-xs text-red-500 mt-1">{errors.variants[index].discountPrice.message}</p>
                )}
              </motion.div>

              {/* Stock */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className='flex flex-col gap-1'>
                <label className='text-sm text-[var(--textColor)] dark:text-white font-semibold'>Stock</label>
                <input
                  {...register(`variants.${index}.stock`, {
                    required: "Stock is required",
                    valueAsNumber: true,
                    min: 0
                  })}
                  type="number"
                  placeholder="Available stock"
                  className='w-full p-2 text-[var(--textColor)] dark:text-white rounded-sm outline-none border border-[var(--textColor)]/30 dark:border-gray-600 font-medium text-sm dark:bg-gray-800'
                />
                {errors.variants?.[index]?.stock && (
                  <p className="text-xs text-red-500 mt-1">{errors.variants[index].stock.message}</p>
                )}
              </motion.div>

              {/* Shipping Fee */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className='flex flex-col gap-1'>
                <label className='text-sm text-[var(--textColor)] dark:text-white font-semibold'>Shipping Fee</label>
                <input
                  {...register(`variants.${index}.shippingFee`, {
                    valueAsNumber: true,
                    min: 0
                  })}
                  type="number"
                  placeholder="Shipping fee"
                  className='w-full p-2 text-[var(--textColor)] dark:text-white rounded-sm outline-none border border-[var(--textColor)]/30 dark:border-gray-600 font-medium text-sm dark:bg-gray-800'
                />
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => append({
            weight: '',
            regularPrice: '',
            discountPrice: '',
            stock: '',
            shippingFee: 0
          })}
          className="mt-2 text-sm text-[var(--primaryColor)] dark:text-[#FFB74D] cursor-pointer flex items-center"
        >
          + Add Another Variant
        </button>
      </div>

      {/* Tax Rate */}
      <div className='mt-5 grid grid-cols-2 max-sm:grid-cols-1 gap-x-10 gap-y-6'>
        <div className='flex flex-col gap-1'>
          <label htmlFor="taxRate" className='text-sm text-[var(--textColor)] dark:text-white font-semibold'>Tax Rate (%)</label>
          <input
            {...register("taxRate", {
              required: "Tax Rate is required",
              valueAsNumber: true,
              min: 0,
              max: 100
            })}
            type="number"
            id='taxRate'
            placeholder='Enter tax rate (e.g. 5)'
            className='w-[70%] max-lg:w-full p-2 text-[var(--textColor)] dark:text-white rounded-sm outline-none border border-[var(--textColor)]/30 dark:border-gray-600 font-medium text-sm dark:bg-gray-800'
          />
          {errors.taxRate && (
            <p className="text-xs text-red-500 mt-1">{errors.taxRate.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className='w-full flex items-center justify-center mt-10 mb-5'>
        <button
          type='submit'
          disabled={creatingProduct || imageUrls.length < 3}
          className={`xl:w-[30%] max-sm:w-full sm:w-[50%] font-semibold rounded-md border py-3 transition-all duration-200 select-none text-sm relative ${creatingProduct || imageUrls.length < 3
            ? 'bg-[var(--primaryColor)]/50 dark:bg-[#FFB74D]/50 border-[var(--primaryColor)]/30 dark:border-[#FFB74D]/30 text-white/70 cursor-not-allowed'
            : 'bg-[var(--primaryColor)] dark:bg-[#FFB74D] border-[var(--primaryColor)] dark:border-[#FFB74D] text-white cursor-pointer hover:bg-transparent hover:border-[var(--primaryColor)] dark:hover:border-[#FFB74D] hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] dark:hover:bg-transparent'
            }`}
        >
          {creatingProduct ? (
            <div className="flex items-center justify-center gap-2">
              <HashLoader color="#ffffff" size={20} />
              <span>Creating...</span>
            </div>
          ) : imageUrls.length < 3 ? (
            'Upload at least 3 images'
          ) : (
            'Drop in the Store'
          )}
        </button>
      </div>
    </form>
  )
}

export default CreateNewProductTab;