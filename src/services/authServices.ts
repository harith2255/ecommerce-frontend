const API_URL = "http://localhost:5000/api/auth";

export const registerUser = async (name: string, email: string, password: string) =>
     {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
            })
        });
        const data = await res.json();

        if(!res.ok) {
            throw new Error(data.message || "Registration Failed");
        }
        return data;
}

export const loginUser = async (
    email:string,
    password:string

)=>{
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        })
    });
    const data = await res.json();

    if(!res.ok) {
        throw new Error(data.message || "Login Failed");
    }
    return data;
}