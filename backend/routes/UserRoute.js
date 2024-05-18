import express from "express";
import { auth } from "../middleware/Auth.js";
import * as UserController from "../controllers/UserController.js";  //*1
const router = express.Router();
 
router.post("/admin/registration",   UserController.registration);
router.post("/admin/login",   UserController.login);

router.post("/supplier/create", auth,  UserController.supplier_create);
router.post("/supplier/update", auth,  UserController.supplier_update);
router.post("/supplier/list", auth,  UserController.supplier_list);
router.post("/supplier/count", auth,  UserController.supplier_count);
router.post("/supplier/delete", auth,  UserController.supplier_delete);

router.post("/customer/create", auth,  UserController.customer_create);
router.post("/customer/update", auth,  UserController.customer_update);
router.post("/customer/list", auth,  UserController.customer_list);
router.post("/customer/count", auth,  UserController.customer_count);
router.post("/customer/delete", auth,  UserController.customer_delete);

export { router as UserRoute };  



 