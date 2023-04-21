import type { NextApiRequest, NextApiResponse } from 'next'

import path from 'path';
const fs = require('fs');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // gets alls the data (websites and folders) from the server
        const pathToCards = path.join(process.cwd(), 'storage') + '/cards.json';
        const data = JSON.parse(fs.readFileSync(pathToCards, 'utf8'));

        // if request came from the "/home" directory just send the to array data
        if (req.method === 'GET') {
            res.status(200).send(data);
            return;
        }
        // if not from "/home" send
        if (req.method === 'POST') {
            const body = JSON.parse(req.body);
            if (body.path === undefined || body.length < 1) {
                res.status(400).send({error: 'Missing Information'});
                return;
            }
            // it loops down the path (given by the client) and returns all the children of the last element
            // used to find the children of a Folder, no matter how deeply nested it is
            let innerData = data.cards;
            body.path.forEach((pathName: string) => {
                innerData = innerData.find((elem: any) => elem.type === 'folder' && elem.name === pathName).children;
            });
            res.status(200).send(innerData);
            return;
        }
    } catch (error) {
        res.send(500);
    }
}