'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react"
import { useAdminCustomers } from "@/hooks/useAdminCustomers"
import { format } from 'date-fns'
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { MapPin, Phone, Mail, Users } from "lucide-react"
import Image from "next/image"
import { assets } from "../../../../public/assets/assets"
import { FiPackage } from "react-icons/fi"

const CUSTOMERS_PER_PAGE = 5

const DashboardCustomerTab = () => {
  const { status } = useSession()
  const [currentPage, setCurrentPage] = useState(1)
  const { customers = [], totalPages = 1, loading, error } = useAdminCustomers(currentPage, CUSTOMERS_PER_PAGE)
  const [imageLoaded, setImageLoaded] = useState({});

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const isLoading = loading || status === 'loading'

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 dark:text-red-400">
        Error loading customers: {error}
      </div>
    )
  }

  return (
    <div className="w-full h-[90vh] relative overflow-hidden dark:bg-gray-900">
      {/* Decorative image */}
      <div className="xl:w-[250px] xl:h-[250px] max-md:w-[160px] max-md:h-[160px] md:w-[210px] md:h-[210px] absolute right-0 -bottom-[62px] max-md:-bottom-[40px] z-10">
        <Image
          src={assets.DashboardRightBottomCornerImage}
          alt="Decorative dashboard illustration"
          fill
          className="object-contain dark:opacity-80"
          sizes="(max-width: 768px) 180px, (max-width: 1024px) 230px, 250px"
          priority
        />
      </div>

      <div className="xl:h-[520px] max-sm:h-[350px] sm:h-[420px] overflow-y-scroll max-sm:border max-sm:border-[var(--primaryColor)] max-sm:mt-5 max-sm:rounded-md max-sm:p-4 p-7 srollbar-hidden dark:bg-gray-900">

        <div className="flex justify-between items-center max-md:flex-col max-md:gap-2">
          <div className="flex items-center gap-3 text-base max-sm:text-sm text-[var(--textColor)] dark:text-white font-semibold">
            <Users className="dark:text-[#FFB74D]" />
            <h4>Manage Customers</h4>
          </div>
        </div>
        {/* Table */}
        <Table className="sm:border max-sm:border-b border-[var(--primaryColor)] sm:my-5 max-sm:mb-3 dark:border-gray-700">
          <TableHeader>
            <TableRow className="border-b border-[var(--primaryColor)] dark:border-gray-700">
              {isLoading ? (
                <>
                  <TableHead>
                    <Skeleton className="h-6 bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-6 w-[100px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-6 w-[150px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-6 w-[100px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                  </TableHead>
                </>
              ) : (
                <>
                  <TableHead className="text-[var(--textColor)] dark:text-white font-semibold">Customer</TableHead>
                  <TableHead className="text-[var(--textColor)] dark:text-white font-semibold text-center">Contact Info</TableHead>
                  <TableHead className="text-[var(--textColor)] dark:text-white font-semibold text-center">Address</TableHead>
                  <TableHead className="text-[var(--textColor)] dark:text-white font-semibold text-center">Joined Date</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              // Skeleton Loading State
              [...Array(CUSTOMERS_PER_PAGE)].map((_, i) => (
                <TableRow key={`skeleton-${i}`} className="border-b border-[var(--primaryColor)] dark:border-gray-700">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-14 h-14 rounded-full bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-[100px] bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[150px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-[100px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-[200px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-[100px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                  </TableCell>
                </TableRow>
              ))
            ) : customers.length > 0 ? (
              // Actual Customers
              customers.map((customer) => (
                <TableRow key={customer._id} className="border-b border-[var(--primaryColor)] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[var(--primaryColor)]/10 dark:bg-gray-700">
                        {customer.avatar || customer.avatar?.url ? (
                          <>
                            <Image
                              src={customer.avatar.url}
                              alt={customer.fullName}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 56px, 56px"
                              priority={false}
                              quality={75}
                              unoptimized={process.env.NODE_ENV !== 'production'}
                            />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xl text-[var(--primaryColor)] dark:text-white font-semibold">
                              {customer.fullName?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--textColor)]/90 dark:text-gray-200">{customer.fullName}</p>
                        <p className="text-xs text-[var(--textColor)]/60 dark:text-gray-400">ID: {customer._id.slice(-6)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-center gap-1 text-[var(--textColor)]/90 dark:text-gray-200">
                            <Mail size={14} />
                            <span className="text-sm">{customer.email}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white dark:bg-gray-800 text-[var(--textColor)] dark:text-gray-200 border border-[var(--primaryColor)] dark:border-gray-700">
                          <p>Email Address</p>
                        </TooltipContent>
                      </Tooltip>
                      {customer.phone && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center gap-1 text-[var(--textColor)]/90 dark:text-gray-200">
                              <Phone size={14} />
                              <span className="text-sm">{customer.phone}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white dark:bg-gray-800 text-[var(--textColor)] dark:text-gray-200 border border-[var(--primaryColor)] dark:border-gray-700">
                            <p>Phone Number</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.address ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-center gap-1 text-[var(--textColor)]/90 dark:text-gray-200">
                            <MapPin size={14} />
                            <span className="text-sm line-clamp-1">
                              {customer.address.street}, {customer.address.city}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white dark:bg-gray-800 text-[var(--textColor)] dark:text-gray-200 border border-[var(--primaryColor)] dark:border-gray-700">
                          <p className="max-w-[200px] text-sm">
                            {customer.address.street}, {customer.address.city}, {customer.address.state} {customer.address.zipCode}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="text-sm text-[var(--textColor)]/60 dark:text-gray-400">No address provided</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-[var(--textColor)]/90 dark:text-gray-200">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm">{format(new Date(customer.createdAt), 'MMM d, yyyy')}</span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white dark:bg-gray-800 text-[var(--textColor)] dark:text-gray-200 border border-[var(--primaryColor)] dark:border-gray-700">
                        <p>Joined on {format(new Date(customer.createdAt), 'MMMM d, yyyy')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : !isLoading && (
              // Empty State
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-[var(--textColor)]/80 dark:text-gray-300">No customers found</p>
                    <p className="text-sm text-[var(--textColor)]/60 dark:text-gray-400">Customers will appear here when they register</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination - only show if not loading and customers exist */}
        {!isLoading && customers.length > 0 && totalPages > 1 && (
          <Pagination className='max-sm:mb-5'>
            <PaginationContent className="flex justify-center">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    changePage(currentPage - 1)
                  }}
                  className={`${currentPage === 1 ? "pointer-events-none opacity-50" : ""} dark:text-gray-200 dark:hover:bg-gray-800`}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      changePage(i + 1)
                    }}
                    isActive={currentPage === i + 1}
                    className="dark:text-gray-200 dark:hover:bg-gray-800 dark:data-[active=true]:bg-[#FFB74D] dark:data-[active=true]:text-white"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    changePage(currentPage + 1)
                  }}
                  className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : ""} dark:text-gray-200 dark:hover:bg-gray-800`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>

  )
}

export default DashboardCustomerTab