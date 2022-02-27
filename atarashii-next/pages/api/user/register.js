import mongoose from "mongoose";
import { mongodbURI } from './../../../config/index';
import userSchema from './../../../databaseSchemas/user';

import bcrypt from 'bcrypt';

mongoose.connect(mongodbURI, { useNewUrlParser: true });

export default async function handler(req, res) {
    if (req.body.email === undefined && req.body.password === undefined) {
        res.status(400).json({
            error: "Missing email or password"
        });
        return;
    }
    if (req.body.email.length < 1 || !req.body.email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.([a-zA-Z0-9-]+)*$/)) {
        res.status(400).json({
            error: "Invalid email"
        });
        return;
    }
    if (req.body.password.length < 1) {
        res.status(400).json({
            error: "Invalid password"
        });
        return;
    }
    try {
        const user = await userSchema.find({eMail: req.body.email});
        console.log(user);       
        if (user[0] !== undefined) {
            res.status(400).json({
                error: "User already exists"
            });
            return;
        }
        const newUser = new userSchema({
            eMail: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        });
        await newUser.save();
        res.status(200).json({
            success: "User created"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server error"
        });
        return;
    }
}