import express from "express";
import { auth } from "../middleware/Auth.js";
import * as GarmentController from "../controllers/GarmentController.js";   
const router = express.Router();

  
router.post("/garment/create", auth,  GarmentController.garment_create);
router.post("/garment/update", auth,  GarmentController.garment_update);
router.post("/garment/list", auth,  GarmentController.garment_list);
router.post("/garment/count", auth,  GarmentController.garment_count);
router.post("/garment/delete", auth,  GarmentController.garment_delete);

router.post("/category/create", auth,  GarmentController.category_create);
router.post("/category/update", auth,  GarmentController.category_update);
router.post("/category/list", auth,  GarmentController.category_list);
router.post("/category/count", auth,  GarmentController.category_count);
router.post("/category/delete", auth,  GarmentController.category_delete);


router.post("/brand/create", auth,  GarmentController.brand_create);
router.post("/brand/update", auth,  GarmentController.brand_update);
router.post("/brand/list", auth,  GarmentController.brand_list);
router.post("/brand/count", auth,  GarmentController.brand_count);
router.post("/brand/delete", auth,  GarmentController.brand_delete);

export { router as GarmentRoute };  



 
