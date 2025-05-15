import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axios';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Get user from localStorage
const user = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user') || '{}')
  : null;
const token = localStorage.getItem('token');

const initialState: AuthState = {
  user,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

// Helper functions for mock authentication
const getRegisteredUsers = (): any[] => {
  const users = localStorage.getItem('registeredUsers');
  return users ? JSON.parse(users) : [];
};

const saveRegisteredUser = (user: any) => {
  const users = getRegisteredUsers();
  users.push(user);
  localStorage.setItem('registeredUsers', JSON.stringify(users));
};

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      // For local development without backend, use mock registration
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo, validate input
        if (!userData.password || !userData.name || !userData.email) {
          return rejectWithValue('All fields are required');
        }
        
        // Check if user already exists
        const existingUsers = getRegisteredUsers();
        const userExists = existingUsers.some(user => user.email === userData.email);
        
        if (userExists) {
          return rejectWithValue('User with this email already exists');
        }
        
        // Create new user
        const mockUser = {
          _id: 'user-' + Date.now(),
          name: userData.name,
          email: userData.email,
          password: userData.password, // In real app, this would be hashed
          token: 'mock-token-' + Date.now(),
        };
        
        // Save user to mock database
        saveRegisteredUser(mockUser);
        
        // Store auth info in localStorage (excluding password)
        const { password, ...userWithoutPassword } = mockUser;
        localStorage.setItem('token', mockUser.token);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('currentUserId', mockUser._id);
        
        return userWithoutPassword;
      }
      
      // In production, use real API
      const response = await axiosInstance.post('/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('currentUserId', response.data._id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // For local development without backend, use mock login
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Validate input
        if (!userData.email || !userData.password) {
          return rejectWithValue('Email and password are required');
        }
        
        // Check if user exists
        const existingUsers = getRegisteredUsers();
        const user = existingUsers.find(user => 
          user.email === userData.email && user.password === userData.password
        );
        
        if (!user) {
          // Check if it's specifically an email not found or wrong password
          const emailExists = existingUsers.some(user => user.email === userData.email);
          if (emailExists) {
            return rejectWithValue('Incorrect password');
          } else {
            return rejectWithValue('User not found. Please register first.');
          }
        }
        
        // User exists and password matches
        const { password, ...userWithoutPassword } = user;
        
        // Store in localStorage
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('currentUserId', user._id);
        
        return userWithoutPassword;
      }
      
      // In production, use real API
      const response = await axiosInstance.post('/auth/login', userData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('currentUserId', response.data._id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Get user profile
export const getUserProfile = createAsyncThunk(
  'auth/profile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user profile');
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('currentUserId');
  return null;
});

// Export aliases for components
export const login = loginUser;
export const register = registerUser;
export const logout = logoutUser;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Get user profile
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Logout user
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 