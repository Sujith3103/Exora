// store/cartSlice.ts
import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getCartItemsFromIDB, deleteCartItemFromIDB, editCartItemStatusInIDB } from "@/lib/indexdb";
import server from "@/api/axiosinstance";


export interface CartItem {
  id?: string
  courseId: string;
  title: string;
  price: number;
  discountPrice?: number;
  thumbnailUrl: string;
  instructorName: string;
  addedAt: number;
  status: "ACTIVE" | "SAVED_LATER";
}

interface CartSliceState {
  data: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialCartSliceState: CartSliceState = {
  data: [],
  loading: true,
  error: null,
};
// export const mergeCarts = createAsyncThunk<
//   CartItem[],
//   { userId: string; localItems: CartItem[] },
//   { rejectValue: string }
// >(
//   "cart/merge",
//   async ({ userId, localItems }, { rejectWithValue }) => {
//     try {
//       // 1. Push localItems to server
//       await uploadCartItems(userId, localItems);
//       // 2. Fetch final cart from server
//       const merged = await getCartItems(userId);
//       // 3. Clear IDB since server is now source of truth
//       await clearCartFromIDB();
//       return merged ?? [];
//     } catch (err) {
//       return rejectWithValue("Failed to merge carts");
//     }
//   }
// );

// 🔹 Thunks
export const fetchCart = createAsyncThunk<
  CartItem[],        // ✅ return type is always an array
  string | null,     // arg type
  { rejectValue: string }
>(
  "cart/fetch",
  async (userId, { rejectWithValue }) => {
    try {
      if (userId) {
        // logged-in → fetch server
        const items = await server.get('/user/cart');
        return items.data.data ?? [];  // ✅ ensure always array
      } else {
        // guest → fetch from IDB
        const items = await getCartItemsFromIDB();
        return items ?? [];  // ✅ ensure always array
      }
    } catch (err) {
      return rejectWithValue("Failed to fetch cart");
    }
  }
);


const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartSliceState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      state.data.push(action.payload);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.data = state.data.filter((item) => item.courseId !== action.payload);
      // ❌ not recommended to call async here
      void deleteCartItemFromIDB(action.payload);
    },
    moveToSavedLater(state, action: PayloadAction<{item:string,isAuthenticated:boolean}>) {
      const item = state.data.find((i) => i.courseId === action.payload.item);
      if (item) {
        item.status = "SAVED_LATER";
        if (!action.payload.isAuthenticated) {
          void editCartItemStatusInIDB(item.courseId, "SAVED_LATER");
        }
      }
    },
    moveToCart(state, action: PayloadAction<{item:string,isAuthenticated:boolean}>) {
      const item = state.data.find((i) => i.courseId === action.payload.item);
      if (item) {
        item.status = "ACTIVE";
        if (!action.payload.isAuthenticated) {
          void editCartItemStatusInIDB(item.courseId, "ACTIVE");
        }

      }

    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.data = action.payload ?? [];
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
        state.error = "Unknown error";
        // state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { addItem, removeItem, moveToSavedLater, moveToCart } = cartSlice.actions;
export default cartSlice.reducer;
