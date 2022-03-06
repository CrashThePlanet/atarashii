import mongoose from "mongoose";
import { mongodbURI } from '../../../config/index';
import userSchema from '../../../databaseSchemas/user';

import { jwtSecret } from "../../../config/index";
import jwt from 'jsonwebtoken';

import NextCors from 'nextjs-cors';

mongoose.connect(mongodbURI, { useNewUrlParser: true });

export default async  function handler(req, res) {
    await NextCors(req, res, {
        methods: ['GET'],
        origin: '*'
    });
    if (req.method !== 'GET') {
        res.status(405).json({
            error: 'Method not allowed'
        });
        return;
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, jwtSecret);
        const checkUser = await userSchema.find({_id: decoded.id});

        if (checkUser[0] === undefined) {
            res.status(404).json({
                error: 'User does not exists'
            });
            return;
        }
        
        res.status(200).json({
            shortCuts: checkUser[0].startPageElements
        });
        return;
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Internal server error'
        });
        return;
    }
}