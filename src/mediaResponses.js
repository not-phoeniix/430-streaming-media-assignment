const fs = require("fs");
const path = require("path");

function serveStream(req, res, localPath, mimeType) {
    const file = path.resolve(__dirname, localPath);

    fs.stat(file, (err, stats) => {
        if (err) {
            if (err.code === "ENOENT") {
                res.writeHead(404);
            }

            return res.end(err);
        }

        // ~~~ parse desired range to stream ~~~

        let { range } = req.headers;
        if (!range) {
            range = "bytes=0-";
        }


        const positions = range.replace(/^.*=/, "").split("-");
        const total = stats.size;

        const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        const start = Math.min(parseInt(positions[0], 10), end - 1);

        const chunkSize = (end - start) + 1;

        // ~~~ write head with chunk data ~~~

        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${total}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": mimeType,
        });

        // ~~~ create & write stream ~~~

        const stream = fs.createReadStream(file, { start, end })
            .on("open", () => stream.pipe(res))
            .on("error", (streamErr) => res.end(streamErr));

        return stream;
    });
}

function getParty(req, res) {
    return serveStream(req, res, "../client/party.mp4", "video/mp4");
}

function getBling(req, res) {
    return serveStream(req, res, "../client/bling.mp3", "audio/mpeg");
}

function getBird(req, res) {
    return serveStream(req, res, "../client/bird.mp4", "video/mp4");
}

module.exports = {
    getParty,
    getBling,
    getBird
};
