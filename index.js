const express = require("express");
const web = express();
const bodyParser = require("body-parser");
const { put, list } = require("@vercel/blob");
const axios = require("axios");
require("dotenv").config();

web.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});
web.use(bodyParser.urlencoded({ extended: true }));

// Helper function to get blob content since 'get' is not exported by @vercel/blob
async function getBlobContent(filename) {
  try {
    // List blobs with the prefix matching the filename
    const { blobs } = await list({ prefix: filename });

    // Find the exact match to avoid prefix collisions (e.g. "test" vs "test2")
    const blob = blobs.find((b) => b.pathname === filename);

    if (!blob) return null;

    // Download the content
    const response = await axios.get(blob.url);
    return response.data;
  } catch (error) {
    console.error("Error retrieving blob:", error);
    return null;
  }
}

web.post("/api", async (req, res) => {
  try {
    const invalidExtensions = new Set(["html", "css", "js"]);
    const name = req.body.name;

    if (!name) {
      return res.status(400).send("Name is required");
    }

    const fileExtension = name.split(".").pop();

    if (invalidExtensions.has(fileExtension)) {
      res.redirect("/");
      return;
    }

    let data = await getBlobContent(name);

    // Ensure data is an object if it was fetched
    if (data && typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        data = null; // Treat as not found if corrupt
      }
    }

    if (data) {
      // Update existing host
      if (data["key"] && req.body["key"] == data["key"]) {
        data["ip1"] = req.body["ip1"];
        data["ip2"] = req.body["ip2"] ? req.body["ip2"] : req.body["ip1"];

        // Save updated data
        await put(name, JSON.stringify(data), {
          access: "public",
          addRandomSuffix: false, // Ensure we keep the same filename
          contentType: "application/json",
        });
      } else {
        // Key mismatch
        res.redirect("/");
        return;
      }
    } else {
      // Create new host
      data = {
        name: name,
        ip1: req.body["ip1"],
        ip2: req.body["ip2"] ? req.body["ip2"] : req.body["ip1"],
        key: req.body["key"] ? req.body["key"] : "",
      };

      await put(name, JSON.stringify(data), {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/json",
      });
    }

    res.redirect("/" + name);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating blob");
  }
});

web.use(express.static(__dirname + "/public"));

web.get("/:key", async (req, res) => {
  try {
    // Extract name (id) and extension from URL parameter
    const parts = req.params.key.split(".");
    const name = req.params.key.split("/").pop().split(".")[0];
    const ext = parts.length > 1 ? parts[parts.length - 1] : "";

    let data = await getBlobContent(name);

    if (data) {
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.error("Error parsing blob JSON", e);
          return res.status(500).send("Error parsing host data");
        }
      }

      const host = `${data["ip1"]} growtopia1.com
${data["ip2"]} growtopia2.com
${data["ip1"]} www.growtopia1.com
${data["ip2"]} www.growtopia2.com`;

      if (ext == "host") {
        res.set({
          "Content-Type": "text/plain",
          "Content-Disposition": `attachment; filename="${data["name"] || name}.host"`,
        });
      } else {
        res.set({
          "Content-Type": "text/plain",
        });
      }
      res.send(host);
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    res.status(404).send("Blob not found");
  }
});

const port = process.env.PORT || 8080;
web.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = web;
