    const token = localStorage.getItem('token');

export const api = {
  async get<T>(url: string): Promise<T> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" ,
            "Authorization": `Bearer ${token}`
      },
      
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "API GET error");
    }

    return res.json() as Promise<T>;
  },
  async post<T>(url: string, data?: any): Promise<T> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}`
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "API POST error");
    }

    return res.json() as Promise<T>;
  },

  async patch<T>(url: string, data?: any): Promise<T> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
       },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "API PATCH error");
    }

    return res.json() as Promise<T>;
  },

  async delete<T>(url: string): Promise<T> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
       },
    });;

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "API DELETE error");
    }

    return res.json() as Promise<T>;
  },
};
