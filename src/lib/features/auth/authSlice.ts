import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials: { email: string; password: string }) => {
        try {
            // Replace with your actual API call
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });
            
            if (!response.ok) {
                throw new Error("Login failed");
            }
            
            const data = await response.json();
            return data as User;
        } catch (error) {
            throw error instanceof Error ? error.message : "Login failed";
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Login failed";
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
