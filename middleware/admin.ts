export default defineNuxtRouteMiddleware((to, from) => {
  // Access the auth state directly from nuxt state
  const user = useState<any>('auth.user')
  const token = useState<string | null>('auth.token')
  
  // Initialize auth from localStorage if not already set
  if (process.client && !user.value) {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }
  
  if (!user.value) {
    return navigateTo('/auth/login?redirect=' + encodeURIComponent(to.fullPath))
  }
  
  if (user.value.role?.name !== 'admin' && user.value.role?.name !== 'editor') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Insufficient permissions'
    })
  }
})
