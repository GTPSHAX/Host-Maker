const express = require("express");
const web = express();
const bodyParser = require('body-parser');
const { put, get } = require('@vercel/blob');
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

web.post('/api', async (req, res) => {
    try {
        const invalidExtensions = new Set(["html", "css", "js"]);
        const fileExtension = req.body.name.split(".").pop();
        
        if (invalidExtensions.has(fileExtension)) {
            res.redirect("/");
            return;
        }
        
        let data;
        // try {
        //     const response = await axios.get(`https://nizmryel0k76gcub.public.blob.vercel-storage.com/${req.body["name"]}`);
        //     data = response.data;
        // } catch (error) {
        //     console.error(error);
        //     res.status(404).send('Blob not found');
        //     return;
        // }
        
        if (data) {
            data = JSON.parse(data);
            
            if (data["key"] && req.body["key"] == data["key"]) {
                data["ip1"] = req.body["ip1"];
                data["ip2"] = req.body["ip2"] ? req.body["ip2"] : req.body["ip1"];
                await put(req.body["name"], { json: data });
            }
            else {
                res.redirect("/");
                return;
            }
        }
        else {
            data = {
                "ip1": req.body["ip1"],
                "ip2": req.body["ip2"] ? req.body["ip2"] : req.body["ip1"],
                "key": req.body["key"] ? req.body["key"] : ""
            }
            await put(req.body["name"], data.toString(), {access: 'public'});
        }
        
        res.redirect("/" + req.body.name);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating blob');
    }
});

web.use(express.static(__dirname + "/public"))

web.get("/:key", async (req, res)=>{
    try {
        const key = req.params.key.split("/")[req.params.key.split("/").length - 1].split(".")[0];
        const ext = req.params.key.split("/")[req.params.key.split("/").length - 1].split(".")[req.params.key.split("/")[req.params.key.split("/").length - 1].split(".").length - 1];
        
        const data = await get(key);
        if (data) {
            data = JSON.parse(data);
            
            const host = `${data["ip1"]} growtopia1.com
${data["ip2"]} growtopia2.com
${data["ip1"]} www.growtopia1.com
${data["ip2"]} www.growtopia2.com`;

            if (ext == "host") {
                res.set({
                    'Content-Type': 'text/plain',
                    'Content-Disposition': `attachment; filename="${data["name"]}.host"`,
                });
            }
            else {
                res.set({
                    'Content-Type': 'text/plain',
                });
            }
            res.send(host);
        }
        else res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(404).send('Blob not found');
    }
});

web.listen(80, () => {
    console.log(`Example app listening on port  80`)
  })

module.exports = web;