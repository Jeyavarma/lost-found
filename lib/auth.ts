export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'staff' | 'admin'
}

export const AUTH_TOKEN_KEY = 'authToken'
export const USER_DATA_KEY = 'userData'

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(USER_DATA_KEY)
  localStorage.removeItem('userType')
  localStorage.removeItem('userName')
  localStorage.removeItem('token')
}

export function getUserData(): User | null {
  if (typeof window === 'undefined') return null
  const userData = localStorage.getItem(USER_DATA_KEY)
  return userData ? JSON.parse(userData) : null
}

export function setUserData(user: User): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://lost-found-79xn.onrender.com/api/auth/validate', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.ok
  } catch {
    return false
  }
}

export function isAuthenticated(): boolean {
  const token = getAuthToken()
  return !!token
}

export function logout(): void {
  removeAuthToken()
  window.location.href = '/'
}