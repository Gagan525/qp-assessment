"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuth_1 = __importDefault(require("../middlewares/adminAuth"));
const tokenAuth_1 = __importDefault(require("../middlewares/tokenAuth"));
const groceryItems_1 = require("../controllers/groceryItems");
const groceryRoutes = express_1.default.Router();
// Routes for managing grocery items
groceryRoutes.post('/add', tokenAuth_1.default, adminAuth_1.default, groceryItems_1.addGroceryItem);
groceryRoutes.get('/getall', tokenAuth_1.default, groceryItems_1.viewGroceryItems);
groceryRoutes.delete('/delete/:id', tokenAuth_1.default, adminAuth_1.default, groceryItems_1.removeGroceryItem);
groceryRoutes.put('/update/:id', tokenAuth_1.default, adminAuth_1.default, groceryItems_1.updateGroceryItem);
groceryRoutes.patch('/manage-inventory', tokenAuth_1.default, adminAuth_1.default, groceryItems_1.manageInventory);
exports.default = groceryRoutes;
