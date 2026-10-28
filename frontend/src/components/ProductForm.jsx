// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../api";

// const CATEGORIES = [
//   "womenswear",
//   "menswear",
//   "kidswear",
//   "footwear",
//   "bags",
//   "jewellery",
//   "luxe",
// ];

// const empty = {
//   name: "",
//   category: "menswear",
//   subCategory: "",
//   price: "",
//   comparePrice: "",
//   color: "",
//   fabric: "",
//   neckline: "",
//   sleeve: "",
//   pattern: "",
//   occasion: "",
//   technique: "",
//   care: "",
//   description: "",
//   offerLabel: "",
//   sizes: "S:5,M:5,L:5,XL:0",
//   isReadyToShip: false,
//   isNewArrival: false,
//   isBestseller: false,
// };

// const sizesToText = (sizes = []) =>
//   sizes.map((s) => `${s.size}:${s.stock}`).join(",");

// const makeSlug = (name) =>
//   name
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-|-$/g, "");

// function ProductForm() {
//   const { slug } = useParams();
//   const isEdit = Boolean(slug);
//   const navigate = useNavigate();

//   const [form, setForm] = useState(empty);
//   const [productId, setProductId] = useState(null);
//   const [imageUrls, setImageUrls] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [loading, setLoading] = useState(isEdit);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState("");

//   // Load the existing product when editing.
//   useEffect(() => {
//     if (!isEdit) return;

//     let cancelled = false;

//     const loadProduct = async () => {
//       try {
//         const { data } = await api.get(`/products/${slug}`);

//         if (cancelled) return;

//         setProductId(data._id);
//         setImageUrls(data.images || []);

//         setForm({
//           ...empty,
//           name: data.name || "",
//           category: data.category || "menswear",

//           // Read the correct database field.
//           // Also support older products using subCategory.
//           subCategory: data.subcategory || data.subCategory || "",

//           price: data.price ?? "",
//           comparePrice: data.comparePrice ?? "",
//           color: data.color || "",
//           fabric: data.fabric || "",
//           neckline: data.neckline || "",
//           sleeve: data.sleeve || "",
//           pattern: data.pattern || "",
//           occasion: data.occasion || "",
//           technique: data.technique || "",
//           care: data.care || "",
//           description: data.description || "",
//           offerLabel: data.offerLabel || "",
//           sizes: sizesToText(data.sizes),
//           isReadyToShip: Boolean(data.isReadyToShip),
//           isNewArrival: Boolean(data.isNewArrival),
//           isBestseller: Boolean(data.isBestseller),
//         });
//       } catch (err) {
//         if (!cancelled) {
//           setMessage(
//             err.response?.data?.message || "Could not load product"
//           );
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };

//     loadProduct();

//     return () => {
//       cancelled = true;
//     };
//   }, [slug, isEdit]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Upload selected images.
//   const handleFiles = async (e) => {
//     const files = Array.from(e.target.files);

//     if (files.length === 0) return;

//     setUploading(true);
//     setMessage("");

//     try {
//       const urls = [];

//       for (const file of files) {
//         const fd = new FormData();
//         fd.append("image", file);

//         const { data } = await api.post("/upload", fd);
//         urls.push(data.url);
//       }

//       setImageUrls((prev) => [...prev, ...urls]);
//       setMessage("Images uploaded successfully");
//     } catch (err) {
//       setMessage(
//         err.response?.data?.message || "Image upload failed"
//       );
//     } finally {
//       setUploading(false);
//       e.target.value = "";
//     }
//   };

//   const removeImage = (url) => {
//     setImageUrls((prev) => prev.filter((image) => image !== url));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (saving || uploading) return;

//     if (imageUrls.length === 0) {
//       setMessage("Please upload at least one image");
//       return;
//     }

//     const price = Number(form.price);
//     const comparePrice = Number(form.comparePrice) || null;

//     const discountPercent =
//       comparePrice && comparePrice > price
//         ? Math.round(((comparePrice - price) / comparePrice) * 100)
//         : 0;

//     // IMPORTANT: the database field is "subcategory",
//     // not "subCategory".
//     const product = {
//       name: form.name.trim(),
//       slug: isEdit ? slug : makeSlug(form.name),
//       category: form.category.toLowerCase().trim(),
//       subcategory: form.subCategory.toLowerCase().trim(),

//       description: form.description,
//       color: form.color,
//       fabric: form.fabric,
//       neckline: form.neckline,
//       sleeve: form.sleeve,
//       pattern: form.pattern,
//       occasion: form.occasion,
//       technique: form.technique,
//       care: form.care,
//       offerLabel: form.offerLabel,

//       isReadyToShip: form.isReadyToShip,
//       isNewArrival: form.isNewArrival,
//       isBestseller: form.isBestseller,

