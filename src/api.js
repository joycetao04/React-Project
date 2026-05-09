const API_BASE_URL = "http://localhost:5000/api";

export const getAuthToken = () => {
    return localStorage.getItem("nexo_token");
};

export const apiRequest = async (path, options = {}) => {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
            ...(options.headers || {}),
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "API request failed.");
    }
    
    return data;
};