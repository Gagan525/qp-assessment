"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.manageInventory = exports.updateGroceryItem = exports.removeGroceryItem = exports.viewGroceryItems = exports.addGroceryItem = void 0;
const connect_1 = __importDefault(require("./prisma/connect"));
// const prisma = new PrismaClient();
// Add new grocery item
const addGroceryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, availableInventory } = req.body;
    try {
        // Validate request body
        if (!name || !price || !availableInventory) {
            return res.status(400).json({ message: 'Name, price, and inventory are required' });
        }
        // Create new grocery item
        const groceryItem = yield connect_1.default.groceryItem.create({
            data: {
                name,
                price,
                availableInventory
            }
        });
        res.status(201).json({ message: 'Grocery item added successfully', groceryItem });
    }
    catch (error) {
        console.error('Error adding grocery item:', error);
        res.status(500).json({ message: 'Failed to add grocery item' });
    }
});
exports.addGroceryItem = addGroceryItem;
// View existing grocery items
const viewGroceryItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groceryItems = yield connect_1.default.groceryItem.findMany();
        res.json({ groceryItems });
    }
    catch (error) {
        console.error('Error viewing grocery items:', error);
        res.status(500).json({ message: 'Failed to view grocery items' });
    }
});
exports.viewGroceryItems = viewGroceryItems;
// Remove grocery item
const removeGroceryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Delete grocery item
        yield connect_1.default.groceryItem.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json({ message: 'Grocery item removed successfully' });
    }
    catch (error) {
        console.error('Error removing grocery item:', error);
        res.status(500).json({ message: 'Failed to remove grocery item' });
    }
});
exports.removeGroceryItem = removeGroceryItem;
// Update grocery item
const updateGroceryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, price, availableInventory } = req.body;
    try {
        // Validate request body
        if (!name && !price && !availableInventory) {
            return res.status(400).json({ message: 'At least one field to update is required' });
        }
        // Update grocery item
        const updatedGroceryItem = yield connect_1.default.groceryItem.update({
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
    }
    catch (error) {
        console.error('Error updating grocery item:', error);
        res.status(500).json({ message: 'Failed to update grocery item' });
    }
});
exports.updateGroceryItem = updateGroceryItem;
// Manage inventory levels of grocery items
const manageInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, quantity } = req.body;
    try {
        // Validate request body
        if (!id || !quantity) {
            return res.status(400).json({ message: 'Grocery item ID and quantity are required' });
        }
        // Update inventory level
        const updatedGroceryItem = yield connect_1.default.groceryItem.update({
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
    }
    catch (error) {
        console.error('Error managing inventory:', error);
        res.status(500).json({ message: 'Failed to manage inventory' });
    }
});
exports.manageInventory = manageInventory;
