// import { useState } from "react";
// import api from "../api";

// const empty = {
//   name: "", price: "", comparePrice: "", category: "",
//   description: "", color: "", fabric: "",
//   sizes: "S,M,L,XL", stock: 5,
// };

// function AddProduct() {
//   const [form, setForm] = useState(empty);
//   const [message, setMessage] = useState("");
//   const [imageUrls, setImageUrls] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const makeSlug = (name) =>
//     name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

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
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Image upload failed");
//     } finally {
//       setUploading(false);
//       e.target.value = "";
//     }
//   };

//   const removeImage = (url) =>
//     setImageUrls((prev) => prev.filter((u) => u !== url));

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (imageUrls.length === 0) {
//       setMessage("Please upload at least one image");
//       return;
//     }

//     const price = Number(form.price);
//     const comparePrice = Number(form.comparePrice) || undefined;
//     const discountPercent =
//       comparePrice && comparePrice > price
//         ? Math.round(((comparePrice - price) / comparePrice) * 100)
//         : 0;

//     const product = {
//       name: form.name,
//       slug: makeSlug(form.name),
//       description: form.description,
//       category: form.category.toLowerCase().trim(),
//       color: form.color,
//       fabric: form.fabric,
//       price,
//       comparePrice,
//       discountPercent,
//       images: imageUrls,
//       sizes: form.sizes
//         .split(",")
//         .map((s) => s.trim())
//         .filter(Boolean)
//         .map((size) => ({ size, stock: Number(form.stock) })),
//     };

//     try {
//       await api.post("/products", product);
//       setMessage("Product added");
//       setForm(empty);
//       setImageUrls([]);
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Failed to add product");
//     }
//   };

//   const input = "w-full rounded-lg border px-4 py-2";

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4 rounded-lg bg-white p-6 shadow-sm">
//         <h2 className="text-2xl font-semibold">Add Product</h2>

//         <input className={input} name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
//         <input className={input} name="category" placeholder="Category (e.g. anarkali)" value={form.category} onChange={handleChange} required />
//         <input className={input} name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
//         <input className={input} name="comparePrice" type="number" placeholder="Original price (optional)" value={form.comparePrice} onChange={handleChange} />
//         <input className={input} name="color" placeholder="Color" value={form.color} onChange={handleChange} />
//         <input className={input} name="fabric" placeholder="Fabric" value={form.fabric} onChange={handleChange} />
//         <textarea className={input} name="description" placeholder="Description" value={form.description} onChange={handleChange} />

//         <div>
//           <label className="mb-1 block text-sm text-gray-600">Product images</label>
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleFiles}
//             className={input}
//           />
//           {uploading && <p className="mt-2 text-sm">Uploading...</p>}
//           <div className="mt-3 flex flex-wrap gap-2">
//             {imageUrls.map((url) => (
//               <div key={url} className="relative">
//                 <img src={url} alt="" className="h-24 w-20 rounded object-cover" />
//                 <button
//                   type="button"
//                   onClick={() => removeImage(url)}
//                   className="absolute right-1 top-1 rounded bg-black px-1 text-xs text-white"
//                 >
//                   ×
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         <input className={input} name="sizes" placeholder="Sizes, e.g. S,M,L,XL" value={form.sizes} onChange={handleChange} />
//         <input className={input} name="stock" type="number" placeholder="Stock per size" value={form.stock} onChange={handleChange} />

//         <button
//           type="submit"
//           disabled={uploading}
//           className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
//         >
//           Add Product
//         </button>
//         {message && <p className="text-sm">{message}</p>}
//       </form>
//     </div>
//   );
// }

// export default AddProduct;



import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const empty = {
  name: "",
  price: "",
  comparePrice: "",
  category: "",
  subcategory: "",
  description: "",
  color: "",
  fabric: "",
  sizes: "S,M,L,XL",
  stock: 5,
};

