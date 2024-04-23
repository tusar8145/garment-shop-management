import { PrismaClient } from '@prisma/client';

import { user_id } from '../middleware/Auth.js';
import { rand } from '../helpers/RandomHash.js';
import { currentTimeValue } from '../helpers/Timer.js';
const prisma = new PrismaClient();
import { created_at } from '../helpers/Timer.js';
import { create_msg_formate,update_msg_formate,list_common } from '../helpers/Common.js';
import jwt from "jsonwebtoken";
import md5 from "md5";
import {Parser} from "json2csv";

//rating
export const rating_create =  async (req, res, next) => {
    try {   
        let data={
                garment_id:parseInt(req.query.garment_id),
                order_id:parseInt(req.query.order_id),
                customer_id:parseInt(req.query.customer_id),
                rating:parseInt(req.query.rating),
                review:req.query.review
            }

        console.log(req)

        let get_customer = await prisma.orders.findUnique({
            where: {
              id:data.order_id,
            },
        })

        let obj={
            customer_id: get_customer.customer_id,
            garment_id: data.garment_id,
            order_id: data.order_id,
        }

        //find duplicate
        const findDuplicate = await prisma.ratings.findMany({
            where: {  
                AND: [
                    obj
                ]
            }
        })

        if(findDuplicate.length>0){
            return res.status(200).json({
                success:false, message:'Duplicate rating not allowed!'
            });
        }


        if(data.rating>5 || data.rating<0){
            return res.status(200).json({
                success:false, message:'Invalid Rating! (0=< r <=5)'
            });
        }



        const createMany = await prisma.ratings.createMany({
            data: {...obj, customer_id:get_customer.customer_id, rating:data.rating},
            skipDuplicates: true,
        })
        delete obj.customer_id;
        const update_order_details = await prisma.order_details.updateMany({
            where: {
                ...obj
            },
            data: {
                review:data.review
            },
        })


        return res.status(200).json({
                ...create_msg_formate(JSON.stringify(createMany))
        });

    }catch(error){
        next(error)
    }
}; 

 
export const rating_list =  async (req, res, next) => {
    try {   

        const findMany = await prisma.ratings.findMany({

            ...list_common(req),

            where: {  
                AND: [
                    {
                      ...(req.body.customer_id > 0 ? { customer_id: req.body.customer_id } : {}),
                      ...(req.body.garment_id > 0 ? { garment_id: req.body.garment_id } : {}),
                      ...(req.body.order_id > 0 ? { order_id: req.body.order_id } : {}),
                    }
                  ]
            },
        })

        return res.status(200).json({
            data:findMany,
        });

    }catch(error){
        next(error)
    }
}; 

 
export const rating_data =  async (req, res, next) => {
    try {   

        const findMany = await prisma.ratings.findMany({
            ...list_common(req),
        })

        return res.status(200).json(
            findMany,
        );

    }catch(error){
        next(error)
    }
}; 

 
export const rating_garment_data =  async (req, res, next) => {
    try {   

        const findMany = await prisma.garments.findMany({
            ...list_common(req),
            select:{
                id:true,
                name:true,
                sku:true
            }
        })

        return res.status(200).json(
            findMany,
        );

    }catch(error){
        next(error)
    }
}; 






export const rating_count =  async (req, res, next) => {
    try {   

        const count = await prisma.ratings.count({})

        return res.status(200).json({
            data:count,
        });

    }catch(error){
        next(error)
    }
}; 

   