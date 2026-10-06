import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import api from "../api";

const CATEGORIES = ["womenswear", "menswear", "kidswear", "footwear", "bags", "jewellery", "luxe"];

const COLUMNS = [
  "name", "category", "subCategory", "price", "comparePrice",
  "color", "fabric", "neckline", "sleeve", "pattern", "occasion",
  "technique", "care", "offerLabel", "description",
  "sizes", "images", "isReadyToShip", "isNewArrival", "isBestseller",
];

const GUIDE = [
  ["name, price", "Required. Price is a plain number (3299), with no ₹ or commas."],
  ["category", `Required. One of: ${CATEGORIES.join(", ")}.`],
  ["subCategory", "Optional. e.g. saree, kurta. Feeds the Shop by category filter."],
  ["comparePrice", "Optional. Original price. Leave empty for no discount."],
  ["sizes", "Required. size:stock separated by |, e.g. S:5|M:5|L:0. Stock 0 shows as sold out. For one size, Free Size:10."],
  ["images", "Required. Photo file names separated by |, e.g. red-1.jpg|red-2.jpg. The first one is the card image. A full https:// link also works."],
  ["isReadyToShip, isNewArrival, isBestseller", "yes or no. Empty means no."],
  ["everything else", "Optional. Leave empty if not needed."],
];

const makeSlug = (name) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const yes = (v) => ["yes", "true", "1", "y"].includes(String(v || "").trim().toLowerCase());
const isUrl = (s) => /^https?:\/\//i.test(s);
const str = (v) => String(v ?? "").trim();

