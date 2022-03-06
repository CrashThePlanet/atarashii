import mongoose from "mongoose";
import { mongodbURI } from './../../../config/index';
import userSchema from './../../../databaseSchemas/user';

import { jwtSecret } from "./../../../config/index";

import NextCors from 'nextjs-cors';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

mongoose.connect(mongodbURI, { useNewUrlParser: true });

export default async function handler(req, res) {

    await NextCors(req, res, {
        methods: ['POST'],
        origin: '*'
    });

    if (req.method !== 'POST') {
        res.status(405).send({error: 'Method Not Allowed'});
        return;
    }

    if (req.body.email === '' || req.body.password === '') {
        res.status(400).json({
            error: 'Invalid email or password'
        });
        return;
    }
    try {
        const checkUser = await userSchema.find({eMail: req.body.email});
        if (checkUser[0] === undefined) {
            res.status(404).json({
                error: 'User does not exists'
            });
            return;
        }
        if (bcrypt.compareSync(req.body.password, checkUser[0].password)) {
            res.status(200).json({
                success: 'Login successful',
                token: jwt.sign({
                    id: checkUser[0]._id,
                    email: checkUser[0].eMail
                }, jwtSecret)
            });
            return;
        } else {
            res.status(400).json({
                error: 'Invalid password'
            });
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Internal server error'
        });
        return;
    }
}