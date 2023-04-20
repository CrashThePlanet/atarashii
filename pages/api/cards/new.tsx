import type { NextApiRequest, NextApiResponse } from 'next'

import path from 'path';
const fs = require('fs');

const jsonPath = path.join(process.cwd(), 'storage') + '/cards.json';
let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);
  if (body.type === undefined || body.name === undefined || (body.type === "website" && body.url === undefined)) {
    res.status(400).send({error: 'Missing Information'});
    return;
  }


  if (body.path === undefined) {
    if (data.cards.indexOf(data.cards.find((elem: any) => elem.type === body.type && elem.name === body.name)) >= 0) {
      res.status(409).send({error: 'Already exists!'});
      return;
    }
    
    if (body.type === 'website') {
      let url = body.url;
      if (body.url.substring(0,6) !== 'http://' || body.url.substring(0,7) !== 'https://') {
        url = 'http://' + url;
      }
      data.cards.push({
        type: body.type,
        name: body.name,
        url: url
      });
    } else if (body.type === "folder") {
      data.cards.push({
        type: body.type,
        name: body.name,
        children: []
      });
    } 
  } else {
    let innerData = data.cards;
    body.path.forEach((pathName: string, index: number) => {
      innerData = innerData.find((elem: any) => elem.type === 'folder' && elem.name === pathName).children;
    });
    if (innerData.indexOf(data.cards.find((elem: any) => elem.type === body.type && elem.name === body.name)) >= 0) {
      res.status(409).send({error: 'Already exists!'});
      return;
    }

    
    let action = 'internalData.cards';
    innerData = data.cards
    body.path.forEach((pathName: string) => {
      const index = innerData.indexOf(data.cards.find((elem: any) => elem.type === 'folder' && elem.name === pathName));
      action += '[' + index + '].children';
      innerData = innerData[index];
    });


    if (body.type === 'website') {
      let url = body.url;
      if (body.url.substring(0,6) !== 'http://' || body.url.substring(0,7) !== 'https://') {
        url = 'http://' + url;
      }
      action += '.push(' + JSON.stringify({
        type: body.type,
        name: body.name,
        url: url
      }) + ');';
    } else if (body.type === "folder") {
      action += '.push(' + JSON.stringify({
        type: body.type,
        name: body.name,
        children: []
      }) + ');';
    }
    const executerFunc = new Function('data', 'const internalData = data; ' + action + 'return internalData');
    data = executerFunc(data);
  }
  fs.writeFileSync(jsonPath, JSON.stringify(data), 'utf8');
  res.status(200).end();
}
