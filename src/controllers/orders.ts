import { Request, Response } from "express";
import prisma from "./prisma/connect";
import { OrderItem } from "../interfaces/orderItem";


export const createOrder = async (req: Request, res: Response) => {
  const { items } = req.body;

  try {
      const userId = (req as any).user.userId as string;
      // Validate request body
      if (!userId || !items || !Array.isArray(items) || items.length === 0) {
          return res.status(400).json({ message: 'User ID and at least one item are required' });
      }

      // Initialize transaction
      await prisma.$transaction(async (prisma: any) => {
          // Calculate total price and validate items
          let totalPrice = 0;
          for (const item of items as OrderItem[]) {
              const { id, quantity } = item;
              const groceryItem = await prisma.groceryItem.findUnique({ where: { id } });
              if (!groceryItem) {
                  throw new Error(`Grocery item with ID ${id} not found`);
              }
              if (groceryItem.availableInventory < quantity) {
                  throw new Error(`Insufficient inventory for grocery item with ID ${id}`);
              }
              totalPrice += groceryItem.price * quantity;
              item.price = groceryItem.price;
          }

          // Create new order
          const order = await prisma.order.create({
              data: {
                  userId,
                  totalPrice,
                  orderItems: {
                      createMany: {
                          data: items.map((item: OrderItem) => ({
                              groceryItemId: item.id,
                              quantity: item.quantity,
                              subtotal: item.quantity * item.price // Assuming price is fetched from the database
                          }))
                      }
                  }
              },
              include: {
                  orderItems: true
              }
          });

          // Decrease inventory for each grocery item
          for (const item of items as OrderItem[]) {
              await prisma.groceryItem.update({
                  where: { id: item.id },
                  data: { availableInventory: { decrement: item.quantity } }
              });
          }

          // Return order after successful creation
          return order;
      });

      res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Failed to create order' });
  }
};

  
  // Controller function to fetch orders for a user
  export const getUserOrders = async (req: Request, res: Response) => {
    const { userId } = req.params;
  
    try {
      // Fetch orders for the user
      const orders = await prisma.order.findMany({
        where: {
          userId
        },
        include: {
          orderItems: {
            include: {
              groceryItem: true
            }
          }
        }
      });
  
      res.json({ orders });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ message: 'Failed to fetch user orders' });
    }
  };