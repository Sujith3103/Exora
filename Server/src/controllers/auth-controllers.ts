import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const register = async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: email, mode: 'insensitive' }  },
          { name: {equals: name, mode:'insensitive'} }
        ]
      }
    });

    if (existingUser) {
        console.log("user already exists")
      return res.status(400).json({
        success: false,
        message: "Username or email already exists"
      });
    }

    // 2️⃣ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    // 3️⃣ Create the user
    const userData = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    console.log("User created: ", userData);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt
      }
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create the user",
      error: err
    });
  }
};
