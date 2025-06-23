'use client'

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Home, Briefcase, X, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from '@/store/features/addressSlice';
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DeliveryAddressesPage = () => {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);
  const { data: session, status } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: 'home',
    contact: {
      name: '',
      phone: '',
      email: '',
    },
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isPrimary: false
  });

  useEffect(() => {
    if (session) {
      dispatch(fetchAddresses());
    }
  }, [dispatch, session]);

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        type: editingAddress.type,
        contact: {
          name: editingAddress.contact.name,
          phone: editingAddress.contact.phone,
          email: editingAddress.contact.email,
        },
        street: editingAddress.street,
        city: editingAddress.city,
        state: editingAddress.state,
        postalCode: editingAddress.postalCode,
        country: editingAddress.country,
        isPrimary: editingAddress.isPrimary
      });
    }
  }, [editingAddress]);

  const isLoading = loading || status === 'loading'
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await dispatch(updateAddress({ addressId: editingAddress._id, addressData: formData })).unwrap();
        toast.success('Address updated successfully');
      } else {
        await dispatch(addAddress(formData)).unwrap();
        toast.success('Address added successfully');
      }
      setShowAddModal(false);
      setEditingAddress(null);
      resetForm();
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await dispatch(deleteAddress(addressId)).unwrap();
      toast.success('Address deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete address');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      contact: {
        name: '',
        phone: '',
        email: '',
      },
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isPrimary: false
    });
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowAddModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] bg-gray-50/30 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="w-full sm:w-auto">
              <div className='flex items-center gap-2'>
                <Skeleton className="w-6 h-6 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                <Skeleton className="h-8 w-48 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
              </div>
              <Skeleton className="h-1 w-full mt-1 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
            </div>
            <Skeleton className="h-10 w-40 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-8 w-8 rounded-full bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                  <div>
                    <Skeleton className="h-6 w-24 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                    <Skeleton className="h-4 w-16 mt-1 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-5 w-40 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                  <Skeleton className="h-5 w-32 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-full bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-3/4 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-1/2 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-2/3 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                </div>

                <div className="mt-6 flex gap-4">
                  <Skeleton className="h-9 flex-1 dark:bg-gray-700" />
                  <Skeleton className="h-9 flex-1 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-gray-50/30 dark:bg-gray-900 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto"
          >
            <div className="relative w-32 h-32 mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-[var(--primaryColor)]/10 dark:bg-[#FFB74D]/10 rounded-full"
              />
              <MapPin className="w-full h-full text-[var(--primaryColor)]/70 dark:text-[#FFB74D]/70 p-6" />
            </div>
            <h3 className="text-2xl font-semibold text-[var(--textColor)] dark:text-white mb-3">No Addresses Found</h3>
            <p className="text-[var(--textColor)]/60 dark:text-gray-400 mb-8 max-w-sm">
              You haven't added any delivery addresses yet. Add your first address to get started with your shopping experience.
            </p>
            <Button
              className="flex items-center cursor-pointer gap-2 bg-[var(--primaryColor)] hover:bg-[var(--primaryColor)]/90 dark:bg-[#FFB74D] dark:hover:bg-[#FFB74D]/90 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                setEditingAddress(null);
                resetForm();
                setShowAddModal(true);
              }}
            >
              <Plus className="w-5 h-5" />
              Add Your First Address
            </Button>
          </motion.div>
        </div>
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
              onClick={() => {
                setShowAddModal(false);
                setEditingAddress(null);
                resetForm();
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl h-[80vh] max-sm:h-[70vh] overflow-y-auto p-4 sm:p-6 w-full xl:mt-14 max-w-lg srollbar-hidden sm:my-0"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base sm:text-xl font-semibold text-[var(--textColor)] dark:text-white">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-[var(--primaryColor)]/10 dark:hover:bg-[#FFB74D]/10 cursor-pointer rounded-full"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingAddress(null);
                      resetForm();
                    }}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-[var(--textColor)] dark:text-gray-200 sm:space-y-6">
                  <div className="space-y-4">
                    <Label className="dark:text-gray-200">Address Type</Label>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={(value) => handleInputChange({ target: { name: 'type', value } })}
                      className="flex flex-wrap gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem className='cursor-pointer' value="home" id="home" />
                        <Label htmlFor="home" className="flex cursor-pointer items-center gap-2 dark:text-gray-200">
                          <Home className="w-4 h-4" /> Home
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem className='cursor-pointer' value="work" id="work" />
                        <Label htmlFor="work" className="flex cursor-pointer items-center gap-2 dark:text-gray-200">
                          <Briefcase className="w-4 h-4" /> Work
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem className='cursor-pointer' value="other" id="other" />
                        <Label htmlFor="other" className="flex cursor-pointer items-center gap-2 dark:text-gray-200">
                          <Building2 className="w-4 h-4" /> Other
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact.name" className="dark:text-gray-200">Full Name</Label>
                      <Input
                        id="contact.name"
                        name="contact.name"
                        value={formData.contact.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact.phone" className="dark:text-gray-200">Phone Number</Label>
                      <Input
                        id="contact.phone"
                        name="contact.phone"
                        value={formData.contact.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        type='number'
                        required
                        pattern="^[6-9]\d{9}$"
                        title="Please enter a valid 10-digit phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact.email" className="dark:text-gray-200">Email Address</Label>
                    <Input
                      id="contact.email"
                      name="contact.email"
                      type="email"
                      className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      value={formData.contact.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street" className="dark:text-gray-200">Street Address</Label>
                    <Input
                      id="street"
                      name="street"
                      className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="dark:text-gray-200">City</Label>
                      <Input
                        id="city"
                        className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Mumbai"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="dark:text-gray-200">State</Label>
                      <Input
                        id="state"
                        className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Maharashtra"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="dark:text-gray-200">Postal Code</Label>
                      <Input
                        id="postalCode"
                        className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="400001"
                        type='number'
                        required
                        pattern="^\d{6}$"
                        title="Please enter a valid 6-digit postal code"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="dark:text-gray-200">Country</Label>
                      <Input
                        id="country"
                        className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPrimary"
                      name="isPrimary"
                      checked={formData.isPrimary}
                      onChange={(e) => handleInputChange({ target: { name: 'isPrimary', value: e.target.checked } })}
                      className="rounded border-gray-300 dark:border-gray-600 text-[var(--primaryColor)] dark:text-[#FFB74D] focus:ring-[var(--primaryColor)] dark:focus:ring-[#FFB74D]"
                    />
                    <Label htmlFor="isPrimary" className="dark:text-gray-200">Set as default address</Label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingAddress(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 cursor-pointer bg-[var(--primaryColor)] hover:bg-[var(--primaryColor)]/90 dark:bg-[#FFB74D] dark:hover:bg-[#FFB74D]/90"
                    >
                      {editingAddress ? 'Update Address' : 'Save Address'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50/30 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full sm:w-auto"
          >
            <div className='flex items-center gap-2'>
              <MapPin className="w-6 h-6 text-[var(--primaryColor)] dark:text-[#FFB74D]" />
              <h1 className="text-xl sm:text-2xl text-[var(--textColor)] dark:text-white font-semibold">Delivery Addresses</h1>
            </div>
            <span className="block w-full mt-1 h-1 bg-gradient-to-r from-[var(--primaryColor)] dark:from-[#FFB74D] rounded-md to-transparent mb-4 sm:mb-8"></span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full sm:w-auto"
          >
            <Button
              className="w-full sm:w-auto flex items-center cursor-pointer gap-2 bg-[var(--primaryColor)] hover:bg-[var(--primaryColor)]/90 dark:bg-[#FFB74D] dark:hover:bg-[#FFB74D]/90 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                setEditingAddress(null);
                resetForm();
                setShowAddModal(true);
              }}
            >
              <Plus className="w-5 h-5" />
              Add New Address
            </Button>
          </motion.div>
        </div>

        <div className="max-w-8xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            layout
          >
            <AnimatePresence>
              {addresses.map((address) => (
                <motion.div
                  key={address._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="group bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 sm:p-6 hover:border-[var(--primaryColor)] dark:hover:border-[#FFB74D] transition-all duration-300 shadow-md hover:shadow-xl relative overflow-hidden w-full"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-[var(--primaryColor)] dark:bg-[#FFB74D] pattern-grid-lg" />
                  </div>

                  <div className="relative">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--primaryColor)]/10 dark:bg-[#FFB74D]/10 rounded-full">
                          {address.type === 'home' ? (
                            <Home className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--primaryColor)] dark:text-[#FFB74D]" />
                          ) : address.type === 'work' ? (
                            <Briefcase className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--primaryColor)] dark:text-[#FFB74D]" />
                          ) : (
                            <Building2 className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--primaryColor)] dark:text-[#FFB74D]" />
                          )}
                        </div>
                        <div>
                          <span className="capitalize font-medium text-base sm:text-lg text-[var(--textColor)] dark:text-white">{address.type}</span>
                          {address.isPrimary && (
                            <span className="ml-2 text-xs bg-[var(--primaryColor)]/10 dark:bg-[#FFB74D]/10 text-[var(--primaryColor)] dark:text-[#FFB74D] px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-xs sm:text-sm text-[var(--textColor)]/80 dark:text-gray-300">
                      <p className="font-medium text-sm sm:text-base text-[var(--textColor)] dark:text-white">{address.contact.name}</p>
                      <p className="font-medium text-[var(--primaryColor)] dark:text-[#FFB74D]">{address.contact.phone}</p>
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} - {address.postalCode}</p>
                      <p>{address.country}</p>
                      <p className="text-xs text-[var(--textColor)]/60 dark:text-gray-400">{address.contact.email}</p>
                    </div>

                    <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-4">
                      <Button
                        variant="outline"
                        className="flex-1 text-xs cursor-pointer sm:text-sm border-[var(--primaryColor)] dark:border-[#FFB74D] text-[var(--primaryColor)] dark:text-[#FFB74D] hover:bg-[var(--primaryColor)]/10 dark:hover:bg-[#FFB74D]/10 transition-colors duration-300"
                        onClick={() => handleEdit(address)}
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 text-xs cursor-pointer sm:text-sm border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300"
                          >
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="dark:text-white">Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="dark:text-gray-300">
                              This action cannot be undone. This will permanently delete your address.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(address._id)}
                              className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => {
              setShowAddModal(false);
              setEditingAddress(null);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl h-[80vh] max-sm:h-[70vh] overflow-y-auto p-4 sm:p-6 w-full xl:mt-14 max-w-lg srollbar-hidden sm:my-0"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base sm:text-xl font-semibold text-[var(--textColor)] dark:text-white">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-[var(--primaryColor)]/10 dark:hover:bg-[#FFB74D]/10 cursor-pointer rounded-full"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingAddress(null);
                    resetForm();
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-[var(--textColor)] dark:text-gray-200 sm:space-y-6">
                <div className="space-y-4">
                  <Label className="dark:text-gray-200">Address Type</Label>
                  <RadioGroup
                    value={formData.type}
                    onValueChange={(value) => handleInputChange({ target: { name: 'type', value } })}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem className='cursor-pointer' value="home" id="home" />
                      <Label htmlFor="home" className="flex cursor-pointer items-center gap-2 dark:text-gray-200">
                        <Home className="w-4 h-4" /> Home
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem className='cursor-pointer' value="work" id="work" />
                      <Label htmlFor="work" className="flex cursor-pointer items-center gap-2 dark:text-gray-200">
                        <Briefcase className="w-4 h-4" /> Work
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem className='cursor-pointer' value="other" id="other" />
                      <Label htmlFor="other" className="flex cursor-pointer items-center gap-2 dark:text-gray-200">
                        <Building2 className="w-4 h-4" /> Other
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact.name" className="dark:text-gray-200">Full Name</Label>
                    <Input
                      id="contact.name"
                      name="contact.name"
                      value={formData.contact.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact.phone" className="dark:text-gray-200">Phone Number</Label>
                    <Input
                      id="contact.phone"
                      name="contact.phone"
                      value={formData.contact.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      type='number'
                      required
                      pattern="^[6-9]\d{9}$"
                      title="Please enter a valid 10-digit phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact.email" className="dark:text-gray-200">Email Address</Label>
                  <Input
                    id="contact.email"
                    name="contact.email"
                    type="email"
                    className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    value={formData.contact.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street" className="dark:text-gray-200">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="dark:text-gray-200">City</Label>
                    <Input
                      id="city"
                      className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="dark:text-gray-200">State</Label>
                    <Input
                      id="state"
                      className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Maharashtra"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="dark:text-gray-200">Postal Code</Label>
                    <Input
                      id="postalCode"
                      className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      type='number'
                      required
                      pattern="^\d{6}$"
                      title="Please enter a valid 6-digit postal code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="dark:text-gray-200">Country</Label>
                    <Input
                      id="country"
                      className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPrimary"
                    name="isPrimary"
                    checked={formData.isPrimary}
                    onChange={(e) => handleInputChange({ target: { name: 'isPrimary', value: e.target.checked } })}
                    className="rounded border-gray-300 dark:border-gray-600 text-[var(--primaryColor)] dark:text-[#FFB74D] focus:ring-[var(--primaryColor)] dark:focus:ring-[#FFB74D]"
                  />
                  <Label htmlFor="isPrimary" className="dark:text-gray-200">Set as default address</Label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingAddress(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 cursor-pointer bg-[var(--primaryColor)] hover:bg-[var(--primaryColor)]/90 dark:bg-[#FFB74D] dark:hover:bg-[#FFB74D]/90"
                  >
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeliveryAddressesPage;