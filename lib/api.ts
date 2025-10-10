export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_BASE_URL}${endpoint}`
  return fetch(url, options)
}