import { Request, response, Response } from "express";
import { prisma } from "../../utils/prisma";


export const getUserCartDetails = async (req: Request, res: Response) => {

    const { userId } = req.params

    try {

        let cart = await prisma.cart.findFirst({
            where: { userId }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
            });
        }

        const items = await prisma.cart.findFirst({
            where: { userId },
            select: { items: true }
        })

        return res.status(200).json({
            success: true,
            message: "fetched cart details",
            data: items?.items
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "failed to fetch cart details"
        })
    }
}

export const AddItemsToCart = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { courseId, price, title, thumbnailUrl, instructorName } = req.body;

    try {
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        // Step 1: find or create cart
        let cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
            });
        }

        // Step 2: check if item already exists in cart (courseId unique per cart)
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_courseId: { cartId: cart.id, courseId }, // because of @@unique([cartId, courseId])
            },
        });

        if (existingItem) {
            return res.status(400).json({ message: "Course already in cart" });
        }

        // Step 3: add new item
        const cartItem = await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                courseId,
                price,
                title,
                thumbnailUrl,
                instructorName,
            },
        });

        res.status(201).json({
            success: true,
            cartItem
        });
    } catch (err) {
        console.error("Error adding to cart:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const removeItemFromCart = async (req: Request, res: Response) => {

    const { itemId } = req.params
    const userId = req.user?.id

    try {

        await prisma.cartItem.delete({
            where: { id: itemId }
        })

        res.status(200).json({
            success: true,
            message: "removed the item from the cart"
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "failed to remove item from cart"
        })
    }
}

export const updateCartItemStatus = async (req: Request, res: Response) => {

    const { itemId } = req.params
    const userId = req.user?.id
    const { status } = req.body

    try {

        const result = await prisma.cartItem.update({
            data: { status },
            where: { id: itemId }
        })

        if (result) {
            return res.status(200).json({
                success: true,
                message: "changed status successfully",
                res: result
            })
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "failed to change status"
        })
    }

}

export const addMultipleItemsToCart = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const itemsToAdd = req.body as Array<{
        courseId: string;
        title: string;
        price: number;
        instructorName: string;
        thumbnailUrl: string;
        status: 'ACTIVE' | 'SAVED_LATER';
        addedAt: number;
    }>;
    console.log("items to add in array : ",itemsToAdd)

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        // 1️⃣ Ensure cart exists
        let cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
        }

        // 2️⃣ Get existing courseIds in cart
        const existingItems = await prisma.cartItem.findMany({
            where: { cartId: cart.id },
            select: { courseId: true },
        });
        const existingCourseIds = new Set(existingItems.map((i) => i.courseId));

        // 3️⃣ Filter out duplicates
        const newItems = itemsToAdd.filter((item) => !existingCourseIds.has(item.courseId));

        // 4️⃣ Add new items
        const createdItems = await prisma.cartItem.createMany({
            data: newItems.map((item) => ({
                cartId: cart!.id,
                courseId: item.courseId,
                title: item.title,
                price: item.price,
                instructorName: item.instructorName,
                thumbnailUrl: item.thumbnailUrl,
                status: item.status,
                addedAt: new Date(item.addedAt),
            })),
            skipDuplicates: true, // just in case
        });

        return res.status(200).json({
            success: true,
            message: `${newItems.length} new item(s) added to cart`,
            data: newItems,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Failed to add items to cart' });
    }
};