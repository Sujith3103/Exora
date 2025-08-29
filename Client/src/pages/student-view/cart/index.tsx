import { Card } from '@/components/ui/card'
// import type { RootState } from '@/store'
import EmptyCartImg from '../../../assets-static/empty-shopping-cart-v2-2x.webp'
// import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import type { CartItem } from '@/store/cartSlice'
import { ArrowRight } from 'lucide-react'

const Cart = () => {

  // const cartItems = useSelector((state: RootState) => state.cart.data)

  const cartItems: CartItem[] = [
    {
      id: '123',
      title: 'Advanced JavaScript: ES6+ and Beyond BeyondBeyond',
      price: 5,
      // discountPrice?: number;
      thumbnailUrl: 'https://res.cloudinary.com/dtqxsa4pe/image/upload/v1755937895/xhuyc1hf7y2rtjxvmzwz.jpg',
      instructorName: 'vincent',
      addedAt: 12 / 2 / 4
    },
    {
      id: '123',
      title: 'JavaScript Essentials for Beginners',
      price: 5,
      // discountPrice?: number;
      thumbnailUrl: 'https://res.cloudinary.com/dtqxsa4pe/image/upload/v1755937617/p5lf8b6sruhq5qcgbbjx.jpg',
      instructorName: 'vincent',
      addedAt: 12 / 2 / 4
    }
  ]

  return (
    <div className='px-35 mt-10'>
      <h1 className='text-5xl font-bold'>Shopping Cart</h1>

      <div className='flex w-full'>
        <p className='mt-10 font-bold mb-2'>{cartItems.length} Courses in Cart</p>
      </div>
      <div className='flex w-full'>
        {
          cartItems.length === 0 ? (
            <Card className='w-full h-[50vh] items-center'>
              <img src={EmptyCartImg} className='aspect-video h-[180px] w-[240px]' />
              <p className='font-semibold'>Your cart is empty. Keep shopping to find a course!</p>
              <Button className='bg-violet-700 rounded-sm hover:bg-purple-600 h-11 cursor-pointer'>Keep Shopping</Button>
            </Card>
          ) : (
            <div className='h-full w-full space-y-3'>
              {
                cartItems.map(item => (
                  <Card className='bg-neutral- w-full flex flex-row border-0 border-t-2 gap-0 border-gray-200 shadow-none rounded-none'>
                    <img src={item.thumbnailUrl} className='object-cover max-h-[90px] w-[140px]' />
                    <div className='space-y-2  w-full ml-4'>
                      <p className='font-bold'>{item.title}</p>
                      <p className='text-sm'>By <span>{item.instructorName}</span></p>
                      <p>Ratings</p>
                      <p>Hours lectures Levels</p>
                    </div>
                    <div className='mr-9'>
                      <Button variant={'ghost'} className='text-purple-500 hover:text-purple-500 cursor-pointer'>Remove</Button>
                      <Button variant={'ghost'} className='text-purple-500 hover:text-purple-500 cursor-pointer'>Save for Later</Button>
                    </div>
                    <span className='flex '>
                      <p className='font-bold'>${item.price}</p>
                    </span>
                  </Card>
                ))
              }
            </div>
          )
        }

        <div className="bg--200 w-1/2">
          <div className='ml-20 px-3'>
            <span className="text-muted-foreground font-bold">Total:</span>
            <h1 className="text-4xl font-bold mt-2">${ }69</h1>
            <Button className="bg-purple-700 w-full h-14 mt-5 rounded-sm font-bold text-center hover:bg-purple-500 cursor-pointer">
              Proceed to CheckOut
              <ArrowRight size={50} className="ml-2" />
            </Button>
            <p className='text-[13px] text-muted-foreground mt-2'>You won't be charged yet</p>
            <hr className='mt-5 border-gray-400'/>
            <Button variant={'outline'} className="w-full h-12 border-purple-500 mt-5 rounded-sm font-bold text-purple-700 hover:text-purple-700 hover:bg-purple-100 cursor-pointer">Apply Coupon</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
