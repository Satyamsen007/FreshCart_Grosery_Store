'use client';

import { fetchProductByCategoryAndId } from "@/store/features/productSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useProduct(productCategory, productId) {
  const dispatch = useDispatch();

  const product = useSelector((state) => state.product.product);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);

  useEffect(() => {
    if (productCategory && productId) {
      dispatch(fetchProductByCategoryAndId({ productCategory, productId }));
    }
  }, [productCategory, productId, dispatch]);

  return { product, loading, error };
}
