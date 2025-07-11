export default defineNuxtPlugin(() => {
  // Initialize auth state from localStorage on app start
  if (process.client) {
    const user = useState<any>('auth.user', () => null)
    const token = useState<string | null>('auth.token', () => null)
    
    // Only initialize if not already set
    if (!user.value && !token.value) {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')
      
      if (storedToken && storedUser) {
        try {
          token.value = storedToken
          user.value = JSON.parse(storedUser)
        } catch (error) {
          // Clear invalid stored data
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
        }
      }
    }
  }
})
