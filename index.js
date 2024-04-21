const ytdl = require('ytdl-core');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Set your desired port number here

app.use(cors());

app.get("/yt", async function (req, res) {
  const { url, type } = req.query;

  if (!url) return res.json({ error: "No url provided" });
  if (!type) return res.json({ error: "Use mp3 or mp4 only for type." });

  let filter;
  let format;

  switch (type) {
    case "mp4":
      filter = 'audioandvideo';
      format = 'mp4';
      break;

    case "mp3":
      filter = 'audioonly';
      format = 'mp3';
      break;

    default:
      return res.json({ error: "Invalid type" });
  }

  try {
    const path = __dirname + `/${type}.${format}`;

    let options = {
      filter: filter,
      format: format,
      quality: 'lowestvideo' // Set default quality to lowest video
    };

    const stream = ytdl(url, options);

    stream.pipe(fs.createWriteStream(path)).on('finish', () => {
      res.sendFile(path);
    });
  } catch (e) {
    return res.json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
