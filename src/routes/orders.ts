import { Router } from "express";
import { createOrder, getUserOrders } from "../controllers/orders";
import verifyToken from "../middlewares/tokenAuth";
import adminAuth from "../middlewares/adminAuth";

const orderRoutes = Router();

//api/order/
orderRoutes.post("/place-order",verifyToken, createOrder); 
orderRoutes.get("/:userId",verifyToken,adminAuth, getUserOrders); 
// orderRoutes.post("/signup", signUp); 
// orderRoutes.post("/login", login); 

export default orderRoutes;