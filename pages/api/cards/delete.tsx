import { NextApiRequest, NextApiResponse } from "next";

import path from 'path';
const fs = require('fs');

export default function(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }
    const body = JSON.parse(req.body)
    if (typeof body.cardName !== 'string') {
        res.status(400).send({msg: 'Missing Card name'});
        return;
    }
    const filePath = path.join(process.cwd(), 'storage') + '/cards.json';
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.cards.splice(data.cards.indexOf(data.cards.find((elem: any) => elem.name === body.cardName)), 1);
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
    res.status(200).end();
}