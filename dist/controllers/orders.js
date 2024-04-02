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
exports.getUserOrders = exports.createOrder = void 0;
const connect_1 = __importDefault(require("./prisma/connect"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { items } = req.body;
    try {
        const userId = req.user.userId;
        // Validate request body
        if (!userId || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'User ID and at least one item are required' });
        }
        // Initialize transaction
        yield connect_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            // Calculate total price and validate items
            let totalPrice = 0;
            for (const item of items) {
                const { id, quantity } = item;
                const groceryItem = yield prisma.groceryItem.findUnique({ where: { id } });
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
            const order = yield prisma.order.create({
                data: {
                    userId,
                    totalPrice,
                    orderItems: {
                        createMany: {
                            data: items.map(item => ({
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
            for (const item of items) {
                yield prisma.groceryItem.update({
                    where: { id: item.id },
                    data: { availableInventory: { decrement: item.quantity } }
                });
            }
            // Return order after successful creation
            return order;
        }));
        res.status(201).json({ message: 'Order created successfully' });
    }
    catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: error.message || 'Failed to create order' });
    }
});
exports.createOrder = createOrder;
// Controller function to fetch orders for a user
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        // Fetch orders for the user
        const orders = yield connect_1.default.order.findMany({
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
    }
    catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Failed to fetch user orders' });
    }
});
exports.getUserOrders = getUserOrders;
