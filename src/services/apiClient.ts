const API_BASE_URL = 'https://pokeapi.co/api/v2'

export const apiClient = {
  async get(path: string) {
    const res = await fetch(`${API_BASE_URL}${path}`)
    if (!res.ok) throw new Error(`GET ${path} failed`)
    return res.json()
  },

  async post(path: string, body: any) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`POST ${path} failed`)
    return res.json()
  },

  async put(path: string, body: any) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`PUT ${path} failed`)
    return res.json()
  },

  async delete(path: string) {
    const res = await fetch(`${API_BASE_URL}${path}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`DELETE ${path} failed`)
    return res.json()
  },
}
