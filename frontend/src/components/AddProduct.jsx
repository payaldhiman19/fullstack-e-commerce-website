// import { useState } from "react";
// import api from "../api";

// const empty = {
//   name: "", price: "", comparePrice: "", category: "",
//   description: "", color: "", fabric: "",
//   images: "", sizes: "S,M,L,XL", stock: 5,
// };

// function AddProduct() {
//   const [form, setForm] = useState(empty);
//   const [message, setMessage] = useState("");

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const makeSlug = (name) =>
//     name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
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
//       images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
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
//         <input className={input} name="images" placeholder="Image URLs, separated by commas" value={form.images} onChange={handleChange} required />
//         <input className={input} name="sizes" placeholder="Sizes, e.g. S,M,L,XL" value={form.sizes} onChange={handleChange} />
//         <input className={input} name="stock" type="number" placeholder="Stock per size" value={form.stock} onChange={handleChange} />

//         <button type="submit" className="rounded-lg bg-black px-5 py-3 text-white">Add Product</button>
//         {message && <p className="text-sm">{message}</p>}
//       </form>
//     </div>
//   );
// }

// export default AddProduct;




import { useState } from "react";
import api from "../api";

const empty = {
  name: "", price: "", comparePrice: "", category: "",
  description: "", color: "", fabric: "",
  sizes: "S,M,L,XL", stock: 5,
};

function AddProduct() {
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const makeSlug = (name) =>
    name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

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
    } catch (err) {
      setMessage(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url) =>
    setImageUrls((prev) => prev.filter((u) => u !== url));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageUrls.length === 0) {
      setMessage("Please upload at least one image");
      return;
    }

    const price = Number(form.price);
    const comparePrice = Number(form.comparePrice) || undefined;
    const discountPercent =
      comparePrice && comparePrice > price
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0;

    const product = {
      name: form.name,
      slug: makeSlug(form.name),
      description: form.description,
      category: form.category.toLowerCase().trim(),
      color: form.color,
      fabric: form.fabric,
      price,
      comparePrice,
      discountPercent,
      images: imageUrls,
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((size) => ({ size, stock: Number(form.stock) })),
    };

    try {
      await api.post("/products", product);
      setMessage("Product added");
      setForm(empty);
      setImageUrls([]);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add product");
    }
  };

  const input = "w-full rounded-lg border px-4 py-2";

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Add Product</h2>

        <input className={input} name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
        <input className={input} name="category" placeholder="Category (e.g. anarkali)" value={form.category} onChange={handleChange} required />
        <input className={input} name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input className={input} name="comparePrice" type="number" placeholder="Original price (optional)" value={form.comparePrice} onChange={handleChange} />
        <input className={input} name="color" placeholder="Color" value={form.color} onChange={handleChange} />
        <input className={input} name="fabric" placeholder="Fabric" value={form.fabric} onChange={handleChange} />
        <textarea className={input} name="description" placeholder="Description" value={form.description} onChange={handleChange} />

        <div>
          <label className="mb-1 block text-sm text-gray-600">Product images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className={input}
          />
          {uploading && <p className="mt-2 text-sm">Uploading...</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {imageUrls.map((url) => (
              <div key={url} className="relative">
                <img src={url} alt="" className="h-24 w-20 rounded object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute right-1 top-1 rounded bg-black px-1 text-xs text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <input className={input} name="sizes" placeholder="Sizes, e.g. S,M,L,XL" value={form.sizes} onChange={handleChange} />
        <input className={input} name="stock" type="number" placeholder="Stock per size" value={form.stock} onChange={handleChange} />

        <button
          type="submit"
          disabled={uploading}
          className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          Add Product
        </button>
        {message && <p className="text-sm">{message}</p>}
      </form>
    </div>
  );
}

export default AddProduct;