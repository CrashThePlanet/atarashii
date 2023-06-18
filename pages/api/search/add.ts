import { NextApiRequest, NextApiResponse } from "next";
const fs = require('fs');
import path from 'path';

const db = require('@/databaseConn');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const body = JSON.parse(req.body);
        if (body.query === undefined) {
            res.status(400).send({error: 'noSearchQuery'});
            return;
        }
        if (req.headers.authorization === undefined) {
            res.status(401).end();
            return;
        }

        // loads the search history from the server
        // const filePath = path.join(process.cwd(), 'storage') + '/searchHistory.json';
        // const data = JSON.parse(fs.readFileSync(filePath,'utf8'));

        const getQuery = await db.execute(`SELECT history FROM userSearchHistory WHERE userID = '${req.headers.authorization}'`);
        if (getQuery[0][0].length < 1) {
            res.status(401).end();
            return;
        }
        let data = getQuery[0][0].history;
        // checks if this exect search is already in the history
        // if so, just update the timestamp and sort the array
        const entrie = data.find((entrie: any) => entrie.query === body.query)
        if (entrie !== undefined) {
            const queryIndex = data.indexOf(entrie);
            data[queryIndex].timeStamp = new Date().getTime();
            data.sort((a:any,b:any) => {
                return a.timeStamp - b.timeStamp
            });
        } else {
            // not in history --> add
            data.push({
                query: body.query,
                timeStamp: new Date().getTime()
            });
        }
        // fs.writeFileSync(filePath, JSON.stringify(data));
        // res.status(200).end()
        await db.execute(`UPDATE userSearchHistory SET history = '${JSON.stringify(data)}' WHERE userID = '${req.headers.authorization}'`);
        res.status(200).end();
    } catch (error) {
        res.status(500).end();
    }
}