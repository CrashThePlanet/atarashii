import type { NextApiRequest, NextApiResponse } from 'next'

import path from 'path';
const fs = require('fs');

const db = require('@/databaseConn');

// const jsonPath = path.join(process.cwd(), 'storage') + '/cards.json';
// let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);
  if (body.type === undefined || body.name === undefined || (body.type === "website" && body.url === undefined)) {
    res.status(400).send({error: 'Missing Information'});
    return;
  }
  if (req.headers.authorization === undefined) {
    res.status(401).end();
    return;
  }
  const dataQuery = await db.execute(`SELECT elements FROM userViews WHERE userID = '${req.headers.authorization}'`);
  if (dataQuery[0][0].length < 1) {
    res.status(401).end();
    return;
  }  
  let data = dataQuery[0][0].elements;
  

  // check if it should add to the top array or somewhere deeper
  if (body.path === undefined) {
    // tries to find the element in the top array and its index
    if (data.cards.indexOf(data.cards.find((elem: any) => elem.type === body.type && elem.name === body.name)) >= 0) {
      res.status(409).send({error: 'Already exists!'});
      return;
    }
    
    if (body.type === 'website') {
      let url = body.url;
      // if the user forgot to provide protcoll, adds is automaticlly
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
    // if it's somewhere deeper (nested in one or more folders)

    // again, it checks if the element is already present in the targeted folder
    let innerData = data.cards;
    // diggs into the tree und gets the children of the targeted folder
    body.path.forEach((pathName: string, index: number) => {
      innerData = innerData.find((elem: any) => elem.type === 'folder' && elem.name === pathName).children;
    });
    // check if element ist there or not
    if (innerData.indexOf(data.cards.find((elem: any) => elem.type === body.type && elem.name === body.name)) >= 0) {
      res.status(409).send({error: 'Already exists!'});
      return;
    }

    // the actual command to add the new element ot the tree is executed from a string
    // this code creates this string
    // it starts at the top, tries to find the first path element, get its index,
    // attatch the right code (with index) to the string, overrides the array to dig in and starts over until all path elements are done
    let action = 'internalData.cards';
    innerData = data.cards;
    for (let pathIndex = 0; pathIndex <= body.path.length - 1; pathIndex++) {
      const index = innerData.indexOf(innerData.find((elem: any) => elem.type === 'folder' && elem.name === body.path[pathIndex]));
      action += '[' + index + '].children';
      innerData = innerData[index].children;
    }
    // it completes the string by adding the actual element to it
    // some concept as in the if statement at the top
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
    // executes the string and so adding the new element ot the tree
    const executerFunc = new Function('data', 'const internalData = data; ' + action + 'return internalData');
    data = executerFunc(data);
  }
  const updateQuery = db.execute(`UPDATE userViews SET elements = '${JSON.stringify(data)}' WHERE userID = '${req.headers.authorization}'`);
  res.status(200).end();
  // fs.writeFileSync(jsonPath, JSON.stringify(data), 'utf8');
  // res.status(200).end();
}
