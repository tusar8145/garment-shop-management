import express from "express";
import { auth } from "../middleware/Auth.js";
import * as PurchaseController from "../controllers/PurchaseController.js";  //*1
const router = express.Router();

router.post("/purchase/create", auth,  PurchaseController.purchase_create);
router.post("/purchase/list", auth,  PurchaseController.purchase_list);
router.post("/purchase/count", auth,  PurchaseController.purchase_count);
router.post("/purchase/delete", auth,  PurchaseController.purchase_delete);
router.post("/purchase/status/update", auth,  PurchaseController.purchase_status_update);



export { router as PurchaseRoute };  



 