import { Card } from '@/components/ui/card'
// import type { RootState } from '@/store'
import EmptyCartImg from '../../../assets-static/empty-shopping-cart-v2-2x.webp'
// import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import type { CartItem } from '@/store/cartSlice'
import { ArrowRight } from 'lucide-react'
import CartItems from '@/components/student-view/cartItem'
import { useCart } from '@/hooks/queries/useCart'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { useEffect, useState } from 'react'
import { getCartItems } from '@/services/userService'

const Cart = () => {

  const user = useSelector((state: RootState) => state.auth.user)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeCart, setActiveCart] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [totalCartItemsPrice, setTotalCartItemsPrice] = useState<number>()

  //login -> get from server
  //not login -> get from index db
  //when user logins first check the indexdb for any stored data
  //if not login store in the indexdb
  //create a redux for storing and keeping in the global state

  // const activeCart = cartItems.filter(c => c.status === 'cart')
  // const savedItems = cartItems.filter(c => c.status === 'savedLater')

  useEffect(() => {



  }, [])

  if (!user?.id) {
    console.log()
  }
  else {
    const { data, isLoading, isError } = useCart(user?.id as unknown as string)
    setCartItems(data.data)
  }

  useEffect(() => {
    async function fetchCartItems() {
      const res = await getCartItems(user?.id as unknown as string)
      if (res) {
        setActiveCart(res.filter(c => c.status === 'cart'))
        setSavedItems(res.filter(c => c.status === 'savedLater'))
      }
    }
    fetchCartItems()
  }, [])

  useEffect(() => {
    const sum = activeCart.reduce((acc, c) => acc + c.price, 0)
    setTotalCartItemsPrice(sum)
  }, [activeCart])

  // let cartItems = data?.data

  return (
    <div className='px-35 mt-10'>
      <h1 className='text-5xl font-bold'>Shopping Cart</h1>

      <div className='flex w-full'>
        <p className='mt-10 font-bold mb-2'>{activeCart?.length} Courses in Cart</p>
      </div>
      <div className='flex w-full h-full'>

        {
          (activeCart.length === 0 && savedItems.length === 0) && <>
            <Card className='w-full h-[50vh] items-center'>
              <img src={EmptyCartImg} className='aspect-video h-[180px] w-[240px]' />
              <p className='font-semibold'>Your cart is empty. Keep shopping to find a course!</p>
              <Button className='bg-violet-700 rounded-sm hover:bg-purple-600 h-11 cursor-pointer'>Keep Shopping</Button>
            </Card>
          </>
        }
        {/* cart items */}
        <div className='w-full'>

          {
            activeCart?.length > 0 &&
            <div className=' w-full space-y-3 '>
              {
                activeCart?.map((item: CartItem) => (
                  <CartItems key={item.courseId} item={item} status='cart' setCartItems={setCartItems} setActiveCart={setActiveCart} setSavedItems={setSavedItems} />
                ))
              }
            </div>
          }
          <p className='mt-10 font-bold mb-2'>Saved For Later</p>
          {
            savedItems.length > 0 && <>
              {
                savedItems?.map((item: CartItem) => (
                  <CartItems key={item.courseId} item={item} status='savedLater' setCartItems={setCartItems} setActiveCart={setActiveCart} setSavedItems={setSavedItems} />
                ))
              }
            </>
          }
        </div>

        {
          (savedItems.length > 0 || activeCart.length > 0) &&
          <div className="bg--200 w-1/2">
            <div className='ml-20 px-3'>
              <span className="text-muted-foreground font-bold">Total:</span>
              <h1 className="text-4xl font-bold mt-2">${totalCartItemsPrice}</h1>
              <Button className="bg-purple-700 w-full h-14 mt-5 rounded-sm font-bold text-center hover:bg-purple-500 cursor-pointer">
                Proceed to CheckOut
                <ArrowRight size={50} className="ml-2" />
              </Button>
              <p className='text-[13px] text-muted-foreground mt-2'>You won't be charged yet</p>
              <hr className='mt-5 border-gray-400' />
              <Button variant={'outline'} className="w-full h-12 border-purple-500 mt-5 rounded-sm font-bold text-purple-700 hover:text-purple-700 hover:bg-purple-100 cursor-pointer">Apply Coupon</Button>
            </div>
          </div>
        }
      </div>
    </div >
  )
}

export default Cart
