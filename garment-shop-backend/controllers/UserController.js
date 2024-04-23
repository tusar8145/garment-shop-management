import { PrismaClient } from '@prisma/client';

import { user_id } from '../middleware/Auth.js';
import { rand } from '../helpers/RandomHash.js';
import { currentTimeValue } from '../helpers/Timer.js';
const prisma = new PrismaClient();
import { created_at } from '../helpers/Timer.js';
import { create_msg_formate,update_msg_formate,list_common } from '../helpers/Common.js';
import jwt from "jsonwebtoken";
import md5 from "md5";

export const login = async (req, res, next) => {
    try {
        const req_data = req.body

        const email = req.body.email;
        const password = req.body.password;

        if (!email.length > 2 && !password.length > 2) {
            res.status(401).json({
                success: false,
                message: "unauthorize",
            });
        }

        var admins = null;
        admins = await prisma.admins.findMany({
            where: {
                email: email,
                password: md5(password),
            },
        });

        if (Object.keys(admins).length > 0) {
            const authorization = jwt.sign(
                { id: admins[0].id, email: email, password: password },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_VALIDITY }
            );

            res.status(200).json({
                success: true,
                getadmin: admins,
                authorization: authorization
            });
        } else {
            res.status(404).json({
                success: false,
                getadmin: admins,
            });
        }
    } catch (error) {
        next(error)
    }
};


export const registration = async (req, res, next) => {
    try {
        const { name, password, email, phone, role } = req.body;

        // Check if the email is already in use
        const existingadmin = await prisma.admins.findUnique({
            where: {
                email: email,
            },
        });

        if (existingadmin) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        // Hash the password
        // Save the admin to the database
        const addadmin = await prisma.admins.create({
            data: {
                name: name,
                email: email,
                phone: phone,
                role: role,
                password: md5(password),
            },
        });

        // Create a JWT token
        const authorization = jwt.sign({ id: addadmin.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_VALIDITY });

        return res.status(200).json({
            success: true,
            message: "admin created successfully!",
            authorization: authorization,
            id: addadmin.id,
        });


    } catch (error) {
        next(error)
    }
}; 



//supplier
export const supplier_create =  async (req, res, next) => {
    try {   

        const createMany = await prisma.suppliers.createMany({
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


export const supplier_update =  async (req, res, next) => {
    try {   

        let id = req.body.id
        let data = req.body
        Reflect.deleteProperty(data, 'id');  
 
        const createMany = await prisma.suppliers.update({
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

export const supplier_list =  async (req, res, next) => {
    try {   

        const findMany = await prisma.suppliers.findMany({

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

export const supplier_count =  async (req, res, next) => {
    try {   

        const count = await prisma.suppliers.count({})

        return res.status(200).json({
            data:count,
        });

    }catch(error){
        next(error)
    }
}; 

   
export const supplier_delete =  async (req, res, next) => {
    try {   

        let deleteMany= await prisma.suppliers.deleteMany({
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







//customer
export const customer_create =  async (req, res, next) => {
    try {   

        const createMany = await prisma.customers.createMany({
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


export const customer_update =  async (req, res, next) => {
    try {   

        let id = req.body.id
        let data = req.body
        Reflect.deleteProperty(data, 'id');  
 
        const createMany = await prisma.customers.update({
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

export const customer_list =  async (req, res, next) => {
    try {   

        const findMany = await prisma.customers.findMany({

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

export const customer_count =  async (req, res, next) => {
    try {   

        const count = await prisma.customers.count({})

        return res.status(200).json({
            data:count,
        });

    }catch(error){
        next(error)
    }
}; 

   
export const customer_delete =  async (req, res, next) => {
    try {   

        let deleteMany= await prisma.customers.deleteMany({
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