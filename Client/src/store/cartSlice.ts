import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
    id: string;             
    title: string;           
    price: number;          
    discountPrice?: number;  
    thumbnailUrl: string;   
    instructorName: string;  
    addedAt: number;         
}


interface CartSliceState {
    data: CartItem[],
    total: number,
    loading: boolean,
    error: boolean
}

const initialCartSliceState: CartSliceState = {
    data: [],
    total: 0,
    loading: true,
    error: false
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialCartSliceState,
    reducers:{
        fetchCartstart(state: CartSliceState){
            state.loading = true
            state.error = false
        },




        fetchCartStop(state:CartSliceState, action:PayloadAction<boolean>){
            state.loading = false,
            state.error = action.payload
        }

    }
})

export const { } = cartSlice.actions

export default cartSlice.reducer