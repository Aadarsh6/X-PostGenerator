const conf = {
    // Your backend API base URL
    apiBaseUrl: String(import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"),
    
    // Optional: Add API key if your backend requires it
    // apiKey: String(import.meta.env.VITE_API_KEY)
}

export default conf