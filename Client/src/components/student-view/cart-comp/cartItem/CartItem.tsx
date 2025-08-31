// CartItems.tsx
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { CartItem } from '@/store/cartSlice'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeItem, moveToCart, moveToSavedLater } from '@/store/cartSlice'
import type { RootState } from '@/store'
import useCartMutation from '@/hooks/mutations/useCartMutation'

interface CartItemProps {
  item: CartItem;
  status: 'cart' | 'savedLater';
}

const CartItems: React.FC<CartItemProps> = ({ item, status }) => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  const {RemoveItem,addToCart,UpdateCartStatus} = useCartMutation()

  const handleClick_SaveForLater = () => {
    if (isAuthenticated) {
      UpdateCartStatus.mutate({item:item,status:'SAVED_LATER'})
    }
    else{
      dispatch(moveToSavedLater({item:item.courseId,isAuthenticated:false}))
    }
  }
  const handleClick_MoveToCart = () => {
    if (isAuthenticated) {
      UpdateCartStatus.mutate({item:item,status:'ACTIVE'})
    }
    else{
      dispatch(moveToCart({item:item.courseId,isAuthenticated:false}))
    }
  }

  const handleClick_RemoveItem = () => {
    if (isAuthenticated) {
      RemoveItem.mutate(item)
    } else {
      dispatch(removeItem(item.courseId))
    }
  }

  return (
    <div>
      <Card className='bg-neutral- w-full flex flex-row border-0 border-t-2 gap-0 border-gray-200 shadow-none rounded-none'>
        <div className="w-[300px] h-[100px] overflow-hidden rounded-none">
          <img src={item.thumbnailUrl} alt="" className="w-full h-full object-fill" />
        </div>

        <div className='space-y-2 w-full ml-4'>
          <p className='font-bold'>{item.title}</p>
          <p className='text-sm'>By <span>{item.instructorName}</span></p>
          <p>Ratings</p>
          <p>Hours • lectures • Levels</p>
        </div>

        <div className='mr-9'>
          <Button
            variant={'ghost'}
            className='text-purple-500 hover:text-purple-500 cursor-pointer'
            onClick={handleClick_RemoveItem}
          >
            Remove
          </Button>

          {status === "cart" && (
            <Button
              variant={'ghost'}
              className='text-purple-500 hover:text-purple-500 cursor-pointer'
              onClick={handleClick_SaveForLater}
            >
              Save for Later
            </Button>
          )}

          {status === "savedLater" && (
            <Button
              variant={'ghost'}
              className='text-purple-500 hover:text-purple-500 cursor-pointer'
              onClick={handleClick_MoveToCart}
            >
              Move to Cart
            </Button>
          )}
        </div>

        <span className='flex '>
          <p className='font-bold'>${item.price}</p>
        </span>
      </Card>
    </div>
  )
}

export default CartItems;
