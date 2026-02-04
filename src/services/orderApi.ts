const API_URL = "http://localhost:5000/api/orders";

export const fetchOrders = async (userId: string, 
    token: string) => {
        const res = await fetch(`${API_URL}/user/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok){ throw new Error('Failed to fetch orders');

}
        return res.json();
    };

    export const placeOrder = async (orderData: any, token: string) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) {
    throw new Error("Failed to place order");
  }

  return res.json();
};