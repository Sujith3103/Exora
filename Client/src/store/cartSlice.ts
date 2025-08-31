// store/cartSlice.ts
import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getCartItems } from "@/services/userService";
import { getCartItemsFromIDB, deleteCartItemFromIDB, editCartItemStatus } from "@/lib/indexdb";

export interface CartItem {
  courseId: string;
  title: string;
  price: number;
  discountPrice?: number;
  thumbnailUrl: string;
  instructorName: string;
  addedAt: number;
  status: "cart" | "savedLater";
}

interface CartSliceState {
  data: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialCartSliceState: CartSliceState = {
  data: [],
  loading: false,
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
        console.log("id present",userId)
        const items = await getCartItems(userId);
        return items ?? [];  // ✅ ensure always array
      } else {
        // guest → fetch from IDB
        console.log("id guest",userId)
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
    moveToSavedLater(state, action: PayloadAction<string>) {
      const item = state.data.find((i) => i.courseId === action.payload);
      if (item) {
        item.status = "savedLater";
        void editCartItemStatus(item.courseId, "savedLater");
      }
    },
    moveToCart(state, action: PayloadAction<string>) {
      const item = state.data.find((i) => i.courseId === action.payload);
      if (item) {
        item.status = "cart";
        void editCartItemStatus(item.courseId, "cart");
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
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = "Unknown error";
        // state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { addItem, removeItem, moveToSavedLater, moveToCart } = cartSlice.actions;
export default cartSlice.reducer;