function AddProduct() {
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load existing product when editing
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setMessage("");

      try {
        const { data } = await api.get(`/products/${id}`);
        const product = data.product || data;

        setForm({
          name: product.name || "",
          price: product.price ?? "",
          comparePrice: product.comparePrice ?? "",
          category: product.category || "",
          subcategory: product.subcategory || "",
          description: product.description || "",
          color: product.color || "",
          fabric: product.fabric || "",
          sizes:
            product.sizes?.map((item) => item.size).join(",") ||
            "S,M,L,XL",
          stock: product.sizes?.[0]?.stock ?? 5,
        });

        setImageUrls(product.images || []);
      } catch (err) {
        setMessage(
          err.response?.data?.message ||
            "Failed to load product details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const makeSlug = (name) =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  // Upload selected images
  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    setUploading(true);
    setMessage("");

    try {
      const urls = [];

      for (const file of files) {
        const fd = new FormData();
        fd.append("image", file);

        const { data } = await api.post("/upload", fd);

        if (!data.url) {
          throw new Error("Uploaded image URL was not returned");
        }

        urls.push(data.url);
      }

      setImageUrls((prev) => [...prev, ...urls]);
      setMessage("");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Image upload failed"
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Remove an image from the product form
  const removeImage = (url) => {
    setImageUrls((prev) => prev.filter((item) => item !== url));
  };

  // Add a new product or update an existing one
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageUrls.length === 0) {
      setMessage("Please upload at least one image");
      return;
    }

    if (uploading) {
      setMessage("Please wait for image uploads to finish");
      return;
    }

    const price = Number(form.price);
    const comparePrice =
      form.comparePrice !== ""
        ? Number(form.comparePrice)
        : undefined;

    if (!Number.isFinite(price) || price < 0) {
      setMessage("Please enter a valid price");
      return;
    }

    if (
      comparePrice !== undefined &&
      (!Number.isFinite(comparePrice) || comparePrice < 0)
    ) {
      setMessage("Please enter a valid original price");
      return;
    }

    const discountPercent =
      comparePrice !== undefined && comparePrice > price
        ? Math.round(
            ((comparePrice - price) / comparePrice) * 100
          )
        : 0;

    const sizes = [
      ...new Set(
        form.sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean)
      ),
    ];

    if (sizes.length === 0) {
      setMessage("Please enter at least one size");
      return;
    }

    const stock = Number(form.stock);

    if (!Number.isInteger(stock) || stock < 0) {
      setMessage("Stock must be a non-negative whole number");
      return;
    }

    const product = {
      name: form.name.trim(),
      slug: makeSlug(form.name),
      description: form.description,
      category: form.category.toLowerCase().trim(),
      subcategory: form.subcategory.toLowerCase().trim(),
      color: form.color,
      fabric: form.fabric,
      price,
      comparePrice,
      discountPercent,
      images: imageUrls,
      sizes: sizes.map((size) => ({
        size,
        stock,
      })),
    };

    setSaving(true);
    setMessage("");

    try {
      if (isEditing) {
        await api.put(`/products/${id}`, product);
        setMessage("Product updated successfully");
      } else {
        await api.post("/products", product);
        setMessage("Product added successfully");

        setForm({ ...empty });
        setImageUrls([]);
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "add"} product`
      );
    } finally {
      setSaving(false);
    }
  };

  const input =
    "w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <p className="text-center">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-xl space-y-4 rounded-lg bg-white p-6 shadow-sm"
      >
        <h2 className="text-2xl font-semibold">
          {isEditing ? "Edit Product" : "Add Product"}
        </h2>

        <div>
          <label className="mb-1 block text-sm text-gray-600">
            Product name
          </label>
          <input
            className={input}
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-600">
            Category
          </label>
          <input
            className={input}
            name="category"
            placeholder="Category (e.g. anarkali)"
            value={form.category}
            onChange={handleChange}
            required
          />
        </div>
        
<div>
  <label className="mb-1 block text-sm text-gray-600">
    Subcategory
  </label>
  <input
    className={input}
    name="subcategory"
    placeholder="e.g. juttis, sarees, kurtis"
    value={form.subcategory}
    onChange={handleChange}
  />
</div>

        <div>
          <label className="mb-1 block text-sm text-gray-600">
            Selling price
          </label>
          <input
            className={input}
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-600">
            Original price (optional)
          </label>
          <input
            className={input}
            name="comparePrice"
            type="number"
            min="0"
            step="0.01"
            placeholder="Original price"
            value={form.comparePrice}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-600">
            Color
          </label>
          <input
            className={input}
            name="color"
            placeholder="Color"
            value={form.color}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-600">
            Fabric
          </label>
          <input
            className={input}
            name="fabric"
            placeholder="Fabric"
            value={form.fabric}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-600">
            Description
          </label>
          <textarea
            className={input}
            name="description"
            rows={4}
            placeholder="Product description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-600">
            Product images
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className={input}
            disabled={uploading || saving}
          />

          {uploading && (
            <p className="mt-2 text-sm text-gray-600">
              Uploading images...
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-3">
            {imageUrls.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="relative"
              >
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  className="h-24 w-20 rounded object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  disabled={saving}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute right-1 top-1 rounded bg-black px-2 py-1 text-xs text-white disabled:opacity-50"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-600">
            Available sizes (comma-separated)
          </label>
          <input
            className={input}
            name="sizes"
            placeholder="Sizes, e.g. S,M,L,XL"
            value={form.sizes}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-600">
            Stock per size
          </label>
          <input
            className={input}
            name="stock"
            type="number"
            min="0"
            step="1"
            placeholder="Stock per size"
            value={form.stock}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={uploading || saving}
          className="rounded-lg bg-black px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : isEditing
              ? "Update Product"
              : "Add Product"}
        </button>

        {message && (
          <p
            role="status"
            className="text-sm text-gray-700"
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default AddProduct;