//       price,
//       comparePrice,
//       discountPercent,
//       images: imageUrls,

//       sizes: form.sizes
//         .split(",")
//         .map((s) => s.trim())
//         .filter(Boolean)
//         .map((item) => {
//           const [size, stock] = item.split(":");

//           return {
//             size: size.trim(),
//             stock: Math.max(0, Number(stock) || 0),
//           };
//         }),
//     };

//     setSaving(true);
//     setMessage("");

//     try {
//       if (isEdit) {
//         await api.put(`/products/${productId}`, product);
//         navigate("/admin/products");
//       } else {
//         await api.post("/products", product);

//         setForm(empty);
//         setImageUrls([]);
//         setMessage("Product added successfully");
//       }
//     } catch (err) {
//       setMessage(
//         err.response?.data?.message || "Failed to save product"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const input = "w-full rounded-lg border px-4 py-2";

//   if (loading) {
//     return <p className="p-8">Loading product...</p>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <form
//         onSubmit={handleSubmit}
//         className="mx-auto max-w-xl space-y-4 rounded-lg bg-white p-6 shadow-sm"
//       >
//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-semibold">
//             {isEdit ? "Edit Product" : "Add Product"}
//           </h2>

//           <button
//             type="button"
//             onClick={() => navigate("/admin/products")}
//             className="text-sm underline"
//           >
//             Back to products
//           </button>
//         </div>

//         <input
//           className={input}
//           name="name"
//           placeholder="Product name"
//           value={form.name}
//           onChange={handleChange}
//           required
//         />

//         <select
//           className={input}
//           name="category"
//           value={form.category}
//           onChange={handleChange}
//           required
//         >
//           {CATEGORIES.map((category) => (
//             <option key={category} value={category}>
//               {category}
//             </option>
//           ))}
//         </select>

//         <input
//           className={input}
//           name="subCategory"
//           placeholder="Subcategory (e.g. earrings, necklaces, kurta)"
//           value={form.subCategory}
//           onChange={handleChange}
//         />

//         <input
//           className={input}
//           name="price"
//           type="number"
//           min="0"
//           placeholder="Price"
//           value={form.price}
//           onChange={handleChange}
//           required
//         />

//         <input
//           className={input}
//           name="comparePrice"
//           type="number"
//           min="0"
//           placeholder="Original price (optional)"
//           value={form.comparePrice}
//           onChange={handleChange}
//         />

//         <input
//           className={input}
//           name="color"
//           placeholder="Color"
//           value={form.color}
//           onChange={handleChange}
//         />

//         <input
//           className={input}
//           name="fabric"
//           placeholder="Fabric"
//           value={form.fabric}
//           onChange={handleChange}
//         />

//         <input
//           className={input}
//           name="neckline"
//           placeholder="Neckline"
//           value={form.neckline}
//           onChange={handleChange}
//         />

//         <input
//           className={input}
//           name="sleeve"
//           placeholder="Sleeve"
//           value={form.sleeve}
//           onChange={handleChange}
//         />

//         <input
//           className={input}
//           name="pattern"
//           placeholder="Pattern"
//           value={form.pattern}
//           onChange={handleChange}
//         />

//         <input
//           className={input}
//           name="occasion"
//           placeholder="Occasion"
//           value={form.occasion}
//           onChange={handleChange}
//         />

//         <input
//           className={input}
//           name="technique"
//           placeholder="Technique"
//           value={form.technique}
//           onChange={handleChange}
//         />

//         <input
//           className={input}
//           name="care"
//           placeholder="Care instructions"
//           value={form.care}
//           onChange={handleChange}
//         />

//         <input
//           className={input}
//           name="offerLabel"
//           placeholder="Offer label (e.g. BUY 1 GET 1 FREE)"
//           value={form.offerLabel}
//           onChange={handleChange}
//         />

//         <textarea
//           className={input}
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//         />

//         <div>
//           <label className="mb-1 block text-sm text-gray-600">
//             Product images
//           </label>

//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleFiles}
//             className={input}
//           />

//           {uploading && (
//             <p className="mt-2 text-sm">Uploading images...</p>
//           )}

//           <div className="mt-3 flex flex-wrap gap-2">
//             {imageUrls.map((url) => (
//               <div key={url} className="relative">
//                 <img
//                   src={url}
//                   alt="Product"
//                   className="h-24 w-20 rounded object-cover"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => removeImage(url)}
//                   className="absolute right-1 top-1 rounded bg-black px-1 text-xs text-white"
//                   aria-label="Remove image"
//                 >
//                   ×
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div>
//           <input
//             className={input}
//             name="sizes"
//             placeholder="Sizes and stock, e.g. S:5,M:0,L:3 or Free Size:10"
//             value={form.sizes}
//             onChange={handleChange}
//           />

