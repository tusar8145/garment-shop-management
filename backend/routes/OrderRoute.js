import express from "express";
import { auth } from "../middleware/Auth.js";
import * as OrderController from "../controllers/OrderController.js";   
const router = express.Router();

  
router.post("/order/create", auth,  OrderController.order_create);
router.post("/order/list", auth,  OrderController.order_list);
router.post("/order/count", auth,  OrderController.order_count);
router.post("/order/delete", auth,  OrderController.order_delete);
router.post("/order/status/update", auth,  OrderController.order_status_update);

export { router as OrderRoute };  



 
