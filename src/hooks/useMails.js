import { useState } from 'react'

const API_BASE_URL = 'http://localhost:8000/api/v1'

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('auth_token')
  const isFormData = options.body instanceof FormData

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      data.message ||
      data.error ||
      Object.values(data.errors || {})?.flat()?.[0] ||
      'Request failed.'

    throw new Error(message)
  }

  return data
}

export function useMails() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const runRequest = async (request, successMessage = '') => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const data = await request()

      if (successMessage) {
        setSuccess(successMessage)
      }

      return data
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const logout = () =>
    runRequest(async () => {
      const data = await apiRequest('/logout', { method: 'POST' })
      localStorage.removeItem('auth_token')
      return data
    })

  const sendMail = (payload) =>
    runRequest(
      () =>
        apiRequest('/send', {
          method: 'POST',
          body: payload instanceof FormData ? payload : JSON.stringify(payload),
        }),
      'Mail sent successfully.',
    )

  const getInbox = () => runRequest(() => apiRequest('/inbox'))

  const getSent = () => runRequest(() => apiRequest('/sent'))

  const getMail = (id) => runRequest(() => apiRequest(`/mail/${id}`))

  return {
    loading,
    error,
    success,
    logout,
    sendMail,
    getInbox,
    getSent,
    getMail,
  }
}
