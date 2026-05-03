// db.ts
import type { CartItem } from '@/store/cartSlice';
import { openDB } from 'idb';
import { toast } from 'sonner';

export const dbPromise = openDB('Exora', 1, {
    upgrade(db) {
        // Create a store (like a table)
        if (!db.objectStoreNames.contains('cart')) {
            db.createObjectStore("cart", { keyPath: "courseId" });
        }
    },
});

export async function addCartItemToDb(item: CartItem) {
    const db = await dbPromise;
    console.log("index db : ", db)
    toast.success('Course added to cart',{style:{justifyContent:'center'},duration:1000})
    return db.add('cart', item);
}

export async function getCartItemsFromIDB() {
    const db = await dbPromise;
    return db.getAll('cart');
}

export async function deleteCartItemFromIDB(courseId: string) {
    const db = await dbPromise;
    toast.success('Course deleted from cart')
    return db.delete('cart', courseId);
}


export async function editCartItemStatusInIDB(courseId: string, newStatus: "ACTIVE" | "SAVED_LATER") {
    console.log("id : ", courseId)
    console.log("status:", newStatus)
    const db = await dbPromise;

    // 1. Get the existing item by key
    const existingItem = await db.get("cart", courseId); // "cart" is the store name

    if (!existingItem) {
        throw new Error(`Cart item with id ${courseId} not found`);
    }

    // 2. Update its status
    const updatedItem = { ...existingItem, status: newStatus };

    // 3. Put it back into IndexedDB
    await db.put("cart", updatedItem);

    return updatedItem;
}

// export async function saveCourseToIDB() {
//     const db = await dbPromise
    
// }