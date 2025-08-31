import server from "@/api/axiosinstance"
import type { ClickEvent } from "@/config/config"
import {  getCartItemsFromIDB } from "@/lib/indexdb"
// import { useSelector } from "react-redux";
// import type { RootState } from "../store";


// const profile = useSelector((state: RootState) => state.profile.data)
// const security = useSelector((state:  RootState) => state.profile.security)


export const FetchUserProfileData = async () => {

  const response = await server.get('/user/get-profile')

  return response

}


export const FetchUserSecurityData = async () => {

  const response = await server.get('/user/get-security')

  return response
}


export const trackClick = async (clickEvent: ClickEvent) => {
  try {
    const response = await server.post("/track-click", clickEvent);
    return response.data;
  } catch (err) {
    console.error("Click tracking failed:", err);
    return null;
  }
};

// export const addItemToCartIDB = async (item: CartItem) => {
//   try {
//     // if (id) {
//     //   console.log("id present to add to cart")
//     //   const { addToCart } = useCartMutation()
//     //   addToCart.mutate(item)
//     // } else {
//       await addCartItemToDb(item);
    
//   } catch (err) {
//     console.error("Error adding item to cart:", err);
//     throw err;
//   }
// };

export const getCartItems = async (id: string) => {

  try {

    if (id) {

    } else {

      return await getCartItemsFromIDB()

    }

  } catch (err) {
    console.error("Error adding item to cart:", err);
    throw err
  }

}