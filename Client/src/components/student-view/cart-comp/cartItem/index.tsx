// CartItems.tsx
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { CartItem } from '@/store/cartSlice'
import React from 'react'
import { useDispatch } from 'react-redux'
import { removeItem, moveToCart, moveToSavedLater } from '@/store/cartSlice'

interface CartItemProps {
  item: CartItem;
  status: 'cart' | 'savedLater';
}

const CartItems: React.FC<CartItemProps> = ({ item, status }) => {
  const dispatch = useDispatch();

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
            onClick={() => dispatch(removeItem(item.courseId))}
          >
            Remove
          </Button>

          {status === "cart" && (
            <Button
              variant={'ghost'}
              className='text-purple-500 hover:text-purple-500 cursor-pointer'
              onClick={() => dispatch(moveToSavedLater(item.courseId))}
            >
              Save for Later
            </Button>
          )}

          {status === "savedLater" && (
            <Button
              variant={'ghost'}
              className='text-purple-500 hover:text-purple-500 cursor-pointer'
              onClick={() => dispatch(moveToCart(item.courseId))}
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
