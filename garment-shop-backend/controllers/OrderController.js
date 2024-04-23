import { PrismaClient } from '@prisma/client';

import { user_id } from '../middleware/Auth.js';
import { rand } from '../helpers/RandomHash.js';
import { currentTimeValue } from '../helpers/Timer.js';
const prisma = new PrismaClient();
import { created_at } from '../helpers/Timer.js';
import { create_msg_formate,update_msg_formate,list_common } from '../helpers/Common.js';
import jwt from "jsonwebtoken";
import md5 from "md5";
 

//order
export const order_create =  async (req, res, next) => {
    try {   
        let delivery_status=req.body.delivery_status;
        let payment_status=req.body.payment_status;
        let date=req.body.date;
        let order_details=req.body.order_details;
        let customer_id=req.body.customer_id
        let shipping_address=req.body.shipping_address
        let grand_total=0

        let order_collection=[]

        for(let k=0; k<order_details.length; k++){
            let this_gar=order_details[k].garment_id

            let get_garment = await prisma.garments.findUnique({
                where: {
                  id:this_gar,
                },
            })
            
            grand_total=grand_total+((get_garment.unit_price-get_garment.discount)*order_details[k].quantity)

            order_collection.push({
                ...order_details[k],
                price:get_garment.unit_price-get_garment.discount
            })

            //-stock
            const updateGar = await prisma.garments.update({
                where: {
                  id: this_gar,
                },
                data: {
                  stock: (get_garment.stock-order_details[k].quantity),
                },
            })
        }

        const createMany = await prisma.orders.create({
            data: {
             
                delivery_status:delivery_status,
                payment_status:payment_status,
                date:date,
                grand_total:grand_total,
                created_by:user_id,
                customer_id:customer_id,
                shipping_address:shipping_address,
                
                order_detail_orders: {
                    createMany:{
                        data:order_collection,
                    } 
                },
            },
        })

         

        const order_trackings_create = await prisma.order_trackings.create({
            data: {
                order_id:parseInt(createMany.id),                
                created_by:user_id,                          
                date:created_at(),     
                ...(delivery_status ? { delivery_status: delivery_status } : {}),
                ...(payment_status ? { payment_status: payment_status } : {}),
               },
        })


        return res.status(200).json({
                ...create_msg_formate(JSON.stringify(createMany))
        });

    }catch(error){
        next(error)
    }
}; 

 
export const order_list =  async (req, res, next) => {
    try {   

        const findMany = await prisma.orders.findMany({

            ...list_common(req),

            where: {  
                AND: [
                    {
                      ...(req.body.id > 0 ? { id: req.body.id } : {}),
                    }
                  ]
            },
            include:{
                order_detail_orders:{
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
                customers:{select:{name:true}},
                admins:{select:{name:true}},
                order_tracking_orders:true
            }
        })

        return res.status(200).json({
            data:findMany,
        });

    }catch(error){
        next(error)
    }
}; 

export const order_count =  async (req, res, next) => {
    try {   

        const count = await prisma.orders.count({})

        return res.status(200).json({
            data:count,
        });

    }catch(error){
        next(error)
    }
}; 

   
export const order_delete =  async (req, res, next) => {
    try {   

        //get        
        const order_details = await prisma.order_details.findMany({
            where: {  
                AND: [
                    {
                      ...(req.body.id > 0 ? { order_id: req.body.id } : {}),
                    }
                  ]
            }
        })

        //+stock
        for(let k=0; k<order_details.length; k++){
            let this_gar=order_details[k].garment_id

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
                  stock: (get_garment.stock+order_details[k].quantity),
                },
            })
        }


        let deleteMany1 = await prisma.order_details.deleteMany({
            where: {
                order_id:  parseInt(req.body.id)   
        }})

        let deleteMany2 = await prisma.orders.deleteMany({
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


export const order_status_update =  async (req, res, next) => {
    try {   

        let id = req.body.id
        let data = req.body
        Reflect.deleteProperty(data, 'id');  


        //find duplicate
        const findDuplicate = await prisma.orders.findMany({
            where: {  
                AND: [
                    {
                        id:  parseInt(id),
                        ...(data.delivery_status ? { delivery_status: data.delivery_status } : {}),
                        ...(data.payment_status ? { payment_status: data.payment_status } : {}),  
                    }
                  ]
            }
        })

        if(findDuplicate.length>0){
            return res.status(200).json({
                success:false, message:'Duplicate ststus not allowed!'
        });
        }
 
        const updateMany = await prisma.orders.update({
            where: {
                id:  parseInt(id)   
            },
            data: {
                ...(data.delivery_status ? { delivery_status: data.delivery_status } : {}),
                ...(data.payment_status ? { payment_status: data.payment_status } : {}),
               },
        })

        const create = await prisma.order_trackings.create({
            data: {
                order_id:parseInt(id),                
                created_by:user_id,                          
                date:created_at(),     
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




 