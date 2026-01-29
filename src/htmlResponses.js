const fs = require("fs");

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const page2 = fs.readFileSync(`${__dirname}/../client/client2.html`);
const page3 = fs.readFileSync(`${__dirname}/../client/client3.html`);

function serveHtml(req, res, file) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(file);
    res.end();
}

function getIndex(req, res) {
    serveHtml(req, res, index);
}

function getPage2(req, res) {
    serveHtml(req, res, page2);
}

function getPage3(req, res) {
    serveHtml(req, res, page3);
}

module.exports = {
    getIndex,
    getPage2,
    getPage3
};
