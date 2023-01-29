const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const ytdl = require("ytdl-core");
const { config } = require("dotenv");

config();

express()
  .use(express.json())
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .post("/download", (req, res) => {
    // if req.body.options.onlyAudio is true, then download audio else download video
    if (req.body.options.onlyAudio === true) {
      res.setHeader("Content-Disposition", "attachment; filename=audio.mp3");
      ytdl(req.body.url, {
        filter: "audioonly",
        format: "mp3",
      }).pipe(res);
    } else {
      res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
      ytdl(req.body.url, {
        format: "mp4",
      }).pipe(res);
    }
  })
  .post("/search", (req, res) => {
    const query = req.body.query;
    const normalizedQuery = query.replace(" ", "%20");

    fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&order=relevance&q=${normalizedQuery}&type=video&key=${process.env.API_KEY}`
    )
      .then((data) => {
        return data.json();
      })
      .then((json) => {
        const results = [];

        for (const item of json["items"]) {
          let videoId = item.id.videoId;
          let videoTitle = item.snippet.title;
          let thumbnail = item.snippet.thumbnails.default.url;
          let publisher = item.snippet.channelTitle;

          results.push({
            id: videoId,
            title: videoTitle,
            thumbnail,
            publisher,
          });
        }

        res.json({
          videos: results,
        });
      });
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
