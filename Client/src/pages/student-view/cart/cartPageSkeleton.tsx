import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // Assuming you have a Skeleton component

const CartPageSkeleton = () => {
  return (
    <div className='md:px-35 px-5 mt-10 animate-pulse'>
      <Skeleton className='h-12 w-1/3 mb-5 bg-gray-200 opacity-50'/> {/* Shopping Cart title */}

      <div className='flex w-full'>
        <Skeleton className='h-6 w-1/4 mt-2 mb-5 bg-gray-200 opacity-50' /> {/* Courses in Cart */}
      </div>

      <div className='flex w-full h-full gap-6'>
        {/* Left side - cart items */}
        <div className='w-1/2 space-y-3'>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx} className='p-4 flex gap-4'>
              <Skeleton className='w-[120px] h-[75px] rounded-none bg-gray-200 opacity-50' /> {/* Thumbnail */}
              <div className='flex-1 space-y-2 '>
                <Skeleton className='h-4 w-3/4 bg-gray-200 opacity-50' /> {/* Title */}
                <Skeleton className='h-3 w-1/2 bg-gray-200 opacity-50' /> {/* Instructor */}
                <Skeleton className='h-4 w-1/4 bg-gray-200 opacity-50' /> {/* Price */}
              </div>
            </Card>
          ))}
        </div>

        {/* Right side - total / checkout */}
        <div className='w-1/2 bg-gray-100 p-4 space-y-4'>
          <Skeleton className='h-5 w-1/4 bg-gray-200 opacity-50' /> {/* Total label */}
          <Skeleton className='h-10 w-1/2 bg-gray-200 opacity-50' /> {/* Total price */}
          <Skeleton className='h-12 w-full bg-gray-200 opacity-50' /> {/* Proceed to checkout button */}
          <Skeleton className='h-3 w-2/3 bg-gray-200 opacity-50' /> {/* Info text */}
          <Skeleton className='h-10 w-full bg-gray-200 opacity-50' /> {/* Apply coupon */}
        </div>
      </div>
    </div>
  );
};

export default CartPageSkeleton;
