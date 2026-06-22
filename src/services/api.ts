import conf from "@/conf/conf"
import { useAuthStore } from "@/store/authStore"

const getHeaders = (): Record<string, string> => {
    const token = useAuthStore.getState().token
    return{
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    }
}

export const api = {
    async signup(name:string, email:string, password:string){
        const res = await fetch(`${conf.apiBaseUrl}/auth/signup`,{
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name, email, password })
        })
        const data = await res.json()
         if (!res.ok) throw new Error(data.message || `Error ${res.status}`)
    return data
  },

  async login(email:string, password:string) {
    const res = await fetch(`${conf.apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Error ${res.status}`)
    return data
  },

  async generatePost(prompt:string, tone:string, PostType:string) {
    const res = await fetch(`${conf.apiBaseUrl}/api/generate-post`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ prompt, tone, PostType }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
    return data
  },

  async getPosts() {
    const res = await fetch(`${conf.apiBaseUrl}/api/posts`, {
      headers: getHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
    return data
  },

  async deletePost(id:string) {
    const res = await fetch(`${conf.apiBaseUrl}/api/posts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
    return data
  },

  async checkHealth() {
    try {
      const res = await fetch(`${conf.apiBaseUrl}/api/health`)
      return await res.json()
    } catch {
      return { status: 'ERROR' }
    }
  },
}