const colors = ["Orange", "Purple", "Pink", "Blue", "Green", "Yellow", "Red", "Black"];
const patterns = ["Embroidered", "Printed", "Solid", "Block Print"];
const occasions = ["Festive", "Wedding", "Casual", "Party"];

const seed = {
  womenswear: [
    ["Priya Orange Embroidered Chanderi Kurta Set", "Kurta Sets"],
    ["Ambika Purple Embroidered Chanderi Kurta Set", "Kurta Sets"],
    ["Shagun Pink Embroidered Chanderi Anarkali", "Anarkali"],
    ["Ishani Blue Embroidered Chanderi Kurta Set", "Kurta Sets"],
    ["Meher Green Zari Lehenga Set", "Lehenga"],
    ["Rukmini Red Bandhani Saree", "Sarees"],
  ],
  menswear: [
    ["Arjun Cream Chikankari Kurta", "Kurtas"],
    ["Veer Navy Nehru Jacket Set", "Jacket Sets"],
    ["Kabir Maroon Silk Sherwani", "Sherwanis"],
    ["Dev Olive Linen Kurta", "Kurtas"],
  ],
  kidswear: [
    ["Mini Anaya Pink Lehenga", "Lehengas"],
    ["Little Aarav Blue Kurta Set", "Kurta Sets"],
    ["Tiny Myra Yellow Frock", "Frocks"],
    ["Junior Rohan Ivory Sherwani", "Sherwanis"],
  ],
  footwear: [
    ["Zari Embroidered Juttis", "Juttis"],
    ["Gold Kolhapuri Flats", "Flats"],
    ["Mirror Work Wedges", "Wedges"],
    ["Velvet Mojaris", "Juttis"],
  ],
  bags: [
    ["Embroidered Potli Bag", "Potlis"],
    ["Beaded Clutch", "Clutches"],
    ["Jaipuri Block Print Tote", "Totes"],
    ["Mirror Work Sling Bag", "Sling Bags"],
  ],
  jewellery: [
    ["Spring Yellow Handcrafted Brass Earrings", "Earrings"],
    ["Tinge Flower Handcrafted Brass Earrings", "Earrings"],
    ["Kundan Choker Necklace", "Necklaces"],
    ["Pearl Layered Jhumkas", "Earrings"],
  ],
};

const clothing = ["womenswear", "menswear", "kidswear"];
let id = 0;

export const catalog = Object.entries(seed).flatMap(([category, list]) =>
  list.map(([name, type]) => {
    id++;
    const comparePrice = 2000 + ((id * 937) % 9000);
    const discountPercent = [30, 40, 50, 60, 70][id % 5];
    const price = Math.round(comparePrice * (1 - discountPercent / 100));
    const outOfStock = id % 7 === 0;
    const sizeList = clothing.includes(category) ? ["S", "M", "L", "XL"] : ["Free"];

//     return {
//       _id: String(id),
//       name,
//       slug: name.toLowerCase().replace(/\s+/g, "-"),
//       brand: "Aachho",
//       images: [`https://picsum.photos/seed/aachho${id}/400/500`],
//       price,
//       comparePrice,
//       discountPercent,
//       category,
//       type, // extra field for "Shop by category"; add it to your schema later
//       color: colors[id % colors.length],
//       pattern: patterns[id % patterns.length],
//       occasion: occasions[id % occasions.length],
//       sizes: sizeList.map((size) => ({ size, stock: outOfStock ? 0 : 5 })),
//       offerLabel: id % 2 === 0 ? "BUY 1 GET 1 FREE" : "",
//       isReadyToShip: id % 3 === 0,
//       isNewArrival: id % 2 === 0,
//       isBestseller: id % 4 === 0,
//     };
//   })
// );

    return {
      _id: String(id),
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      brand: "Aachho",
      description:
        "Handcrafted with care by skilled artisans. A festive-ready piece with a comfortable fit and a graceful drape.",
      images: [1, 2, 3, 4].map(
        (n) => `https://picsum.photos/seed/aachho${id}-${n}/600/800`
      ),
      price,
      comparePrice,
      discountPercent,
      category,
      type,
      color: colors[id % colors.length],
      fabric: "Chanderi",
      neckline: "Round Neck",
      sleeve: "Three-Quarter",
      pattern: patterns[id % patterns.length],
      occasion: occasions[id % occasions.length],
      technique: "Hand Embroidery",
      care: "Dry clean only",
      modelSize: "S",
      modelHeight: "5'8\"",
      sizes: sizeList.map((size) => ({ size, stock: outOfStock ? 0 : 5 })),
      rating: Number((4 + (id % 10) / 10).toFixed(1)),
      reviewCount: 10 + id * 3,
      offerLabel: id % 2 === 0 ? "BUY 1 GET 1 FREE" : "",
      isReadyToShip: id % 3 === 0,
      isNewArrival: id % 2 === 0,
      isBestseller: id % 4 === 0,
    };
})
);