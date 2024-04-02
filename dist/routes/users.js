"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const userRoutes = (0, express_1.Router)();
//api/users/
userRoutes.get("/", users_1.getUsers);
userRoutes.post("/signup", users_1.signUp);
userRoutes.post("/login", users_1.login);
exports.default = userRoutes;
