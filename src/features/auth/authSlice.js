import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService, { userFromCookie } from './authService'
import { apiClient, apiClientBook, apiClientPrivate } from "./requests";
import { toast } from 'react-toastify';
// Get user from localStorage
const user =[]
const getusernotif =[]

const initialState = {
  user: user ? user : [],
  getusernotif : getusernotif ? getusernotif : null,
  getusernotifloading: false,
  getusernotifsuccess: false,
  updatingAccess: false,
  isError: false,
  userLoading:false,
  isSuccess: false,
  isLoading: false,
  message: '',
  justloggedin: false,
}

// signup user
export const signup = createAsyncThunk(
  'auth/signup',
  async (user, thunkAPI) => {
    try {
      return await authService.register(user)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Login user
export const login = createAsyncThunk('/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

/*
export const getUser = async () => {
    try {
      return await apiClient.get('/getuser');

      var now = new Date();
      var now2 = new Date();
      var time = now.getTime();
      var expireTime = time + 24 * 60 * 60 * 1000;
      var ATexpireTime = time + 10 * 1000;
      now.setTime(expireTime);
      now2.setTime(ATexpireTime);
      document.cookie = 'userpersist=true;expires=' + now.toUTCString() + ';path=/';
      document.cookie = 'ATexpire=true;expires=' + now2.toUTCString() + ';path=/';
    }
    catch (err) {
      toast.error('No Credentials, Please login again');
      document.cookie = "userpersist=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate('/studentlogin');
    }
}*/


export const getUser = createAsyncThunk('/getuser', async (_, thunkAPI) => {
    try {
      return await authService.getuser()
              
    } catch (error) {

      if(error.response.status === 403){
      document.cookie = "userpersist=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      await apiClient.get('/logout', {
       withCredentials: true
      });

      toast.error('Session Ended')

    
    }
      const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()

      
      return thunkAPI.rejectWithValue(message)
  }
    
})

export const getNotifs= createAsyncThunk('/getnotifs', async (_, thunkAPI) => {
    try {
       const res = await apiClientBook.get('/userNotifications');
       return res.data
              
    } catch (error) {
      const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()

      
      return thunkAPI.rejectWithValue(message)
  }
    
})


export const logoutUser = createAsyncThunk('/logoutuser', async () => {
    await authService.logoutuser()
})





export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.getusernotifloading = false
      state.getusernotifsuccess = false
      state.isLoading = false
      state.userLoading= false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },

  
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = null
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
        state.justloggedin = true
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true
        state.userLoading = true
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.userLoading = false
        state.user = action.payload
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getNotifs.pending, (state) => {
        state.getusernotifloading = true
     
      })
      .addCase(getNotifs.fulfilled, (state, action) => {
        state.getusernotifloading  = false
        state.getusernotifsuccess = true
        state.getusernotif = action.payload
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
      })

  },
})

export const { reset} = authSlice.actions
export default authSlice.reducer