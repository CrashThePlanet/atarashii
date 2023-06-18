import { NextApiRequest, NextApiResponse } from "next";

const fs = require('fs');
import path from 'path';

const db = require('@/databaseConn');

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.headers.authorization === undefined) {
        res.status(401).end();
        return;
    }
    try {
        // gets the last the 10 searches from the history (newest to oldest)
        // const filePath = path.join(process.cwd(), 'storage') + '/searchHistory.json';
        // const data = JSON.parse(fs.readFileSync(filePath,'utf8'));

        const query = await db.execute(`SELECT history FROM userSearchHistory WHERE userID = '${req.headers.authorization}'`);
        if (query[0][0].length < 1 ) {
            res.status(401).end();
            return;
        }
        const data = query[0][0].history;
        const queries = data.slice(-10).reverse();
        res.status(200).send(queries);
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
}