//           <p className="mt-1 text-xs text-gray-500">
//             Format: size:stock. For earrings, use Free Size:10 if there
//             are 10 items available.
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-6 text-sm">
//           <label>
//             <input
//               type="checkbox"
//               name="isReadyToShip"
//               checked={form.isReadyToShip}
//               onChange={handleChange}
//             />{" "}
//             Ready to ship
//           </label>

//           <label>
//             <input
//               type="checkbox"
//               name="isNewArrival"
//               checked={form.isNewArrival}
//               onChange={handleChange}
//             />{" "}
//             New arrival
//           </label>

//           <label>
//             <input
//               type="checkbox"
//               name="isBestseller"
//               checked={form.isBestseller}
//               onChange={handleChange}
//             />{" "}
//             Bestseller
//           </label>
//         </div>

//         <button
//           type="submit"
//           disabled={uploading || saving}
//           className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
//         >
//           {saving
//             ? "Saving..."
//             : isEdit
//               ? "Save changes"
//               : "Add Product"}
//         </button>

//         {message && (
//           <p className="text-sm" role="status">
//             {message}
//           </p>
//         )}
//       </form>
//     </div>
//   );
// }

// export default ProductForm;



import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImagePlus, Upload, X } from "lucide-react";
import api from "../api";

const CATEGORIES = [
  "womenswear",
  "menswear",
  "kidswear",
  "footwear",
  "bags",
  "jewellery",
  "luxe",
];

const empty = {
  name: "",
  category: "menswear",
  subCategory: "",
  price: "",
  comparePrice: "",
  color: "",
  fabric: "",
  neckline: "",
  sleeve: "",
  pattern: "",
  occasion: "",
  technique: "",
  care: "",
  description: "",
  offerLabel: "",
  sizes: "S:5,M:5,L:5,XL:0",
  isReadyToShip: false,
  isNewArrival: false,
  isBestseller: false,
};

const sizesToText = (sizes = []) =>
  sizes.map((s) => `${s.size}:${s.stock}`).join(",");

const makeSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function ProductForm() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [productId, setProductId] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Load the existing product when editing.
  useEffect(() => {
    if (!isEdit) return;

    let cancelled = false;

    const loadProduct = async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);

        if (cancelled) return;

        setProductId(data._id);
        setImageUrls(data.images || []);

        setForm({
          ...empty,
          name: data.name || "",
          category: data.category || "menswear",
          subCategory: data.subcategory || data.subCategory || "",
          price: data.price ?? "",
          comparePrice: data.comparePrice ?? "",
          color: data.color || "",
          fabric: data.fabric || "",
          neckline: data.neckline || "",
          sleeve: data.sleeve || "",
          pattern: data.pattern || "",
          occasion: data.occasion || "",
          technique: data.technique || "",
          care: data.care || "",
          description: data.description || "",
          offerLabel: data.offerLabel || "",
          sizes: sizesToText(data.sizes),
          isReadyToShip: Boolean(data.isReadyToShip),
          isNewArrival: Boolean(data.isNewArrival),
          isBestseller: Boolean(data.isBestseller),
        });
      } catch (err) {
        if (!cancelled) {
          setMessage(
            err.response?.data?.message || "Could not load product"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Upload selected images.
  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    setUploading(true);
    setMessage("");

    try {
      const urls = [];

      for (const file of files) {
        const fd = new FormData();
        fd.append("image", file);

        const { data } = await api.post("/upload", fd);
        urls.push(data.url);
      }

      setImageUrls((prev) => [...prev, ...urls]);
      setMessage("Images uploaded successfully");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Image upload failed"
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url) => {
    setImageUrls((prev) =>
      prev.filter((image) => image !== url)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving || uploading) return;

    if (imageUrls.length === 0) {
      setMessage("Please upload at least one image");
      return;
    }

    const price = Number(form.price);
    const comparePrice = Number(form.comparePrice) || null;

    const discountPercent =
      comparePrice && comparePrice > price
        ? Math.round(
            ((comparePrice - price) / comparePrice) * 100
          )
        : 0;

    const product = {
      name: form.name.trim(),
      slug: isEdit ? slug : makeSlug(form.name),
      category: form.category.toLowerCase().trim(),
      subcategory: form.subCategory.toLowerCase().trim(),

      description: form.description,
      color: form.color,
      fabric: form.fabric,
      neckline: form.neckline,
      sleeve: form.sleeve,
      pattern: form.pattern,
      occasion: form.occasion,
      technique: form.technique,
      care: form.care,
      offerLabel: form.offerLabel,

      isReadyToShip: form.isReadyToShip,
      isNewArrival: form.isNewArrival,
      isBestseller: form.isBestseller,

      price,
      comparePrice,
      discountPercent,
      images: imageUrls,

      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((item) => {
          const [size, stock] = item.split(":");

          return {
            size: size.trim(),
            stock: Math.max(0, Number(stock) || 0),
          };
        }),
    };

    setSaving(true);
    setMessage("");

    try {
      if (isEdit) {
        await api.put(`/products/${productId}`, product);
        navigate("/admin/products");
      } else {
        await api.post("/products", product);

        setForm(empty);
        setImageUrls([]);
        setMessage("Product added successfully");
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to save product"
      );
    } finally {
      setSaving(false);
    }
  };

  const input =
    "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100";

  if (loading) {
    return <p className="p-8">Loading product...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl space-y-5 rounded-xl bg-white p-5 shadow-sm sm:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="shrink-0 text-sm underline"
          >
            Back to products
          </button>
        </div>

        <input
          className={input}
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select
          className={input}
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          className={input}
          name="subCategory"
          placeholder="Subcategory (e.g. earrings, necklaces, kurta)"
          value={form.subCategory}
          onChange={handleChange}
        />

        <input
          className={input}
          name="price"
          type="number"
          min="0"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          className={input}
          name="comparePrice"
          type="number"
          min="0"
          placeholder="Original price (optional)"
          value={form.comparePrice}
          onChange={handleChange}
        />

        <input
          className={input}
          name="color"
          placeholder="Color"
          value={form.color}
          onChange={handleChange}
        />

        <input
          className={input}
          name="fabric"
          placeholder="Fabric"
          value={form.fabric}
          onChange={handleChange}
        />

        <input
          className={input}
          name="neckline"
          placeholder="Neckline"
          value={form.neckline}
          onChange={handleChange}
        />

        <input
          className={input}
          name="sleeve"
          placeholder="Sleeve"
          value={form.sleeve}
          onChange={handleChange}
        />

        <input
          className={input}
          name="pattern"
          placeholder="Pattern"
          value={form.pattern}
          onChange={handleChange}
        />

        <input
          className={input}
          name="occasion"
          placeholder="Occasion"
          value={form.occasion}
          onChange={handleChange}
        />

        <input
          className={input}
          name="technique"
          placeholder="Technique"
          value={form.technique}
          onChange={handleChange}
        />

        <input
          className={input}
          name="care"
          placeholder="Care instructions"
          value={form.care}
          onChange={handleChange}
        />

        <input
          className={input}
          name="offerLabel"
          placeholder="Offer label (e.g. BUY 1 GET 1 FREE)"
          value={form.offerLabel}
          onChange={handleChange}
        />

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="description"
            className={`${input} min-h-36 resize-y`}
            name="description"
            placeholder="Product description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* Product Images Upload Box */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Product images
          </label>

          <label
            htmlFor="product-images"
            className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-pink-400 hover:bg-pink-50 sm:p-8"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
              <ImagePlus
                size={32}
                className="text-pink-600"
              />
            </div>

            <p className="text-lg font-semibold text-gray-800">
              Upload product images
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Click below to select images from your computer
            </p>

            <p className="mt-1 text-xs text-gray-400">
              PNG, JPG, JPEG or WEBP
            </p>

            <span className="mt-5 inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800">
              <Upload size={17} />
              Browse files
            </span>

            <input
              id="product-images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="hidden"
            />
          </label>

          {uploading && (
            <p className="text-sm text-pink-600">
              Uploading images...
            </p>
          )}

          {/* Uploaded image previews */}
          {imageUrls.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">
                Uploaded images ({imageUrls.length})
              </p>

              <div className="flex flex-wrap gap-3">
                {imageUrls.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white"
                  >
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="h-32 w-28 object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/75 text-white transition hover:bg-red-600"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="sizes"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Available sizes and stock
          </label>

          <input
            id="sizes"
            className={input}
            name="sizes"
            placeholder="S:5,M:5,L:3,XL:0"
            value={form.sizes}
            onChange={handleChange}
          />

          <p className="mt-2 text-xs text-gray-500">
            Format: size:stock. Example: S:5,M:0,L:3.
            For accessories, use Free Size:10.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm text-gray-700">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isReadyToShip"
              checked={form.isReadyToShip}
              onChange={handleChange}
              className="accent-pink-600"
            />
            Ready to ship
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isNewArrival"
              checked={form.isNewArrival}
              onChange={handleChange}
              className="accent-pink-600"
            />
            New arrival
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isBestseller"
              checked={form.isBestseller}
              onChange={handleChange}
              className="accent-pink-600"
            />
            Bestseller
          </label>
        </div>

        <button
          type="submit"
          disabled={uploading || saving}
          className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : isEdit
              ? "Save changes"
              : "Add Product"}
        </button>

        {message && (
          <p
            className="text-sm"
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default ProductForm;
