const express = require('express');
const cors = require('cors');
const fs = require('fs');
const _ = require('lodash');
/*  ================
    Configure Server
    ================
*/
// get app
const app = express();
// define Port
const PORT = 3001;
// convert inputdata to json format
app.use(express.json());
app.use(cors());
// start server
app.listen(
    PORT,
    () => console.log('Server lives on http://localhost:' + PORT)
);

const configFilePath = './config.json';
const configFile = JSON.parse(fs.readFileSync(configFilePath, "utf8"));

app.get('/links', (req, res) => {
    res.send(configFile.elements);
});
app.post('/createLink', (req, res) => {
    try {
        // remove the protokol from the url if present
        if (req.body.type === 'link') {
            if (req.body.url.startsWith('http://') || req.body.url.startsWith('https://')) {
                req.body.url = req.body.url.replace('https://', '');
                req.body.url = req.body.url.replace('http://', '');
            }
        }
        // create new element
        const newLinkElem = {
            type: req.body.type,
            name: req.body.name,
            url: (req.body.type === 'link' ? req.body.url : undefined),
            ...req.body.type === 'folder' && { children: [] },
        }
        const tempConf = configFile;
        // if there is a path (so the new element is the child of another)
        if (req.body.path !== undefined) {            
            const pathArr = req.body.path.split('-');
            let pathString = 'elements';
            let childArr = tempConf.elements;
            // loop over each path element and create a string containeng the path to the "children" array
            for (const pathPart of pathArr) {
                const pathElem = childArr.find(elem => elem.name === pathPart);
                const index = childArr.indexOf(pathElem);

                pathString += '[' + index + '].children';
                childArr = pathElem.children;
            }
            // check if a element with the same name already exists in this array
            if (childArr.some(elem => elem.name === newLinkElem.name)) {
                res.send({linkCreated: false, error: 'Link already exists'});
                return;
            }
            // add the new element to the array
            childArr.push(newLinkElem);
            _.set(tempConf, pathString, childArr);
        }
        // just add the new element to the highest level if there is no path
        if (req.body.path === undefined) tempConf.elements.push(newLinkElem);
        fs.writeFileSync(configFilePath, JSON.stringify(tempConf));
        res.send({linkCreated: true});
    } catch (error) {
        console.log(error);
        res.send({linkCreated: false, error: error});
    }
});
app.post('/getFolderSubLinks', (req, res) => {
    // loop over each part of the array and save their children, if finished return the children
    const pathArr = req.body.path.split('-');
    let elemChildren = configFile.elements;

    for (const path of pathArr) elemChildren = elemChildren.find(elem => elem.name === path).children;

    res.send(elemChildren);
});