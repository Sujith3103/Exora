import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { deleteCartItemFromIDB, editCartItemStatus } from '@/lib/indexdb';
import type { CartItem } from '@/store/cartSlice'
import React from 'react'

interface CartItemProps {
    item: CartItem;
    status: 'cart' | 'savedLater';
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
    setActiveCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    setSavedItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const CartItems: React.FC<CartItemProps> = ({ item, status, setCartItems, setActiveCart, setSavedItems }) => {

    const handleClick_RemoveItem = () => {
        if (item.status === 'cart') {
            setActiveCart(prev => prev.filter(i => i.courseId != item.courseId))

        } else if (item.status === 'savedLater') {
            setSavedItems(prev => prev.filter(i => i.courseId != item.courseId))
        }
        deleteCartItemFromIDB(item.courseId)

    }

    const handleClick_SaveForCart = (item: CartItem) => {
        setActiveCart(prev => [...prev, { ...item, status: 'cart' }]);
        setSavedItems(prev => prev.filter(cartItem => cartItem.courseId !== item.courseId));
        editCartItemStatus(item.courseId, 'cart')
    }

    const handleClick_SaveForLater = (item: CartItem) => {
        setSavedItems(prev => [...prev, { ...item, status: 'savedLater' }]);
        setActiveCart(prev => prev.filter(cartItem => cartItem.courseId !== item.courseId));
        editCartItemStatus(item.courseId, 'savedLater')
    };

    return (
        <div>
            <Card className='bg-neutral- w-full flex flex-row border-0 border-t-2 gap-0 border-gray-200 shadow-none rounded-none'>
                <div className="w-[300px] h-[100px] overflow-hidden rounded-none">
                    <img
                        src={item.thumbnailUrl}
                        alt=""
                        className="w-full h-full object-fill"
                    />
                </div>
                <div className='space-y-2 w-full ml-4'>
                    <p className='font-bold'>{item.title}</p>
                    <p className='text-sm'>By <span>{item.instructorName}</span></p>
                    <p>Ratings</p>
                    <p>Hours • lectures • Levels</p>
                </div>
                <div className='mr-9'>
                    <Button variant={'ghost'} className='text-purple-500 hover:text-purple-500 cursor-pointer'
                        onClick={() => handleClick_RemoveItem()}
                    >
                        Remove
                    </Button>
                    {
                        status === "cart" && (
                            <Button variant={'ghost'} className='text-purple-500 hover:text-purple-500 cursor-pointer'
                                onClick={() => handleClick_SaveForLater(item)}
                            >
                                Save for Later
                            </Button>
                        )
                    }
                    {
                        status === "savedLater" && (
                            <Button variant={'ghost'} className='text-purple-500 hover:text-purple-500 cursor-pointer'
                                onClick={() => handleClick_SaveForCart(item)}
                            >
                                Move to Cart
                            </Button>
                        )
                    }
                </div>
                <span className='flex '>
                    <p className='font-bold'>${item.price}</p>
                </span>
            </Card>
        </div>
    )
}

export default CartItems
