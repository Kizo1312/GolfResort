export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
): Promise<T> {
  const token = localStorage.getItem("token");
  console.log("TOKEN:", token);

  const res = await fetch(`http://127.0.0.1:5000${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Neuspješni zahtjev.");
  }

  const data = await res.json();
  return data;
}
