// Each product now has an `images` array so it can show multiple photos in a
// slider. A frame can be either:
//   1. A string (a real photo URL / uploaded base64 image), or
//   2. { emoji, color } placeholder frame (used for the original seed data,
//      since this project doesn't ship real product photography).
// New products added from the Admin Dashboard use real uploaded photos.

export const products = [
  { id: 1, name: "Vintage Graphic Tee", category: "T-Shirts", price: 1799, oldPrice: 2499, size: "M", condition: "Excellent",
    images: [
      { emoji: "👕", color: "bg-[#181818]" },
      { emoji: "👕", color: "bg-[#181818]/70" },
      { emoji: "👕", color: "bg-[#2a2a2a]" },
    ] },
  { id: 2, name: "Vintage Racing Jacket", category: "Jackets", price: 4499, oldPrice: 5999, size: "L", condition: "Excellent",
    images: [
      { emoji: "🧥", color: "bg-[#152c3b]" },
      { emoji: "🧥", color: "bg-[#152c3b]/70" },
      { emoji: "🧥", color: "bg-[#1c3a4d]" },
    ] },
  { id: 3, name: "Retro Basketball Jersey", category: "Jerseys", price: 2999, oldPrice: 3999, size: "L", condition: "Very Good",
    images: [
      { emoji: "🏀", color: "bg-[#2b1515]" },
      { emoji: "🏀", color: "bg-[#2b1515]/70" },
      { emoji: "🏀", color: "bg-[#3a1c1c]" },
    ] },
  { id: 4, name: "Vintage Denim", category: "Bottoms", price: 2499, oldPrice: 3299, size: "32", condition: "Excellent",
    images: [
      { emoji: "👖", color: "bg-[#18283a]" },
      { emoji: "👖", color: "bg-[#18283a]/70" },
      { emoji: "👖", color: "bg-[#20344a]" },
    ] },
  { id: 5, name: "Retro Varsity Jacket", category: "Jackets", price: 3499, oldPrice: 4999, size: "M", condition: "Excellent",
    images: [
      { emoji: "🧥", color: "bg-[#1d1711]" },
      { emoji: "🧥", color: "bg-[#1d1711]/70" },
      { emoji: "🧥", color: "bg-[#291f16]" },
    ] },
  { id: 6, name: "Vintage Band Tee", category: "T-Shirts", price: 1999, oldPrice: 2799, size: "L", condition: "Very Good",
    images: [
      { emoji: "👕", color: "bg-[#161616]" },
      { emoji: "👕", color: "bg-[#161616]/70" },
      { emoji: "👕", color: "bg-[#242424]" },
    ] },
  { id: 7, name: "Classic Jorts", category: "Jorts", price: 1599, oldPrice: 2299, size: "32", condition: "Excellent",
    images: [
      { emoji: "🩳", color: "bg-[#1d2d3b]" },
      { emoji: "🩳", color: "bg-[#1d2d3b]/70" },
      { emoji: "🩳", color: "bg-[#25384a]" },
    ] },
  { id: 8, name: "90s Street Hoodie", category: "Hoodies", price: 2799, oldPrice: 3799, size: "XL", condition: "Excellent",
    images: [
      { emoji: "👕", color: "bg-[#252019]" },
      { emoji: "👕", color: "bg-[#252019]/70" },
      { emoji: "👕", color: "bg-[#332b21]" },
    ] },
];
