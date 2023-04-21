import { NextApiRequest, NextApiResponse } from "next";

const fs = require('fs');
import path from 'path';

export default function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // gets the last the 10 searches from the history (newest to oldest)
        const filePath = path.join(process.cwd(), 'storage') + '/searchHistory.json';
        const data = JSON.parse(fs.readFileSync(filePath,'utf8'));
        const queries = data.queries.slice(-10).reverse();
        res.status(200).send(queries);
    } catch (error) {
        res.status(500).end();
    }
}