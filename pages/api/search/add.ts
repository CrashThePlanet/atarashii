import { NextApiRequest, NextApiResponse } from "next";
const fs = require('fs');
import path from 'path';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const body = JSON.parse(req.body);
        if (body.query === undefined) {
            res.status(400).send({error: 'noSearchQuery'});
            return;
        }

        // loads the search history from the server
        const filePath = path.join(process.cwd(), 'storage') + '/searchHistory.json';
        const data = JSON.parse(fs.readFileSync(filePath,'utf8'));

        // checks if this exect search is already in the history
        // if so, just update the timestamp and sort the array
        const entrie = data.queries.find((entrie: any) => entrie.query === body.query)
        if (entrie !== undefined) {
            const queryIndex = data.queries.indexOf(entrie);
            data.queries[queryIndex].timeStamp = new Date().getTime();
            data.queries.sort((a:any,b:any) => {
                return a.timeStamp - b.timeStamp
            });
        } else {
            // not in history --> add
            data.queries.push({
                query: body.query,
                timeStamp: new Date().getTime()
            });
        }
        fs.writeFileSync(filePath, JSON.stringify(data));
        res.status(200).end()
    } catch (error) {
        res.status(500).end();
    }
}