import server from '@/api/axiosinstance'
import { deleteCartItemFromIDB } from '@/lib/indexdb'
import { addItem, moveToCart, moveToSavedLater, removeItem, type CartItem } from '@/store/cartSlice'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

const useCartMutation = () => {

  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  const addToCart = useMutation({
    mutationFn: async (item) => {
      const { data } = await server.post('/user/cart/items', item)
      return data
    },
    onMutate: (item: CartItem) => {
      dispatch(addItem(item))
      toast.loading('adding to cart', { style: { justifyContent: 'center' } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      toast.success('added to cart', { style: { justifyContent: 'center' }, duration: 1000 })
    },
    onError: (_err, item: CartItem) => {
      // Rollback: remove item from Redux
      dispatch(removeItem(item.courseId));
      toast.error('failed to add to cart', { style: { justifyContent: 'center' } })
    },
  })

  const RemoveItem = useMutation({
    mutationFn: async (item: CartItem) => {
      const res = await server.delete(`/user/cart/items/${item.id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      toast.dismiss()
      toast.success('removed item successfully', { style: { justifyContent: 'center' }, duration: 1000 })
    },
    onMutate: (item: CartItem) => {
      dispatch(removeItem(item.courseId))
      toast.loading('Removing from cart', { style: { justifyContent: 'center' } })

    },
    onError: (_err, item: CartItem) => {
      dispatch(addItem(item))
      toast.dismiss()
      toast.error("failed to remove item", { style: { justifyContent: 'center' } })
    }

  })

  const UpdateCartStatus = useMutation({
    mutationFn: async ({ item, status }: { item: CartItem, status: 'ACTIVE' | 'SAVED_LATER' }) => {
      await server.patch(`/user/cart/items/status/${item.id}`, { status })
    },

    onMutate: ({ item, status }: { item: CartItem, status: 'ACTIVE' | 'SAVED_LATER' }) => {
      if (status === 'SAVED_LATER') {
        dispatch(moveToSavedLater({ item: item.courseId, isAuthenticated: true }))
      }
      else if (status === 'ACTIVE') {
        dispatch(moveToCart({ item: item.courseId, isAuthenticated: true }))
      }
      toast.loading('updating cart', { style: { justifyContent: 'center' } })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      toast.dismiss()
      toast.success('updated cart successfully', { style: { justifyContent: 'center' }, duration: 1000 })
    },

    onError: (_err, variables) => {
      if (variables.status === 'SAVED_LATER') {
        dispatch(moveToCart({ item: variables.item.courseId, isAuthenticated: true }))

      }
      else if (variables.status === 'ACTIVE') {
        dispatch(moveToSavedLater({ item: variables.item.courseId, isAuthenticated: true }))
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
    onMutate: (items: CartItem[]) => {
      items.forEach((item) => dispatch(addItem(item)))
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
    }
  })

  return { addToCart, RemoveItem, UpdateCartStatus, batchUpdateCart }
}

export default useCartMutation
