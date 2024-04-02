import express, { Request, Response } from 'express';
import prisma from "./prisma/connect";

// const prisma = new PrismaClient();

// Add new grocery item
export const addGroceryItem = async (req: Request, res: Response) => {
  const { name, price, availableInventory } = req.body;

  try {
    // Validate request body
    if (!name || !price || !availableInventory) {
      return res.status(400).json({ message: 'Name, price, and inventory are required' });
    }

    // Create new grocery item
    const groceryItem = await prisma.groceryItem.create({
      data: {
        name,
        price,
        availableInventory
      }
    });

    res.status(201).json({ message: 'Grocery item added successfully', groceryItem });
  } catch (error: any) {
    console.error('Error adding grocery item:', error);
    res.status(500).json({ message: 'Failed to add grocery item' });
  }
};

// View existing grocery items
export const viewGroceryItems = async (req: Request, res: Response) => {
  try {
    const groceryItems = await prisma.groceryItem.findMany();
    res.json({ groceryItems });
  } catch (error: any) {
    console.error('Error viewing grocery items:', error);
    res.status(500).json({ message: 'Failed to view grocery items' });
  }
};

// Remove grocery item
export const removeGroceryItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Delete grocery item
    await prisma.groceryItem.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.json({ message: 'Grocery item removed successfully' });
  } catch (error: any) {
    console.error('Error removing grocery item:', error);
    res.status(500).json({ message: 'Failed to remove grocery item' });
  }
};

// Update grocery item
export const updateGroceryItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, availableInventory } = req.body;

  try {
    // Validate request body
    if (!name && !price && !availableInventory) {
      return res.status(400).json({ message: 'At least one field to update is required' });
    }

    // Update grocery item
    const updatedGroceryItem = await prisma.groceryItem.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name,
        price,
        availableInventory
      }
    });

    res.json({ message: 'Grocery item updated successfully', updatedGroceryItem });
  } catch (error:any) {
    console.error('Error updating grocery item:', error);
    res.status(500).json({ message: 'Failed to update grocery item' });
  }
};

// Manage inventory levels of grocery items
export const manageInventory = async (req: Request, res: Response) => {
  const { id, quantity } = req.body;

  try {
    // Validate request body
    if (!id || !quantity) {
      return res.status(400).json({ message: 'Grocery item ID and quantity are required' });
    }

    // Update inventory level
    const updatedGroceryItem = await prisma.groceryItem.update({
      where: {
        id: parseInt(id)
      },
      data: {
        availableInventory: {
          increment: parseInt(quantity)
        }
      }
    });

    res.json({ message: 'Inventory updated successfully', updatedGroceryItem });
  } catch (error:any) {
    console.error('Error managing inventory:', error);
    res.status(500).json({ message: 'Failed to manage inventory'});
  }
};
