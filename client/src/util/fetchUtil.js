import toastr from 'toastr'
const BASE_URL = 'http://localhost:8080'

export async function fetchGet(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: 'include'
    })
    return await response.json()
  } catch (error) {
    toastr.error('And occured when trying to GET')
  }
}

export async function fetchPost(endpoint, body) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    })
    return await response.json()
  } catch (error) {
    toastr.error('An error occured when trying to POST')
  }
}

export async function fetchPatch(endpoint, body) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    })
    return await response.json()
  } catch (error) {
    toastr.error('An error occured when trying to PATCH')
  }
}

export async function fetchDelete(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    return await response.json()
  } catch (error) {
    toastr.error('An error occured when trying to DELETE')
  }
}
