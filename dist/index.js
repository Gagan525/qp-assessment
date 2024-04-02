"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./routes/users"));
const groceryItems_1 = __importDefault(require("./routes/groceryItems"));
const orders_1 = __importDefault(require("./routes/orders"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
// import morgan from 'morgan';
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '1mb' }));
// app.use(helmet());
// app.use(morgan("common"));
app.use("/api/users", users_1.default);
app.use("/api/grocery-items", groceryItems_1.default);
app.use("/api/order", orders_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
});
