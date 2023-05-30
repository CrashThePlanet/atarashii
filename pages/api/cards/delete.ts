import { NextApiRequest, NextApiResponse } from "next";

import path from 'path';
const fs = require('fs');

export default function(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method !== 'POST') {
            res.status(405).end();
            return;
        }
        const body = JSON.parse(req.body)
        if (typeof body.cardName !== 'string') {
            res.status(400).send({msg: 'Missing Card name'});
            return;
        }
        // get data (cards) from json file
        const filePath = path.join(process.cwd(), 'storage') + '/cards.json';
        let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // deletes by name

        if (body.path === undefined) {
            const i = data.cards.indexOf(data.cards.find((elem: any) => elem.name === body.cardName && elem.type === body.type))
            if (i < 0) {
                res.status(404).send({msg: 'Card not found'});
                return;
            }
            data.cards.splice(i, 1);
        } else {
            // the actual command to add the new element ot the tree is executed from a string
            // this code creates this string
            // it starts at the top, tries to find the first path element, get its index,
            // attatch the right code (with index) to the string, overrides the array to dig in and starts over until all path elements are done
            let action = 'internalData.cards';
            let innerData = data.cards;
            for (let pathIndex = 0; pathIndex <= body.path.length - 1; pathIndex++) {
                const index = innerData.indexOf(innerData.find((elem: any) => elem.type === 'folder' && elem.name === body.path[pathIndex]));
                action += '[' + index + '].children';
                innerData = innerData[index].children;
            }
            const i = innerData.indexOf(innerData.find((elem: any) => elem.name === body.cardName && elem.type === body.type));
            // check if element ist there or not
            if (i < 0) {
                res.status(404).send({error: 'Card not found'});
                return;
            }
            action += '.splice(' + i + ',1)';
            // executes the string and so adding the new element ot the tree
            const executerFunc = new Function('data', 'const internalData = data; ' + action + ';return internalData');
            data = executerFunc(data);
        }
        fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
        res.status(200).end();
    } catch (error) {
        console.log(error);
        
        res.status(500).end();        
    }
}