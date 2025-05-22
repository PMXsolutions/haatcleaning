import axios from "axios"

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 60000,
})

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage or other storage mechanism
    const authToken = localStorage.getItem("authToken")

    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error

    if (response) {
      switch (response.status) {
        case 401: // Unauthorized
        case 403: // Forbidden
          // Handle authentication errors
          localStorage.removeItem("authToken")
          // Store current path for redirect after login
          localStorage.setItem("redirectPath", window.location.pathname)
          // Redirect to login page
          // window.location.href = '/login';
          break

        case 404:
          // Handle not found errors
          console.error("Resource not found:", response.config.url)
          break

        case 500:
          // Handle server errors
          console.error("Server error:", response.data)
          break

        default:
          // Handle other errors
          console.error(`Error ${response.status}:`, response.data)
          break
      }
    } else {
      // Network errors or other issues where response is not available
      console.error("Network error or request cancelled")
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
