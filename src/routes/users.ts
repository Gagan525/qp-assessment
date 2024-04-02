import { Router } from "express";
import { getUsers, login, signUp } from "../controllers/users";

const userRoutes = Router();

//api/users/
userRoutes.get("/", getUsers); 
userRoutes.post("/signup", signUp); 
userRoutes.post("/login", login); 

export default userRoutes;