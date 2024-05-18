import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cluster from  'cluster';
import os from 'os';
import cors from "cors" 


import { UserRoute } from "./routes/UserRoute.js";
import { GarmentRoute } from "./routes/GarmentRoute.js";
import { OrderRoute } from "./routes/OrderRoute.js";
import { PurchaseRoute } from "./routes/PurchaseRoute.js";
import { RatingRoute } from "./routes/RatingRoute.js";

const app = express();
const SYSVERSION = "/api/";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

 

const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))  

app.use(SYSVERSION, UserRoute);
app.use(SYSVERSION, GarmentRoute);
app.use(SYSVERSION, OrderRoute);
app.use(SYSVERSION, PurchaseRoute);
app.use(SYSVERSION, RatingRoute);

app.use((req, res, next) => {
  res.status(404).json({
    message: "404 not found",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});
