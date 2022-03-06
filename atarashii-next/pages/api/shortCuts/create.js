import mongoose from "mongoose";
import { mongodbURI } from './../../../config/index';
import userSchema from './../../../databaseSchemas/user';

import { jwtSecret } from "./../../../config/index";
import jwt from 'jsonwebtoken';

// lodash is used to set the value (or add new element) in a nested object
import lodash from 'lodash';

import NextCors from 'nextjs-cors';

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
        if (req.body.name.includes('-')) {
            res.status(400).send({error: 'Shortcut name cannot contain "-"'});
            return;
        }

        // remove the protokol from the url if present
        if (req.body.type === 'link') {
            if (req.body.url.startsWith('http://') || req.body.url.startsWith('https://')) {
                req.body.url = req.body.url.replace('https://', '');
                req.body.url = req.body.url.replace('http://', '');
            }
        }
        // create new element
        const newLinkElem = {
            type: req.body.type,
            name: req.body.name,
            url: (req.body.type === 'link' ? req.body.url : undefined),
            ...req.body.type === 'folder' && { children: [] },
        }

        if (req.body.path !== undefined) {
            const pathArr = req.body.path.split('-');
            let pathString = 'startPageElements';
            let childArr = checkUser.startPageElements;
            // loop over each path element and create a string containeng the path to the "children" array
            console.log(pathArr);
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
            // check if a element with the same name already exists in this array
            if (childArr.some(elem => elem.name === newLinkElem.name)) {
                res.status(409).send({linkCreated: false, error: 'Link already exists'});
                return;
            }
            // add the new element to the array
            childArr.push(newLinkElem);
            lodash.set(checkUser, pathString, childArr);
            checkUser.markModified('startPageElements');
        }

        // just add the new element to the highest level if there is no path
        if (req.body.path === undefined) {
            if (checkUser.startPageElements.some(elem => elem.name === newLinkElem.name)) {
                res.status(409).send({linkCreated: false, error: 'Link already exists'});
                return;
            }
            checkUser.startPageElements.push(newLinkElem);
        };
        await checkUser.save();
        res.status(200).send({linkCreated: true});

    } catch (error) {
        console.log(error);
        res.status(500).send({error: 'Internal Server Error'});
        return;
    }
}