import { useState } from 'react'

const API_BASE_URL = 'http://localhost:8000/api/v1'

async function sendAuthRequest(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      data.message ||
      data.error ||
      Object.values(data.errors || {})?.flat()?.[0] ||
      'Something went wrong. Please try again.'

    throw new Error(message)
  }

  return data
}

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const runRequest = async (request, successMessage) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const data = await request()
      const token = data.token || data.access_token || data.data?.token

      if (token) {
        localStorage.setItem('auth_token', token)
      }

      setSuccess(successMessage)
      return data
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const login = (payload) =>
    runRequest(
      () => sendAuthRequest('/login', payload),
      'Login successful.',
    )

  const register = (payload) =>
    runRequest(
      () => sendAuthRequest('/register', payload),
      'Account created successfully.',
    )

  return {
    loading,
    error,
    success,
    setError,
    login,
    register,
  }
}
