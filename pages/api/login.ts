import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from 'uuid';

const db = require('@/databaseConn/')


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = JSON.parse(req.body);
    if (body.username.length < 1) {
        res.status(400).end({err: 'Missing Username'});
        return;
    }

    try {
        const query = await db.execute(`SELECT * FROM users WHERE username = '${body.username}'`);
        if (query[0].length > 0) {
            res.status(200).send({uuid: query[0][0].userID});
            return;
        }
        if (body.create) {
            const uid = uuidv4();
            const insertQuery1 = await db.execute(`INSERT INTO users (username, dateOfCreation, userID) VALUES ('${String(body.username)}', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', '${uid}')`);
            const insertQuery2 = await db.execute(`INSERT INTO userViews (userID, elements) VALUES ('${uid}', '${JSON.stringify({cards: []})}')`);
            const insertQuery3 = await db.execute(`INSERT INTO userSearchHistory (userID, history) VALUES ('${uid}', '${JSON.stringify([])}')`)
            res.status(201).send({uuid: uid});
            return;
        }
        res.status(404).send({err: 'User not found'});
    } catch (error) {
        console.log(error);
        res.status(500).end();
        return;
    }
}