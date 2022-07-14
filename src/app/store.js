import { configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bookReducer from '../features/book/bookSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        book: bookReducer
    }
})