const parseSizes = (text) =>
  str(text)
    .split(/[|,]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((item) => {
      const [size, stock] = item.split(":");
      return { size: size.trim(), stock: Number(stock) || 0 };
    });

function BulkImport() {
  const navigate = useNavigate();
  const [rawRows, setRawRows] = useState([]);
  const [files, setFiles] = useState([]);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("");
  const [results, setResults] = useState({});
  const [done, setDone] = useState(false);
  const [csvMessage, setCsvMessage] = useState("");

  const fileMap = useMemo(
    () => Object.fromEntries(files.map((f) => [f.name.toLowerCase(), f])),
    [files]
  );

  const missingHeaders = useMemo(() => {
    if (rawRows.length === 0) return [];
    const have = Object.keys(rawRows[0]);
    return ["name", "category", "price", "sizes", "images"].filter((h) => !have.includes(h));
  }, [rawRows]);

  // check every row and build the product payload
  const rows = useMemo(() => {
    const slugCount = {};
    rawRows.forEach((r) => {
      const s = makeSlug(str(r.name));
      slugCount[s] = (slugCount[s] || 0) + 1;
    });

    return rawRows.map((r, index) => {
      const errors = [];
      const name = str(r.name);
      const category = str(r.category).toLowerCase();
      const price = Number(r.price);
      const comparePrice = Number(r.comparePrice) || null;
      const sizes = parseSizes(r.sizes);
      const images = str(r.images).split("|").map((s) => s.trim()).filter(Boolean);

      if (!name) errors.push("name missing");
      if (name && slugCount[makeSlug(name)] > 1) errors.push("duplicate name in this file");
      if (!CATEGORIES.includes(category)) errors.push(`category must be one of: ${CATEGORIES.join(", ")}`);
      if (!(price > 0)) errors.push("price must be a number");
      if (sizes.length === 0) errors.push("sizes missing");
      if (images.length === 0) errors.push("images missing");
      images.forEach((img) => {
        if (!isUrl(img) && !fileMap[img.toLowerCase()]) errors.push(`photo not selected: ${img}`);
      });

      const discountPercent =
        comparePrice && comparePrice > price
          ? Math.round(((comparePrice - price) / comparePrice) * 100)
          : 0;

      return {
        index,
        name,
        category,
        price,
        images,
        errors,
        data: {
          name,
          slug: makeSlug(name),
          category,
          subCategory: str(r.subCategory).toLowerCase(),
          description: str(r.description),
          color: str(r.color),
          fabric: str(r.fabric),
          neckline: str(r.neckline),
          sleeve: str(r.sleeve),
          pattern: str(r.pattern),
          occasion: str(r.occasion),
          technique: str(r.technique),
          care: str(r.care),
          offerLabel: str(r.offerLabel),
          isReadyToShip: yes(r.isReadyToShip),
          isNewArrival: yes(r.isNewArrival),
          isBestseller: yes(r.isBestseller),
          price,
          comparePrice,
          discountPercent,
          sizes,
        },
      };
    });
  }, [rawRows, fileMap]);

  const valid = rows.filter((r) => r.errors.length === 0);

  // header row only: you type your own products under it
  const downloadTemplate = () => {
    const csv = "\uFEFF" + Papa.unparse({ fields: COLUMNS, data: [] });
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "products-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCsv = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResults({});
    setDone(false);
    setRawRows([]);
    setCsvMessage(`Reading ${file.name}...`);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: (res) => {
        setRawRows(res.data);
        setCsvMessage(`${file.name}: ${res.data.length} rows found`);
      },
      error: (err) => setCsvMessage(`Could not read file: ${err.message}`),
    });
  };

  const handlePhotos = (e) => setFiles(Array.from(e.target.files));

  const handleImport = async () => {
    setRunning(true);
    setDone(false);
    setResults({});

    // 1. upload each needed photo once, 3 at a time
    const needed = [
      ...new Set(
        valid.flatMap((r) => r.images.filter((x) => !isUrl(x)).map((x) => x.toLowerCase()))
      ),
    ];
    const urlMap = {};
    for (let i = 0; i < needed.length; i += 3) {
      const chunk = needed.slice(i, i + 3);
      await Promise.all(
        chunk.map(async (key) => {
          try {
            const fd = new FormData();
            fd.append("image", fileMap[key]);
            const { data } = await api.post("/upload", fd);
            urlMap[key] = data.url;
          } catch {
            urlMap[key] = null;
          }
        })
      );
      setStatus(`Uploading photos ${Math.min(i + 3, needed.length)} / ${needed.length}`);
    }

    // 2. create the products one by one
    let n = 0;
    for (const r of valid) {
      n += 1;
      setStatus(`Creating products ${n} / ${valid.length}`);
      const images = r.images.map((x) => (isUrl(x) ? x : urlMap[x.toLowerCase()]));
      if (images.some((x) => !x)) {
        setResults((prev) => ({ ...prev, [r.index]: { ok: false, text: "Photo upload failed" } }));
        continue;
      }
      try {
        await api.post("/products", { ...r.data, images });
        setResults((prev) => ({ ...prev, [r.index]: { ok: true, text: "Created" } }));
      } catch (err) {
        setResults((prev) => ({
          ...prev,
          [r.index]: { ok: false, text: err.response?.data?.message || "Failed" },
        }));
      }
    }

    setStatus("");
    setRunning(false);
    setDone(true);
  };

  const created = Object.values(results).filter((r) => r.ok).length;
  const failed = Object.values(results).filter((r) => !r.ok).length;
  const box = "rounded-lg bg-white p-5 shadow-sm";

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Bulk Import Products</h2>
          <button onClick={() => navigate("/admin/dashboard")} className="rounded-lg border bg-white px-5 py-2">
            Dashboard
          </button>
        </div>

        <div className={box}>
          <p className="font-medium">1. Get the template</p>
          <p className="mt-1 text-sm text-gray-600">
            It contains only the header row. Open it in Excel, add one row per product, and save as
            <b> CSV UTF-8 (Comma delimited)</b>. Don't rename or delete the header row.
          </p>
          <button onClick={downloadTemplate} className="mt-3 rounded-lg border px-4 py-2 text-sm">
            Download template
          </button>

          <details className="mt-4 text-sm">
            <summary className="cursor-pointer font-medium">Column guide</summary>
            <table className="mt-3 w-full text-left">
              <tbody>
                {GUIDE.map(([col, text]) => (
                  <tr key={col} className="border-b align-top">
                    <td className="w-1/3 py-2 pr-3 font-medium">{col}</td>
                    <td className="py-2 text-gray-600">{text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </div>

        <div className={box}>
          <p className="font-medium">2. Choose your CSV file</p>
          <input
            type="file"
            accept=".csv"
            onClick={(e) => { e.target.value = ""; }}
            onChange={handleCsv}
            className="mt-3 block"
          />
          {csvMessage && <p className="mt-2 text-sm text-gray-600">{csvMessage}</p>}
        </div>

        <div className={box}>
          <p className="font-medium">3. Choose all the product photos</p>
          <p className="mt-1 text-sm text-gray-600">
            Select every photo at once (Ctrl+A in the folder). Each file name must match the
            <b> images</b> column. Each photo must be under 5 MB.
          </p>
          <input type="file" accept="image/*" multiple onChange={handlePhotos} className="mt-3 block" />
          {files.length > 0 && <p className="mt-2 text-sm">{files.length} photos selected</p>}
        </div>

        {missingHeaders.length > 0 && (
          <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            Missing columns: {missingHeaders.join(", ")}. Use the template headers exactly.
          </p>
        )}

        {rows.length > 0 && missingHeaders.length === 0 && (
          <div className={box}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="font-medium">
                4. Preview: {valid.length} ready, {rows.length - valid.length} with errors
              </p>
              <button
                onClick={handleImport}
                disabled={running || valid.length === 0}
                className="rounded-lg bg-black px-5 py-2 text-white disabled:opacity-40"
              >
                {running ? "Importing..." : `Import ${valid.length} products`}
              </button>
            </div>

            {status && <p className="mb-3 text-sm text-gray-600">{status}</p>}
            {done && (
              <p className="mb-3 text-sm">
                Done: {created} created, {failed} failed.{" "}
                <button onClick={() => navigate("/admin/products")} className="underline">
                  View products
                </button>
              </p>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Photos</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const res = results[r.index];
                    return (
                      <tr key={r.index} className="border-b align-top">
                        <td className="p-3">{r.index + 1}</td>
                        <td className="p-3">{r.name || "-"}</td>
                        <td className="p-3">{r.category}</td>
                        <td className="p-3">{r.price ? `₹${r.price}` : "-"}</td>
                        <td className="p-3">{r.images.length}</td>
                        <td className="p-3">
                          {res ? (
                            <span className={res.ok ? "text-green-700" : "text-red-600"}>{res.text}</span>
                          ) : r.errors.length === 0 ? (
                            <span className="text-gray-500">Ready</span>
                          ) : (
                            <span className="text-red-600">{r.errors.join("; ")}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BulkImport;