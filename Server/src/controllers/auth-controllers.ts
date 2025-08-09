import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { Queue } from 'bullmq';
import { QueueConnection } from '../connection';
import { addLoginJob } from "../producers/userTasks.producer";


const prisma = new PrismaClient();

export const register = async (req: any, res: any) => {
    try {
        const { name, email, password } = req.body;

        // 1️⃣ Check if username or email already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: { equals: email, mode: 'insensitive' } },
                    { name: { equals: name, mode: 'insensitive' } }
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


export const loginUser = async (req: any, res: any) => {

    try {
        console.log("login requested")
        const { email, password, rememberMe } = req.body

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            console.log("user not found")
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            console.log("pass not valid")
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const accessToken = jwt.sign(
            { ...userData },
            process.env.JWT_SECRET,
            { expiresIn: '30min' }
        );
       addLoginJob(userData.id)
        res.status(200).json({
            success: true,
            message: "Login Successful",
            userData,
            token: accessToken
        })

    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during login",
            error,
        });
    }
}