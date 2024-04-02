"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_1 = require("../controllers/orders");
const tokenAuth_1 = __importDefault(require("../middlewares/tokenAuth"));
const adminAuth_1 = __importDefault(require("../middlewares/adminAuth"));
const orderRoutes = (0, express_1.Router)();
//api/order/
orderRoutes.post("/place-order", tokenAuth_1.default, orders_1.createOrder);
orderRoutes.get("/:userId", tokenAuth_1.default, adminAuth_1.default, orders_1.getUserOrders);
// orderRoutes.post("/signup", signUp); 
// orderRoutes.post("/login", login); 
exports.default = orderRoutes;
