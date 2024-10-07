const express = require("express");
const web = express();
const bodyParser = require('body-parser');
const axios = require('axios');

web.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    next();
});
web.use(bodyParser.urlencoded({ extended: true }));

// Login section
web.post('/api', (req, res) => {
    try {
        res.redirect("/player/growid/login/validate");
    } catch (error) {
        console.error(error);
        res.sendStatus(404);
    }
});
/*web.all('/player/growid/login/validate', (req, res) => {
    try {
        const token = Buffer.from(`_token=${req.body._token}&growId=GROWPLUS&password=GROWPLUS`).toString('base64');
    
        res.send(`{"status":"success","message":"Account Validated.","token":"${cnf.server.returnToken ? token : ""}","url":"","accountType":"growtopia"}`);
    } catch (error) {
        console.error(error);
        res.sendStatus(404);
    }
});
web.post('/player/validate/close', function (req, res) {
    res.send('<script>window.close();</script>');
});
*/
web.use(express.static(__dirname + "/public"))

module.exports = web;