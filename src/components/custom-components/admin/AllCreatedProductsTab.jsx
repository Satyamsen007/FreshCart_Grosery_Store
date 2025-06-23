import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TbEdit } from "react-icons/tb"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useEffect, useState } from "react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit } from "lucide-react"
import { RiDeleteBin7Fill } from "react-icons/ri"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useAdminProducts } from "@/hooks/useAdminProducts"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import { useDispatch } from "react-redux"
import { fetchAdminProducts } from "@/store/features/getAdminProductsSlice"

const PRODUCTS_PER_PAGE = 5

const AllCreatedProductsTab = () => {
  const { status } = useSession()
  const [currentPage, setCurrentPage] = useState(1)
  const { products = [], totalPages = 1, loading, error } = useAdminProducts(currentPage, PRODUCTS_PER_PAGE)
  const [imageLoaded, setImageLoaded] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleImageLoad = (productId) => {
    setImageLoaded(prev => ({ ...prev, [productId]: true }));
  };

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setImageLoaded({});
    }
  }

  const getProductSummary = (product) => {
    if (!product.variants || product.variants.length === 0) {
      return {
        priceRange: `₹${product.regularPrice || 0}`,
        discountRange: product.discountPrice ? `₹${product.discountPrice}` : '-',
        totalStock: product.stock || 0,
        hasDiscount: !!product.discountPrice
      };
    }

    const prices = product.variants.map(v => v.regularPrice);
    const discounts = product.variants.filter(v => v.discountPrice).map(v => v.discountPrice);
    const stocks = product.variants.map(v => v.stock || 0);

    return {
      priceRange: prices.length > 0
        ? `₹${Math.min(...prices)} - ₹${Math.max(...prices)}`
        : '-',
      discountRange: discounts.length > 0
        ? `₹${Math.min(...discounts)} - ₹${Math.max(...discounts)}`
        : '-',
      totalStock: stocks.reduce((sum, stock) => sum + stock, 0),
      hasDiscount: discounts.length > 0
    };
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);

    try {
      const response = await axios.delete(`/api/admin-products?productId=${productToDelete}`);
      toast.success('Product deleted successfully');
      dispatch(fetchAdminProducts({ page: currentPage, limit: PRODUCTS_PER_PAGE }));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const confirmDelete = (productId) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const isLoading = loading || status === 'loading'

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 dark:text-red-400">
        Error loading products: {error}
      </div>
    )
  }

  return (
    <div className="xl:h-[520px] max-sm:h-[350px] sm:h-[420px] max-md:overflow-y-scroll max-sm:border max-sm:border-[var(--primaryColor)] max-sm:mt-5 max-sm:rounded-md srollbar-hidden dark:bg-gray-900">
      {/* Table */}
      <Table className="sm:border max-sm:border-b border-[var(--primaryColor)] sm:my-5 max-sm:mb-3 dark:border-gray-700">
        <TableHeader>
          <TableRow className="border-b border-[var(--primaryColor)] dark:border-gray-700">
            {
              status === 'loading' ? (
                <>
                  <TableHead>
                    <Skeleton className="h-6 bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Skeleton className="h-6 w-[100px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                  </TableHead>
                  <TableHead className="w-[150px]">
                    <Skeleton className="h-6 w-[80px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                  </TableHead>
                  <TableHead className="w-[150px] hidden md:table-cell">
                    <Skeleton className="h-6 w-[80px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                  </TableHead>
                  <TableHead className="w-[150px]">
                    <Skeleton className="h-6 w-[60px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                  </TableHead>
                  <TableHead className="w-[150px] hidden md:table-cell">
                    <Skeleton className="h-6 w-[60px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                  </TableHead>
                  <TableHead className="w-[130px]">
                    <Skeleton className="h-6 w-[80px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                  </TableHead>
                </>
              ) : (
                <>
                  <TableHead className="text-[var(--textColor)] dark:text-white font-semibold">Product</TableHead>
                  <TableHead className="text-[var(--textColor)] dark:text-white hidden md:table-cell font-semibold text-center">Category</TableHead>
                  <TableHead className="w-[150px] text-[var(--textColor)] dark:text-white font-semibold text-center">Price</TableHead>
                  <TableHead className="w-[150px] hidden md:table-cell text-[var(--textColor)] dark:text-white font-semibold text-center">Discount</TableHead>
                  <TableHead className="w-[150px] text-[var(--textColor)] dark:text-white font-semibold text-center">Stock</TableHead>
                  <TableHead className="w-[150px] hidden md:table-cell text-[var(--textColor)] dark:text-white font-semibold text-center">Sold</TableHead>
                  <TableHead className="w-[130px] text-[var(--textColor)] dark:text-white font-semibold text-center">Actions</TableHead>
                </>
              )
            }
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            // Skeleton Loading State
            [...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
              <TableRow key={`skeleton-${i}`} className="border-b border-[var(--primaryColor)] dark:border-gray-700">
                <TableCell className="font-medium">
                  <div className="flex items-center max-sm:flex-col gap-2">
                    <Skeleton className="w-14 h-14 rounded-md bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                    <Skeleton className="h-4 w-[100px] bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                  </div>
                </TableCell>
                <TableCell className="text-center hidden md:table-cell">
                  <Skeleton className="h-4 w-[80px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-[50px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                </TableCell>
                <TableCell className="text-center hidden md:table-cell">
                  <Skeleton className="h-4 w-[50px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-[30px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                </TableCell>
                <TableCell className="text-center hidden md:table-cell">
                  <Skeleton className="h-4 w-[30px] mx-auto bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 mx-auto rounded-md bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                </TableCell>
              </TableRow>
            ))
          ) : products.length > 0 ? (
            // Actual Products
            products.map((product) => {
              const summary = getProductSummary(product);

              return <TableRow key={product._id} className="border-b border-[var(--primaryColor)] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <TableCell className="font-medium">
                  <div className="flex items-center max-sm:flex-col gap-2">
                    <div className="relative w-14 h-14 max-md:w-10 flex items-center justify-center max-md:h-10">
                      {product.images?.[0]?.url ? (
                        <>
                          {!imageLoaded[product._id] && (
                            <Skeleton className="absolute inset-0 w-full h-full bg-[var(--primaryColor)]/40 dark:bg-gray-700 rounded-md" />
                          )}
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 40px, 56px"
                            priority={false}
                            loading="lazy"
                            quality={75}
                            onLoad={() => handleImageLoad(product._id)}
                            unoptimized={process.env.NODE_ENV !== 'production'}
                          />
                        </>
                      ) : (
                        <div className="bg-gray-200 dark:bg-gray-700 w-full h-full flex items-center justify-center rounded-md">
                          <span className="text-xs dark:text-gray-300">No Image</span>
                        </div>
                      )}
                    </div>
                    {!imageLoaded[product._id] ? (
                      <Skeleton className="h-4 w-[100px] bg-[var(--primaryColor)]/40 dark:bg-gray-700" />
                    ) : (
                      <div>
                        <p className="text-sm text-[var(--textColor)]/90 dark:text-gray-200">{product.name}</p>
                        {product.variants?.length > 0 && (
                          <p className="text-xs text-[var(--textColor)]/60 dark:text-gray-400 mt-1">
                            {product.variants.length} variants
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center hidden md:table-cell text-[var(--textColor)]/90 dark:text-gray-200">
                  {product.category}
                </TableCell>
                <TableCell className="text-center text-[var(--textColor)]/90 dark:text-gray-200">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{summary.priceRange}</span>
                    </TooltipTrigger>
                    <TooltipContent className='bg-white dark:bg-gray-800 text-[var(--textColor)] dark:text-gray-200 border border-[var(--primaryColor)] dark:border-gray-700'>
                      {product.variants?.map((v, i) => (
                        <div key={i} className="text-xs py-1">
                          {v.weight} : ₹{v.regularPrice} {v.discountPrice ? `(Discounted: ₹${v.discountPrice})` : '(Discounted: ₹0)'}
                        </div>
                      ))}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-center hidden md:table-cell text-[var(--textColor)]/90 dark:text-gray-200">
                  {summary.discountRange ? `${summary.discountRange}` : '-'}
                </TableCell>
                <TableCell className="text-center text-[var(--textColor)]/90 dark:text-gray-200">
                  {summary.totalStock}
                </TableCell>
                <TableCell className="text-center hidden md:table-cell text-[var(--textColor)]/90 dark:text-gray-200">
                  {product.unitsSold || 0}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <TbEdit className="mx-auto text-xl cursor-pointer text-[var(--textColor)]/90 dark:text-gray-200 hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D]" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-60 absolute z-[1000] -left-[265px] -top-10 text-[var(--textColor)] dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700">
                      <DropdownMenuLabel className="dark:text-gray-200">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="dark:bg-gray-700" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          className='cursor-pointer mb-2 hover:bg-gray-100 dark:hover:bg-gray-700'
                          onClick={() => router.push(`/admin/products/edit/${product._id}`)}
                        >
                          Edit
                          <DropdownMenuShortcut>
                            <Edit size={16} className="dark:text-gray-200" />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className='cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
                          onClick={() => confirmDelete(product._id)}
                        >
                          Delete
                          <DropdownMenuShortcut>
                            <RiDeleteBin7Fill size={16} className="dark:text-gray-200" />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            })
          ) : !isLoading && (
            // Empty State
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[var(--textColor)]/80 dark:text-gray-300">No products found</p>
                  <p className="text-sm text-[var(--textColor)]/60 dark:text-gray-400">Create your first product to get started</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination - only show if not loading and products exist */}
      {!isLoading && products.length > 0 && totalPages > 1 && (
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

      {/* Add the AlertDialog for delete confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-gray-200">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="dark:bg-gray-700 cursor-pointer dark:text-gray-200 dark:hover:bg-gray-600"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 cursor-pointer hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AllCreatedProductsTab