import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "./prisma/connect";
import bcrypt from "bcryptjs";
import jwt, { Secret } from 'jsonwebtoken';

export function getUsers(req: Request, res: Response) {
    res.status(200).send([]);
}

// Generate JWT token
const generateToken = (userId: string, email: string, isAdmin: boolean): string => {
const secret = process.env.SECRET;
if (!secret) {
    throw new Error('Secret is not defined');
}
// return jwt.sign({ userId }, secret as Secret, { expiresIn: '1h' });
return jwt.sign({ userId, email, isAdmin}, secret as Secret);
};

export const signUp = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

  // Check if the email is already in use
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    const token = generateToken(newUser.id, newUser.email, newUser.isAdmin);

    res.status(201).json({ message: 'User registered successfully', user: newUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to register user'});
  }
}

export const login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      // Validate request body
      if (!email || !password) {
        return res.status(500).json({ message: 'Email and password are required' });
      }
  
      // Find user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Generate JWT token
      const token = generateToken(user.id, user.email, user.isAdmin);
  
      // Respond with token
      res.status(200).json({ token , message: "Logged in successfully"});
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'An error occurred during login'});
    }
  };
  