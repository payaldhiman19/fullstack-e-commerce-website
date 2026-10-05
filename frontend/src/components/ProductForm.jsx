import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

const CATEGORIES = ["womenswear", "menswear", "kidswear", "footwear", "bags", "jewellery", "luxe"];

const empty = {
  name: "", category: "menswear", subCategory: "",
  price: "", comparePrice: "",
  color: "", fabric: "", neckline: "", sleeve: "", pattern: "",
  occasion: "", technique: "", care: "", description: "",
  offerLabel: "",
  sizes: "S:5,M:5,L:5,XL:0",
  isReadyToShip: false, isNewArrival: false, isBestseller: false,
};

const sizesToText = (sizes = []) => sizes.map((s) => `${s.size}:${s.stock}`).join(",");

const makeSlug = (name) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function ProductForm() {
  const { slug } = useParams(); // only present on the edit route
  const isEdit = Boolean(slug);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [productId, setProductId] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [message, setMessage] = useState("");

  // edit mode: load the product and fill the form
  useEffect(() => {
    if (!isEdit) return;
    api.get(`/products/${slug}`)
      .then(({ data }) => {
        setProductId(data._id);
        setImageUrls(data.images || []);
        setForm({
          name: data.name || "",
          category: data.category || "menswear",
          subCategory: data.subCategory || "",
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
          isReadyToShip: !!data.isReadyToShip,
          isNewArrival: !!data.isNewArrival,
          isBestseller: !!data.isBestseller,
        });
      })
      .catch(() => setMessage("Could not load product"))
      .finally(() => setLoading(false));
  }, [slug, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

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

  const removeImage = (url) => setImageUrls((prev) => prev.filter((u) => u !== url));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageUrls.length === 0) {
      setMessage("Please upload at least one image");
      return;
    }

    const price = Number(form.price);
    const comparePrice = Number(form.comparePrice) || null;
    const discountPercent =
      comparePrice && comparePrice > price
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0;

    const product = {
      name: form.name,
      slug: isEdit ? slug : makeSlug(form.name), // keep the old slug so links don't break
      category: form.category.toLowerCase().trim(),
      subCategory: form.subCategory.toLowerCase().trim(),
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
          return { size: size.trim(), stock: Number(stock) || 0 };
        }),
    };

    try {
      if (isEdit) {
        await api.put(`/products/${productId}`, product);
        navigate("/admin/products");
      } else {
        await api.post("/products", product);
        setMessage("Product added");
        setForm(empty);
        setImageUrls([]);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save product");
    }
  };

  const input = "w-full rounded-lg border px-4 py-2";

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{isEdit ? "Edit Product" : "Add Product"}</h2>
          <button type="button" onClick={() => navigate("/admin/products")} className="text-sm underline">
            Back to products
          </button>
        </div>

        <input className={input} name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />

        <select className={input} name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input className={input} name="subCategory" placeholder="Sub category (e.g. kurta, sherwani)" value={form.subCategory} onChange={handleChange} />

        <input className={input} name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input className={input} name="comparePrice" type="number" placeholder="Original price (optional)" value={form.comparePrice} onChange={handleChange} />

        <input className={input} name="color" placeholder="Color" value={form.color} onChange={handleChange} />
        <input className={input} name="fabric" placeholder="Fabric" value={form.fabric} onChange={handleChange} />
        <input className={input} name="neckline" placeholder="Neckline" value={form.neckline} onChange={handleChange} />
        <input className={input} name="sleeve" placeholder="Sleeve" value={form.sleeve} onChange={handleChange} />
        <input className={input} name="pattern" placeholder="Pattern" value={form.pattern} onChange={handleChange} />
        <input className={input} name="occasion" placeholder="Occasion" value={form.occasion} onChange={handleChange} />
        <input className={input} name="technique" placeholder="Technique" value={form.technique} onChange={handleChange} />
        <input className={input} name="care" placeholder="Care instructions" value={form.care} onChange={handleChange} />
        <input className={input} name="offerLabel" placeholder="Offer label (e.g. BUY 1 GET 1 FREE)" value={form.offerLabel} onChange={handleChange} />
        <textarea className={input} name="description" placeholder="Description" value={form.description} onChange={handleChange} />

        <div>
          <label className="mb-1 block text-sm text-gray-600">Product images</label>
          <input type="file" accept="image/*" multiple onChange={handleFiles} className={input} />
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

        <div>
          <input className={input} name="sizes" placeholder="Sizes and stock, e.g. S:5,M:0,L:3" value={form.sizes} onChange={handleChange} />
          <p className="mt-1 text-xs text-gray-500">Format size:stock. A size with 0 shows as sold out.</p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm">
          <label><input type="checkbox" name="isReadyToShip" checked={form.isReadyToShip} onChange={handleChange} /> Ready to ship</label>
          <label><input type="checkbox" name="isNewArrival" checked={form.isNewArrival} onChange={handleChange} /> New arrival</label>
          <label><input type="checkbox" name="isBestseller" checked={form.isBestseller} onChange={handleChange} /> Bestseller</label>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {isEdit ? "Save changes" : "Add Product"}
        </button>
        {message && <p className="text-sm">{message}</p>}
      </form>
    </div>
  );
}

export default ProductForm;