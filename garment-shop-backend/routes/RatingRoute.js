import express from "express";
import { auth } from "../middleware/Auth.js";
import * as RatingController from "../controllers/RatingController.js";   
const router = express.Router();

  
router.get("/public/rating/create", RatingController.rating_create);
router.post("/rating/list", auth,  RatingController.rating_list);
router.post("/rating/count", auth,  RatingController.rating_count);
router.get("/public/rating",  RatingController.rating_data);
router.get("/public/rating-garment",  RatingController.rating_garment_data);

export { router as RatingRoute };  



 
