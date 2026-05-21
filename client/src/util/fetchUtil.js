export async function fetchGet(endpoint) {
try {
    const response = await fetch(`http://localhost:8080${endpoint}`, {
        credentials: 'include'
    })
    return await response.json()
} catch (error) {
    toastr.error('And occured when trying to get')
}}

export async function fetchPost(endpoint, body) {
    try {
    const response = await fetch(`http://localhost:8080${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(body)
        })
        return await response.json()
    } catch (error) {
        toastr.error('An error occured when trying to post')
    }}


export async function fetchPatch(endpoint, body) {
    try {
    const response = await fetch(`http://localhost:8080${endpoint}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(body)
        })
        return await response.json()
    } catch (error) {
        toastr.error('An error occured when trying to update')
    }}


export async function fetchDelete(endpoint) {
    try {
    const response = await fetch(`http://localhost:8080${endpoint}`, {
            method: "DELETE",
            credentials: 'include',
        })
        return await response.json()
    } catch (error) {
        toastr.error('An error occured when trying to delete')
    }}