import mongoose from "mongoose";
import { mongodbURI } from './../../../config/index';
import userSchema from './../../../databaseSchemas/user';

import { jwtSecret } from "./../../../config/index";
import jwt from 'jsonwebtoken';

// lodash is used to set the value (or add element) in a nested object
import lodash from 'lodash';

mongoose.connect(mongodbURI, { useNewUrlParser: true });

export default async  function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({error: 'Method Not Allowed'});
        return;
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, jwtSecret);
        const checkUser = await userSchema.findById(decoded.id);

        if (checkUser === undefined) {
            res.status(404).json({
                error: 'User does not exists'
            });
            return;
        }
        if (req.body.path !== undefined) {
            const pathArr = req.body.path.split('-');
            let pathString = 'startPageElements';
            let childArr = checkUser.startPageElements;
            // loop over each path element and create a string containeng the path to the "children" array
            for (const pathPart of pathArr) {
                if (childArr === undefined) {
                    res.status(404).json({
                        error: 'Path does not exists'
                    });
                    return;
                }
                const pathElem = childArr.find(elem => elem.name === pathPart);
                if (pathElem === undefined) {
                    res.status(404).json({
                        error: 'Path does not exists'
                    });
                    return;
                }
                const index = childArr.indexOf(pathElem);

                pathString += '[' + index + '].children';
                childArr = pathElem.children;
            }
            let elemIndex = childArr.findIndex(elem => elem.name === req.body.shortcutName);
            childArr.splice(elemIndex, 1);
            lodash.set(checkUser, pathString, childArr);
            checkUser.markModified('startPageElements');
        }

        // just add the new element to the highest level if there is no path
        if (req.body.path === undefined) {
            let elemIndex = checkUser.startPageElements.findIndex(elem => elem.name === req.body.shortcutName);
            checkUser.startPageElements.splice(elemIndex, 1);
        }
        await checkUser.save();
        res.status(200).send({linkRemoved: true});

    } catch (error) {
        console.log(error);
        res.status(500).send({error: 'Internal Server Error'});
        return;
    }
}