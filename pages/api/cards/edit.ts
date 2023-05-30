const fs = require('fs');
import Path from 'path';
import { NextApiRequest, NextApiResponse } from "next";


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }
    const body = JSON.parse(req.body);

    // TODO: validating data
    try {
        const pathToData = Path.join(process.cwd(), 'storage') + '/cards.json';
        let data = JSON.parse(fs.readFileSync(pathToData, 'utf8'));
        if (body.path === undefined) {
            const targetIndex = data.cards.indexOf(data.cards.find((elem: any) => elem.name === body.target && elem.type === body.type));
            if (targetIndex === -1) {
                res.status(404).send('Card not found');
                return;
            }
            if (data.cards.indexOf(data.cards.find((elem: any) => elem.name === body.newName && elem.type === body.type)) >= 0) {
                res.status(409).send('Card with this name already exists');
                return;
            }
            data.cards[targetIndex] = {...data.cards[targetIndex], name: body.newName};
        } else {
            if (!Array.isArray(body.path)) {
                res.status(400).end();
                return;
            }
            let action = 'internalData.cards';
            let innerData = data.cards;
            for (let pathIndex = 0; pathIndex <= body.path.length - 1; pathIndex++) {
                const index = innerData.indexOf(innerData.find((elem: any) => elem.type === 'folder' && elem.name === body.path[pathIndex]));
                action += '[' + index + '].children';
                innerData = innerData[index].children;
            }
            const i = innerData.indexOf(innerData.find((elem: any) => elem.name === body.target && elem.type === body.type));
            // check if element ist there or not
            if (i < 0) {
                res.status(404).send({error: 'Card not found'});
                return;
            }
            if (innerData.indexOf(innerData.find((elem: any) => elem.name === body.newName && elem.type === body.type)) >= 0) {
                res.status(409).send({msg: 'Card with this name already exists'});
                return;
            }
            action += '['+i+'] = ' + JSON.stringify({...innerData[i], name: body.newName});
            // executes the string and so adding the new element ot the tree
            const executerFunc = new Function('data', 'const internalData = data; ' + action + ';return internalData');
            data = executerFunc(data);
        }
        fs.writeFileSync(pathToData, JSON.stringify(data), 'utf8');
        res.status(200).end();
    } catch (error) {
        res.status(500).end();
    }
}