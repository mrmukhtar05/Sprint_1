import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
const ProductsContext=createContext(null);
const CACHE_KEY="vv_products_v2";
export function ProductsProvider({children}){
 const [products,setProducts]=useState(()=>{try{return JSON.parse(sessionStorage.getItem(CACHE_KEY)||"[]")}catch{return[]}});
 const [loading,setLoading]=useState(products.length===0); const [error,setError]=useState(""); const [meta,setMeta]=useState({page:1,pages:1,total:products.length});
 const fetchProducts=async(params={})=>{try{setLoading(true);setError("");const r=await api.get("/products",{params:{page:1,limit:12,...params}});const data=r.data;const list=data.products||[];setProducts(list);setMeta({page:data.page||1,pages:data.pages||1,total:data.total||list.length});try{sessionStorage.setItem(CACHE_KEY,JSON.stringify(list))}catch{}return data}catch(e){const m=e.response?.data?.message||"Failed to load products.";setError(m);return{success:false,error:m}}finally{setLoading(false)}};
 const getProduct=async id=>{try{const r=await api.get(`/products/${id}`);return r.data.product||null}catch{return null}};
 useEffect(()=>{if(!products.length)fetchProducts()},[]);
 return <ProductsContext.Provider value={{products,loading,error,meta,fetchProducts,getProduct}}>{children}</ProductsContext.Provider>;
}
export function useProducts(){const ctx=useContext(ProductsContext);if(!ctx)throw new Error("useProducts must be used inside ProductsProvider");return ctx}
