export interface Role {
  id: number
  name: 'admin' | 'editor' | 'user'
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  role: Role
  role_id: number
  is_active?: boolean
  email_verified_at?: string | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
}

export const useAuth = () => {
  const user = useState<User | null>('auth.user', () => null)
  const token = useState<string | null>('auth.token', () => null)

  // Auto-initialize auth state from local storage on first use
  if (process.client && !user.value && !token.value) {
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

  // Initialize auth state from local storage
  const initAuth = () => {
    if (process.client) {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')
      
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      }
    }
  }

  // Login method
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await $fetch<AuthResponse>('/api/login', {
        baseURL: 'http://localhost:8000',
        method: 'POST',
        body: credentials
      })

      // Store auth data
      token.value = response.token
      user.value = response.user

      if (process.client) {
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('auth_user', JSON.stringify(response.user))
      }

      return response
    } catch (error: any) {
      throw new Error(error.data?.message || 'Login gagal')
    }
  }

  // Register method
  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await $fetch<AuthResponse>('/api/register', {
        baseURL: 'http://localhost:8000',
        method: 'POST',
        body: userData
      })

      // Store auth data
      token.value = response.token
      user.value = response.user

      if (process.client) {
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('auth_user', JSON.stringify(response.user))
      }

      return response
    } catch (error: any) {
      throw new Error(error.data?.message || 'Registrasi gagal')
    }
  }

  // Logout method
  const logout = async (): Promise<void> => {
    try {
      if (token.value) {
        await $fetch('/api/logout', {
          baseURL: 'http://localhost:8000',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.value}`
          }
        })
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Clear auth data regardless of API response
      token.value = null
      user.value = null

      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    }
  }

  // Get current user
  const getCurrentUser = async (): Promise<User> => {
    if (!token.value) {
      throw new Error('No authentication token')
    }

    try {
      const response = await $fetch<User>('/api/user', {
        baseURL: 'http://localhost:8000',
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })

      user.value = response

      if (process.client) {
        localStorage.setItem('auth_user', JSON.stringify(response))
      }

      return response
    } catch (error: any) {
      // If token is invalid, clear auth data
      if (error.statusCode === 401) {
        await logout()
      }
      throw new Error(error.data?.message || 'Gagal mendapatkan data user')
    }
  }

  // Check if user is authenticated
  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value
  })

  // Check if user has specific role
  const hasRole = (role: string | string[]) => {
    if (!user.value?.role) return false
    
    const userRoleName = user.value.role.name
    
    if (Array.isArray(role)) {
      return role.includes(userRoleName)
    }
    
    return userRoleName === role
  }

  // Check if user is admin
  const isAdmin = computed(() => {
    return user.value?.role?.name === 'admin'
  })

  // Check if user is editor
  const isEditor = computed(() => {
    return user.value?.role?.name === 'editor'
  })

  // Check if user can edit (admin or editor)
  const canEdit = computed(() => {
    return hasRole(['admin', 'editor'])
  })

  // Get authorization headers
  const getAuthHeaders = (): Record<string, string> => {
    if (!token.value) return {}
    
    return {
      'Authorization': `Bearer ${token.value}`
    }
  }

  // Update user profile
  const updateProfile = async (profileData: Partial<Pick<User, 'name' | 'email' | 'phone'> & { password?: string; password_confirmation?: string }>): Promise<User> => {
    if (!token.value) {
      throw new Error('Not authenticated')
    }

    try {
      const response = await $fetch<User>('/api/user/profile', {
        baseURL: 'http://localhost:8000',
        method: 'PUT',
        headers: getAuthHeaders(),
        body: profileData
      })

      user.value = response

      if (process.client) {
        localStorage.setItem('auth_user', JSON.stringify(response))
      }

      return response
    } catch (error: any) {
      throw new Error(error.data?.message || 'Gagal mengupdate profil')
    }
  }

  return {
    // State
    user: readonly(user),
    token: readonly(token),
    
    // Computed
    isAuthenticated,
    isAdmin,
    isEditor,
    canEdit,
    
    // Methods
    initAuth,
    login,
    register,
    logout,
    getCurrentUser,
    hasRole,
    getAuthHeaders,
    updateProfile
  }
}
