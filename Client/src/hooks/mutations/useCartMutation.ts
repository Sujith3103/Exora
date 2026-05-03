import server from '@/api/axiosinstance'
import { deleteCartItemFromIDB } from '@/lib/indexdb'
import {  removeItem, type CartItem } from '@/store/cartSlice'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

const useCartMutation = () => {

  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  const addToCart = useMutation({
    mutationFn: async (item:CartItem) => {
      const { data } = await server.post('/user/cart/items', item)
      return data
    },
    onMutate: () => {
      // dispatch(addItem(item))
      toast.loading('adding to cart', { style: { justifyContent: 'center' } })
    },
    onSuccess: (item) => {
      // queryClient.invalidateQueries({ queryKey: ["cart"] })
      queryClient.setQueryData(["cart"], (old: any) => {
        if (!old) {
          return {
            success: true,
            message: "added locally",
            data: [item.cartItem]
          }
        }

        return {
          ...old,
          data: [...old.data, item.cartItem]
        }
      })
      toast.dismiss()
      toast.success('added to cart', { style: { justifyContent: 'center' }, duration: 1000 })
    },
    onError: (_err) => {
      // Rollback: remove item from Redux
      // dispatch(removeItem(item.courseId));
      toast.dismiss()
      toast.error('failed to add to cart', { style: { justifyContent: 'center' } })
    },
  })

  const RemoveItem = useMutation({
    mutationFn: async (item: CartItem) => {
      const res = await server.delete(`/user/cart/items/${item.id}`)
      return res.data
    },
    onSuccess: (item) => {
      // queryClient.invalidateQueries({ queryKey: ["cart"] })
      queryClient.setQueryData(["cart"], (old: any) => {
        return {
          ...old,
          data: old.data.map((c:any) => c.id !== item.itemId)
        }
      })

      toast.dismiss()
      toast.success('removed item successfully', { style: { justifyContent: 'center' }, duration: 1000 })
    },
    onMutate: () => {
      // dispatch(removeItem(item.courseId))
      toast.loading('Removing from cart', { style: { justifyContent: 'center' } })

    },
    onError: (_err) => {
      // dispatch(addItem(item))
      toast.dismiss()
      toast.error("failed to remove item", { style: { justifyContent: 'center' } })
    }

  })

  const UpdateCartStatus = useMutation({
    mutationFn: async ({ item, status }: { item: CartItem, status: 'ACTIVE' | 'SAVED_LATER' }) => {
      return await server.patch(`/user/cart/items/status/${item.id}`, { status })
    },

    onMutate: ({ status }: { item: CartItem, status: 'ACTIVE' | 'SAVED_LATER' }) => {
      if (status === 'SAVED_LATER') {
        // dispatch(moveToSavedLater({ item: item.courseId, isAuthenticated: true }))
      }
      else if (status === 'ACTIVE') {
        // dispatch(moveToCart({ item: item.courseId, isAuthenticated: true }))
      }
      toast.loading('updating cart', { style: { justifyContent: 'center' } })
    },

    onSuccess: (item) => {
      queryClient.setQueryData(["cart"], (old: any) => {
        return {
          ...old,
          data: old.data.map((c:any) => 
            c.courseId === item.data.res.courseId? item.data.res : c
          )     
          
        }
      })
      toast.dismiss()
      toast.success('updated cart successfully', { style: { justifyContent: 'center' }, duration: 1000 })
    },

    onError: (_err, variables) => {
      if (variables.status === 'SAVED_LATER') {
        // dispatch(moveToCart({ item: variables.item.courseId, isAuthenticated: true }))

      }
      else if (variables.status === 'ACTIVE') {
        // dispatch(moveToSavedLater({ item: variables.item.courseId, isAuthenticated: true }))
      }
      toast.dismiss()
      toast.error('failed to update', { style: { justifyContent: 'center' } })
    }
  })

  const batchUpdateCart = useMutation({
    mutationFn: async (items: CartItem[]) => {
      const res = await server.post('/user/cart/items/batch', items)
      return res.data.data
    },
    onMutate: () => {
      // items.forEach((item) => dispatch(addItem(item)))
      toast.loading('adding to cart', { style: { justifyContent: 'center' } })
    },

    onSuccess: (addedItems: CartItem[]) => {
      addedItems.forEach((item) => deleteCartItemFromIDB(item.courseId))
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      toast.dismiss()
      toast.success('added to cart successfully', { style: { justifyContent: 'center' }, duration: 1000 })
    },
    onError: (_err, items) => {
      items.forEach((item) => dispatch(removeItem(item.courseId)))
      toast.dismiss()
      toast.error('failed to add to cart', { style: { justifyContent: 'center' } })
    },
    onSettled: () => {
      toast.dismiss()
    }
  })

  return { addToCart, RemoveItem, UpdateCartStatus, batchUpdateCart }
}

export default useCartMutation
