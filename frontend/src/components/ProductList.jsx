import { useEffect, useState } from "react";
import api from "../api";
import ProductCard from "./ProductCard";
function ProductList(){
    const[products,setProducts]=useState([]);
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(()=>{
    api.get("/products")
    .then((res)=>setProducts(res.data.products))
    .catch(() => setError("Could not load products"))
      .finally(() => setLoading(false));
  },[]);
  if(loading) return  <p className="p-8">Loading...</p>
  if (error) return <p className="p-8">{error}</p>;
  if(products.length==0) return <p className="p-8">No products found</p>
  return(
    <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4">
        {products.map((p)=>(
            <ProductCard key={p._id} product={p} />
  ))}
    </div>
  );
}
export default ProductList;


// import ProductCard from "./ProductCard";
// import { products } from "../data/products";

// const ProductList = () => {
//   return (
//     <div className="grid grid-cols-2 gap-3 p-3 md:grid-cols-3 md:gap-6 md:p-6 lg:grid-cols-4">
//       {products.map((p) => (
//         <ProductCard key={p._id} product={p} />
//       ))}
//     </div>
//   );
// };

// export default ProductList;