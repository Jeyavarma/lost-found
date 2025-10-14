export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

// Validate URL to prevent SSRF
const isValidEndpoint = (endpoint: string): boolean => {
  // Only allow relative paths starting with /
  return endpoint.startsWith('/') && !endpoint.includes('..')
}

export const apiCall = async (endpoint: string, options?: RequestInit) => {
  if (!isValidEndpoint(endpoint)) {
    throw new Error('Invalid endpoint')
  }
  const url = `${API_BASE_URL}${endpoint}`
  return fetch(url, options)
}