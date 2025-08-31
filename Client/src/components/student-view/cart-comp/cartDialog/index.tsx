import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CartItem } from "@/store/cartSlice";
import { memo, useEffect, useState } from "react";

interface CartDialogProps {
  cartItem: CartItem[];
}

const CartDialog = ({ cartItem }: CartDialogProps) => {
  const [activeCartItems, setActiveCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isselectall, setIsSelectAll] = useState<boolean>(false)

  useEffect(() => {

    setActiveCartItems(cartItem.filter((c) => c.status === "ACTIVE"));
    setSavedItems(cartItem.filter((c) => c.status === "SAVED_LATER"));


    setSelectedIds(new Set(cartItem.map((c) => c.courseId)));
  }, [cartItem]);


  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Select all
  const selectAll = () => {
    if (isselectall) {
      setSelectedIds(new Set(cartItem.map((c) => c.courseId)));
    }
    else {
      setSelectedIds(new Set())
    }
    setIsSelectAll(prev => !prev)
  };

  // Handle click
  const HandleClick_AddItemsToCart = () => {
    const selectedItems = cartItem.filter((c) => selectedIds.has(c.courseId));
    console.log("Selected items:", selectedItems);
  };

  return (
    <div>
      <Dialog defaultOpen>
        <DialogContent className="sm:max-w-lg ">
          <DialogHeader>
            <DialogTitle>Found Items in your device</DialogTitle>
          </DialogHeader>

          {/* Select All */}
          <div className="flex">
            <Button
              variant="outline"
              className="ml-auto cursor-pointer relative w-[120px] h-[40px]"
              onClick={selectAll}
            >
              <span
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isselectall ? "opacity-100" : "opacity-0"
                  }`}
              >
                Select All
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isselectall ? "opacity-0" : "opacity-100"
                  }`}
              >
                Deselect All
              </span>
            </Button>

          </div>

          {/* Active Cart Items */}
          <div className="max-h-[60vh] overflow-auto">
            {
              activeCartItems.length > 0 && <p className="font-bold mb-2">Items in Cart</p>
            }
            {activeCartItems.map((item) => (
              <div
                className="mb-4 flex justify-between text-sm"
                key={item.courseId}
              >
                <div className="w-[120px] h-[75px] overflow-hidden rounded-none">
                  <img
                    src={item.thumbnailUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1 ml-2">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-muted-foreground">
                    By. {item.instructorName}
                  </span>
                  <span>${item.price}</span>
                </div>
                <div className="pl-3">
                  <Checkbox
                    checked={selectedIds.has(item.courseId)}
                    onCheckedChange={() => toggleSelection(item.courseId)}
                    className="border-purple-700"
                  />
                </div>
              </div>
            ))}

            <hr className="mb-2 border-1" />
            {/* Saved for Later */}
            {
              savedItems.length > 0 && <p className="font-bold mb-3">Saved for Later</p>
            }
            {savedItems.map((item) => (
              <div
                className="mb-4 flex justify-between text-sm"
                key={item.courseId}
              >
                <div className="w-[120px] h-[75px] overflow-hidden rounded-none">
                  <img
                    src={item.thumbnailUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1 ml-2">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-muted-foreground">
                    By. {item.instructorName}
                  </span>
                  <span>${item.price}</span>
                </div>
                <div className="pl-3">
                  <Checkbox
                    checked={selectedIds.has(item.courseId)}
                    onCheckedChange={() => toggleSelection(item.courseId)}
                    className="border-purple-700"
                  />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant={'destructive'} className="mr-auto cursor-pointer">Dont Add To Cart</Button>
            <Button
              className="w-30 cursor-pointer rounded-sm"
              onClick={HandleClick_AddItemsToCart}
            >
              Add to cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default memo(CartDialog);
