// services/productService.ts
const PRODUCT_API_URL = "http://localhost:5000/api/products";

export const getProducts = async () => {
  const res = await fetch(PRODUCT_API_URL);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch products");
  }

  return json.data; // ✅ MUST be array
};

export const getProductById = async (id: string) => {
  const res = await fetch(`${PRODUCT_API_URL}/${id}`);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch product");
  }

  return json.data; // ✅ ONLY product object
};