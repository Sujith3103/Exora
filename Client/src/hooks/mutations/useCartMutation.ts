import server from '@/api/axiosinstance'
import { deleteCartItemFromIDB } from '@/lib/indexdb'
import { addItem, moveToCart, moveToSavedLater, removeItem, type CartItem } from '@/store/cartSlice'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'

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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
    onError: (_err, item: CartItem) => {
      // Rollback: remove item from Redux
      dispatch(removeItem(item.courseId));
    },
  })

  const RemoveItem = useMutation({
    mutationFn: async (item: CartItem) => {
      const res = await server.delete(`/user/cart/items/${item.id}`)
      return res.data
    },

    onMutate: (item: CartItem) => {
      dispatch(removeItem(item.courseId))
    },
    onError: (_err, item: CartItem) => {
      dispatch(addItem(item))
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
    },

    onError: (_err, variables) => {
      if (variables.status === 'SAVED_LATER') {
        dispatch(moveToCart({ item: variables.item.courseId, isAuthenticated: true }))

      }
      else if (variables.status === 'ACTIVE') {
        dispatch(moveToSavedLater({ item: variables.item.courseId, isAuthenticated: true }))
      }
    }

  })

  const batchUpdateCart = useMutation({
    mutationFn: async (items: CartItem[]) => {
      const res = await server.post('/user/cart/items/batch', items)
      return res.data.data
    },
    onMutate: (items: CartItem[]) => {
      items.forEach((item) => dispatch(addItem(item)))
    },

    onSuccess: (addedItems: CartItem[]) => {
      addedItems.forEach((item) => deleteCartItemFromIDB(item.courseId))
    },
    onError: (_err, items) => {
      items.forEach((item) => dispatch(removeItem(item.courseId)))
    }

  })

  return { addToCart, RemoveItem, UpdateCartStatus, batchUpdateCart }
}

export default useCartMutation
