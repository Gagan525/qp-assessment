import express from 'express';
import adminAuth from '../middlewares/adminAuth'
import tokenAuth from '../middlewares/tokenAuth'
import { 
  addGroceryItem, 
  viewGroceryItems, 
  removeGroceryItem, 
  updateGroceryItem, 
  manageInventory 
} from '../controllers/groceryItems';

const groceryRoutes = express.Router();

// Routes for managing grocery items
groceryRoutes.post('/add', tokenAuth, adminAuth,  addGroceryItem);
groceryRoutes.get('/getall', tokenAuth, viewGroceryItems);
groceryRoutes.delete('/delete/:id', tokenAuth, adminAuth, removeGroceryItem);
groceryRoutes.put('/update/:id', tokenAuth, adminAuth, updateGroceryItem);
groceryRoutes.patch('/manage-inventory', tokenAuth, adminAuth, manageInventory);

export default groceryRoutes;
