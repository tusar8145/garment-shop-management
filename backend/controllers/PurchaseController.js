import { PrismaClient } from '@prisma/client';

import { user_id } from '../middleware/Auth.js';
import { rand } from '../helpers/RandomHash.js';
import { currentTimeValue } from '../helpers/Timer.js';
const prisma = new PrismaClient();
import { created_at } from '../helpers/Timer.js';
import { create_msg_formate,update_msg_formate,list_common } from '../helpers/Common.js';
import jwt from "jsonwebtoken";
import md5 from "md5";
 

//purchase
export const purchase_create =  async (req, res, next) => {
    try {   
        let delivery_status=req.body.delivery_status;
        let payment_status=req.body.payment_status;
        let date=req.body.date;
        let purchase_details=req.body.purchase_details;
        let supplier_id=req.body.supplier_id
        let grand_total=0

        let purchase_collection=[]

        for(let k=0; k<purchase_details.length; k++){
            let this_gar=purchase_details[k].garment_id

            let get_garment = await prisma.garments.findUnique({
                where: {
                  id:this_gar,
                },
            })
            
            grand_total=grand_total+(get_garment.purchase_price*purchase_details[k].quantity)

            purchase_collection.push({
                ...purchase_details[k],
                price:get_garment.purchase_price
            })

            //+stock
            const updateGar = await prisma.garments.update({
                where: {
                  id: this_gar,
                },
                data: {
                  stock: (get_garment.stock+purchase_details[k].quantity),
                },
            })
        }

        const createMany = await prisma.purchases.create({
            data: {
             
                delivery_status:delivery_status,
                payment_status:payment_status,
                date:date,
                grand_total:grand_total,
                created_by:user_id,
                supplier_id:supplier_id,

                purchase_detail_purchases: {
                    createMany:{
                        data:purchase_collection,
                    } 
                },
            },
        })


        return res.status(200).json({
                ...create_msg_formate(JSON.stringify(createMany))
        });

    }catch(error){
        next(error)
    }
}; 

 
export const purchase_list =  async (req, res, next) => {
    try {   

        const findMany = await prisma.purchases.findMany({

            ...list_common(req),

            where: {  
                AND: [
                    {
                      ...(req.body.id > 0 ? { id: req.body.id } : {}),
                    }
                  ]
            },
            include:{
                purchase_detail_purchases:{
                    select:{
                        garments:{select:{
                            name:true,
                            sku:true,
                            stock:true,
                            description:true,
                            size:true,
                            color:true,
                            unit_price:true,
                            purchase_price:true,
                            discount:true,
                            categories:{select:{name:true}},
                            brands:{select:{name:true}},
                        },},
                        price:true,
                        quantity:true
                    }
                },
                suppliers:{select:{name:true}},
                admins:{select:{name:true}}
            }
        })

        return res.status(200).json({
            data:findMany,
        });

    }catch(error){
        next(error)
    }
}; 

export const purchase_count =  async (req, res, next) => {
    try {   

        const count = await prisma.purchases.count({})

        return res.status(200).json({
            data:count,
        });

    }catch(error){
        next(error)
    }
}; 

   
export const purchase_delete =  async (req, res, next) => {
    try {   

        //get        
        const purchase_details = await prisma.purchase_details.findMany({
            where: {  
                AND: [
                    {
                      ...(req.body.id > 0 ? { purchase_id: req.body.id } : {}),
                    }
                  ]
            }
        })

        //-stock
        for(let k=0; k<purchase_details.length; k++){
            let this_gar=purchase_details[k].garment_id

            let get_garment = await prisma.garments.findUnique({
                where: {
                  id:this_gar,
                },
            })

            const updateGar = await prisma.garments.update({
                where: {
                  id: this_gar,
                },
                data: {
                  stock: (get_garment.stock-purchase_details[k].quantity),
                },
            })
        }


        let deleteMany1 = await prisma.purchase_details.deleteMany({
            where: {
                purchase_id:  parseInt(req.body.id)   
        }})

        let deleteMany2 = await prisma.purchases.deleteMany({
            where: {
                id:  parseInt(req.body.id)   
        }})

        return res.status(200).json({
            data:deleteMany2,
        });

    }catch(error){
        next(error)
    }
}; 


export const purchase_status_update =  async (req, res, next) => {
    try {   

        let id = req.body.id
        let data = req.body
        Reflect.deleteProperty(data, 'id');  
 
        const updateMany = await prisma.purchases.update({
            where: {
                id:  parseInt(id)   
            },
            data: {
                ...(data.delivery_status ? { delivery_status: data.delivery_status } : {}),
                ...(data.payment_status ? { payment_status: data.payment_status } : {}),
               },
        })

        return res.status(200).json({
                ...update_msg_formate(JSON.stringify(updateMany))
        });

    }catch(error){
        next(error)
    }
}; 




 