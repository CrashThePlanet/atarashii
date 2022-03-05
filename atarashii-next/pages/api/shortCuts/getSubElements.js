import mongoose from "mongoose";
import { mongodbURI } from './../../../config/index';
import userSchema from './../../../databaseSchemas/user';

import { jwtSecret } from "./../../../config/index";
import jwt from 'jsonwebtoken';

mongoose.connect(mongodbURI, { useNewUrlParser: true });

export default async  function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({error: 'Method Not Allowed'});
        return;
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, jwtSecret);
        const checkUser = await userSchema.find({_id: decoded.id});

        if (checkUser[0] === undefined) {
            res.status(404).send({error: 'User does not exists'});
            return;
        }

        const pathArr = req.body.path.split('-');
        let elemChildren = checkUser[0].startPageElements;
        for (const path of pathArr) {
            if (elemChildren === undefined) {
                res.status(404).send({error: 'Path does not exists'});
                return;
            }
            const pathElem = elemChildren.find(elem => elem.name === path);
            if (pathElem === undefined) {
                res.status(404).send({error: 'Path does not exists'});
                return;
            }
            elemChildren = pathElem.children;
        }
        res.status(200).send({shortCuts: elemChildren});    
    } catch (error) {
        console.log(error);
        res.status(500).send({error: 'Internal Server Error'});
        return;
    }
}