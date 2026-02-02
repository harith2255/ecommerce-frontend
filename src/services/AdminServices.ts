const API_URL = "http://localhost:5000/api/admin";

// Header
const getAuthHeaders = (token: string) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
});

// Fetch dashboard statistics
export const fetchAdminDashboard = async (token: string) => {
   const [ordersRes, productsRes, usersRes] = await Promise.all([
       fetch(`${API_URL}/orders`, { headers: getAuthHeaders(token) }),
       fetch(`${API_URL}/products`, { headers: getAuthHeaders(token) }),
       fetch(`${API_URL}/users`, { headers: getAuthHeaders(token) }), 
    
   ]);

   if(!ordersRes.ok || !productsRes.ok || !usersRes.ok) {
       throw new Error('Failed to fetch dashboard statistics');
   }

   return{
         orders: await ordersRes.json(),
         products: await productsRes.json(),
         users: await usersRes.json(),
   };
}
// products
export const fetchAdminProducts = async (token: string) => {
    const res = await fetch(`${API_URL}/products`, {
        headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
};

export const createProduct = async (token: string, data: any) => {
    const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
}
export const updateProduct = async (token: string, id: string, data: any) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
}
export const deleteProduct = async (token: string, id: string) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
    });

    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
};

//orders
export const fetchAdminOrders = async (token: string) => {
    const res = await fetch(`${API_URL}/orders`, {
        headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
};

export const updateOrderStatus = async (token: string, id: string, status: string) => {
    const res = await fetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
};

// users
export const fetchAdminUsers = async (token: string) => {
    const res = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
};
export const blockUser = async (token: string, userId: string) => {
    const res = await fetch(`${API_URL}/users/${userId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ status: 'blocked' }),
    });
    if (!res.ok) throw new Error('Failed to block user');
    return res.json();
};
// categories
// categories
export const fetchCategories = async (token: string) => {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

export const createCategory = async (token: string, data: any) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
};

export const updateCategory = async (token: string, id: string, data: any) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update category");
  return res.json();
};

export const deleteCategory = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete category");
  return res.json();
};
