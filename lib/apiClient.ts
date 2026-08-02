const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean>;
};

export const apiClient = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { params, headers, ...customConfig } = options;

  let url = `${BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  const config: RequestInit = {
    method: "GET",
    ...customConfig,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    // Crucial for sending cookies automatically (e.g., refresh tokens, access tokens)
    credentials: "include", 
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error: any) {
    throw error;
  }
};
