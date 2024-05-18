import { PrismaClient } from '@prisma/client';

import { user_id } from '../middleware/Auth.js';
import { rand } from '../helpers/RandomHash.js';
import { currentTimeValue } from '../helpers/Timer.js';
const prisma = new PrismaClient();
import { created_at } from '../helpers/Timer.js';
import { create_msg_formate,update_msg_formate,list_common } from '../helpers/Common.js';
import jwt from "jsonwebtoken";
import md5 from "md5";


//garment
export const garment_create =  async (req, res, next) => {
    try {   

        const createMany = await prisma.garments.createMany({
            data: {...req.body,created_by:user_id},
            skipDuplicates: true,
        })

        return res.status(200).json({
                ...create_msg_formate(JSON.stringify(createMany))
        });

    }catch(error){
        next(error)
    }
}; 


export const garment_update =  async (req, res, next) => {
    try {   

        let id = req.body.id
        let data = req.body
        Reflect.deleteProperty(data, 'id');  
 
        const createMany = await prisma.garments.update({
            where: {
                id:  parseInt(id)   
            },
            data: {...data},
        })

        return res.status(200).json({
                ...update_msg_formate(JSON.stringify(createMany))
        });

    }catch(error){
        next(error)
    }
}; 

export const garment_list =  async (req, res, next) => {
    try {   

        const findMany = await prisma.garments.findMany({

            ...list_common(req),

            where: {  
                AND: [
                    {
                      ...(req.body.id > 0 ? { id: req.body.id } : {}),
                    }
                  ]
            },
            include:{
                categories:true,
                brands:true
            }
        })

        return res.status(200).json({
            data:findMany,
        });

    }catch(error){
        next(error)
    }
}; 

export const garment_count =  async (req, res, next) => {
    try {   

        const count = await prisma.garments.count({})

        return res.status(200).json({
            data:count,
        });

    }catch(error){
        next(error)
    }
}; 

   
export const garment_delete =  async (req, res, next) => {
    try {   

        const delete_ = await prisma.garments.delete({
            where: {
                "id":parseInt(req.body.id)
            },
          })

        return res.status(200).json({
            data:delete_,
        });

    }catch(error){
        next(error)
    }
}; 







//category
export const category_create =  async (req, res, next) => {
    try {   

        const createMany = await prisma.categories.createMany({
            data: {...req.body},
            skipDuplicates: true,
        })

        return res.status(200).json({
                ...create_msg_formate(JSON.stringify(createMany))
        });

    }catch(error){
        next(error)
    }
}; 


export const category_update =  async (req, res, next) => {
    try {   

        let id = req.body.id
        let data = req.body
        Reflect.deleteProperty(data, 'id');  
 
        const createMany = await prisma.categories.update({
            where: {
                id:  parseInt(id)   
            },
            data: {...data},
        })

        return res.status(200).json({
                ...update_msg_formate(JSON.stringify(createMany))
        });

    }catch(error){
        next(error)
    }
}; 

export const category_list =  async (req, res, next) => {
    try {   

        const findMany = await prisma.categories.findMany({

            ...list_common(req),

            where: {  
                AND: [
                    {
                      ...(req.body.id > 0 ? { id: req.body.id } : {}),
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

export const category_count =  async (req, res, next) => {
    try {   

        const count = await prisma.categories.count({})

        return res.status(200).json({
            data:count,
        });

    }catch(error){
        next(error)
    }
}; 

   
export const category_delete =  async (req, res, next) => {
    try {   

        let deleteMany=await prisma.categories.delete({
            where: {
                id:  parseInt(req.body.id)   
            }})

        return res.status(200).json({
            data:deleteMany,
        });

    }catch(error){
        next(error)
    }
}; 




//brand
export const brand_create =  async (req, res, next) => {
    try {   

        const createMany = await prisma.brands.createMany({
            data: {...req.body},
            skipDuplicates: true,
        })

        return res.status(200).json({
                ...create_msg_formate(JSON.stringify(createMany))
        });

    }catch(error){
        next(error)
    }
}; 


export const brand_update =  async (req, res, next) => {
    try {   

        let id = req.body.id
        let data = req.body
        Reflect.deleteProperty(data, 'id');  
 
        const createMany = await prisma.brands.update({
            where: {
                id:  parseInt(id)   
            },
            data: {...data},
        })

        return res.status(200).json({
                ...update_msg_formate(JSON.stringify(createMany))
        });

    }catch(error){
        next(error)
    }
}; 

export const brand_list =  async (req, res, next) => {
    try {   

        const findMany = await prisma.brands.findMany({

            ...list_common(req),

            where: {  
                AND: [
                    {
                      ...(req.body.id > 0 ? { id: req.body.id } : {}),
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

export const brand_count =  async (req, res, next) => {
    try {   

        const count = await prisma.brands.count({})

        return res.status(200).json({
            data:count,
        });

    }catch(error){
        next(error)
    }
}; 

   
export const brand_delete =  async (req, res, next) => {
    try {   

        let deleteMany=await prisma.brands.deleteMany({
            where: {
                id:  parseInt(req.body.id)   
            }})

        return res.status(200).json({
            data:deleteMany,
        });

    }catch(error){
        next(error)
    }
}; 