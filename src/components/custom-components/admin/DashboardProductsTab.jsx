"use client"

import { useState } from "react";
import Image from "next/image";
import { assets } from "../../../../public/assets/assets";
import { ArrowLeft, Boxes, PackagePlus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MdAdd } from "react-icons/md";
import AllCreatedProductsTab from "./AllCreatedProductsTab";
import CreateNewProductTab from "./CreateNewProductTab";


const DashboardProductsTab = () => {
  const [changeToCreateProductTab, setChangeToCreateProductTab] = useState(false);

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

      <div className="w-full h-fit p-7 max-sm:p-4">
        {/* Header */}
        <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-2">

          {
            changeToCreateProductTab ? (
              <div className="flex items-center gap-3 text-base max-sm:text-sm text-[var(--textColor)] dark:text-white font-semibold">
                <PackagePlus className="dark:text-[#FFB74D]" />
                <h4>Add New Product</h4>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-base max-sm:text-sm text-[var(--textColor)] dark:text-white font-semibold">
                <Boxes className="dark:text-[#FFB74D]" />
                <h4>Manage Your Products</h4>
              </div>
            )
          }

          {
            changeToCreateProductTab ? (
              <div onClick={() => setChangeToCreateProductTab(false)} className="flex items-center gap-2 text-[var(--textColor)] dark:text-gray-200 text-base max-sm:text-sm group cursor-pointer select-none font-semibold hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D]">
                <ArrowLeft className="group-hover:-translate-x-1 transition-all duration-200" />
                <p>Back To Products Tab</p>
              </div>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={() => setChangeToCreateProductTab(true)}>
                    <div className="w-7 h-7 flex items-center justify-center text-white rounded-full cursor-pointer text-xl bg-[var(--primaryColor)] dark:bg-[#FFB74D] hover:bg-[var(--primaryColor)]/90 dark:hover:bg-[#FFB74D]/90 transition-colors">
                      <MdAdd />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="border border-[var(--primaryColor)] dark:border-[#FFB74D] text-[var(--primaryColor)] dark:text-[#FFB74D] rounded-sm bg-white dark:bg-gray-800">
                    <p>Add New Grocery Item</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          }
        </div>

        {
          changeToCreateProductTab ? (
            <CreateNewProductTab setChangeToCreateProductTab={setChangeToCreateProductTab} />
          ) : (
            <AllCreatedProductsTab />
          )
        }
      </div>
    </div>
  )
}

export default DashboardProductsTab
