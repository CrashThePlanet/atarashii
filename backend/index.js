const express = require('express');
const cors = require('cors');
const fs = require('fs');
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
        if (req.body.type === 'link') {
            if (req.body.url.startsWith('http://') || req.body.url.startsWith('https://')) {
                req.body.url = req.body.url.replace('https://', '');
                req.body.url = req.body.url.replace('http://', '');
            }
        }
        const newLinkElem = {
            type: req.body.type,
            name: req.body.name,
            url: (req.body.type === 'link' ? req.body.url : undefined),
            ...req.body.type === 'folder' && { children: [] },
        }
        const tempConf = configFile;
        if (tempConf.elements.some(elem => elem.name === newLinkElem.name)) {
            res.send({linkCreated: false, error: 'Link already exists'});
            return;
        }
        tempConf.elements.push(newLinkElem);
        fs.writeFileSync(configFilePath, JSON.stringify(tempConf));
        res.send({linkCreated: true});
    } catch (error) {
        console.log(error);
        res.send({linkCreated: false, error: error});
    }
});