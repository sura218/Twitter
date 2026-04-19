import axios from 'axios'

const newRequest = axios.create({
  baseURL:         process.env.NEXT_PUBLIC_API_URL ?'http://localhost:5500/api': '/api',
  withCredentials: true,   // ← sends cookie automatically with every request
})

console.log("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL)

// if session expired redirect to login
newRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default newRequest