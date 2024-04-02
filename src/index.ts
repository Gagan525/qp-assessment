import express from 'express';
import usersRoutes from './routes/users';
import groceryRoutes from './routes/groceryItems';
import orderRoutes from './routes/orders';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from "cors";
// import morgan from 'morgan';

dotenv.config();

const app = express();
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());



app.use(express.json({ limit: '1mb' }));
// app.use(helmet());
// app.use(morgan("common"));
app.use("/api/users", usersRoutes); 
app.use("/api/grocery-items", groceryRoutes); 
app.use("/api/order", orderRoutes); 
const PORT = process.env.PORT || 3000;

app.listen( PORT , () => {
    console.log(`Running on PORT ${PORT}`);
})