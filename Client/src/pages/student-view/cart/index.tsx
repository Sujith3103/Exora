// Cart.tsx
import { Card } from '@/components/ui/card'
import EmptyCartImg from '../../../assets-static/empty-shopping-cart-v2-2x.webp'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CartDialog from '@/components/student-view/cart-comp/cartDialog/cartDialog'
import CartItems from '@/components/student-view/cart-comp/cartItem/CartItem'
import { type CartItem, fetchCart } from '@/store/cartSlice'
import { getCartItemsFromIDB } from '@/lib/indexdb'
import CartPageSkeleton from './cartPageSkeleton'

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data: cartData } = useSelector((state: RootState) => state.cart);
  const isloading = useSelector((state: RootState) => state.auth.loading)
  const isLoading = useSelector((state: RootState) => state.cart.loading)

  const [triggerCartDialog, setTriggerCartDialog] = useState(false);
  const [cartItemsFromIDB, setCartItemsFromIDB] = useState<CartItem[]>([])

  useEffect(() => {
    if (!isloading) {
      if (isAuthenticated) {

        getCartItemsFromIDB().then(localItems => {
          dispatch(fetchCart(isAuthenticated ? (user?.id as unknown as string) ?? null : null) as any);
          //if something in local indexdb
          if (localItems.length > 0) {
            setCartItemsFromIDB(localItems)
            setTriggerCartDialog(true);

          }
        });
      } else {

        dispatch(fetchCart(isAuthenticated ? (user?.id as unknown as string) ?? null : null) as any);
      }
    }
  }, [isloading]);

  const activeCart = cartData.filter(c => c.status === "ACTIVE");
  const savedItems = cartData.filter(c => c.status === "SAVED_LATER");
  const totalCartItemsPrice = useMemo(
    () => activeCart.reduce((acc, c) => acc + c.price, 0),
    [activeCart]
  );

  if (isLoading) {
    return <CartPageSkeleton />
  }

  return (
    <div className='md:px-35 px-5 mt-10'>
      {triggerCartDialog && <CartDialog cartItem={cartItemsFromIDB} />}
      <h1 className='text-5xl font-bold'>Shopping Cart</h1>

      <div className='flex w-full'>
        <p className='mt-10 font-bold mb-2'>{activeCart.length} Courses in Cart</p>
      </div>

      {(activeCart.length === 0 && savedItems.length === 0) && (
        <Card className='w-full h-[50vh] items-center'>
          <img src={EmptyCartImg} className='aspect-video h-[180px] w-[240px]' />
          <p className='font-semibold sm:px-5 px-2'>Your cart is empty. Keep shopping to find a course!</p>
          <Button onClick={() => navigate('/')} className='bg-violet-700 rounded-sm hover:bg-purple-600 h-11 cursor-pointer'>Keep Shopping</Button>
        </Card>
      )}

      <div className='flex w-full h-full'>
        {/* cart items */}
        <div className='w-full'>
          {activeCart.length > 0 &&
            <div className='w-full space-y-3'>
              {activeCart.map((item) => (
                <CartItems key={item.courseId} item={item} status='cart' />
              ))}
            </div>
          }

          {savedItems.length > 0 && (
            <>
              <p className='mt-10 font-bold mb-2'>Saved For Later</p>
              {savedItems.map((item) => (
                <CartItems key={item.courseId} item={item} status='savedLater' />
              ))}
            </>
          )}
        </div>

        {(savedItems.length > 0 || activeCart.length > 0) && (
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
        )}
      </div>
    </div>
  )
}

export default Cart;
