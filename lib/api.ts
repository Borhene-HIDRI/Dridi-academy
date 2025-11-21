export const api = {
  async post<T>(url: string, data: any): Promise<T> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "API error");
    }

    return res.json();
  }
};
