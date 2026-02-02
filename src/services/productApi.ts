const PRODUCT_API_URL = "http://localhost:5000/api/products";

export const getProducts = async () => {
  const res = await fetch(PRODUCT_API_URL);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch products");
  }

  return data;
};
