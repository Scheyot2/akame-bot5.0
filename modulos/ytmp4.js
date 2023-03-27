const ytdl = require("ytdl-core");
const yts = require("yt-search");
const axios = require('axios')
const cheerio = require('cheerio')


function bytesToSize(bytes) {
  return new Promise((resolve, reject) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "n/a";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) resolve(`${bytes} ${sizes[i]}`);
    resolve(`${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`);
  });
}

function ytMpGuxta(url) {
  return new Promise(async (resolve, reject) => {
    ytdl
      .getInfo(url)
      .then(async (getUrl) => {
        let result = [];
        for (let i = 0; i < getUrl.formats.length; i++) {
          let item = getUrl.formats[i];
          if (
            item.container == "mp4" &&
            item.hasVideo == true &&
            item.hasAudio == true
          ) {
            let { qualityLabel, contentLength, approxDurationMs } = item;
            let bytes = await bytesToSize(contentLength);
            result[i] = {
              video: item.url,
              quality: qualityLabel,
              size: bytes,
              
            };
          }
        }
        let resultFix = result.filter(
          (x) =>
            x.video != undefined &&
            x.size != undefined &&
            x.quality != undefined
        );
        let tinyUrl = resultFix[0].video;
        let title = getUrl.videoDetails.title;
        let desc = getUrl.videoDetails.description;
        let views = parseInt(getUrl.videoDetails.viewCount || 0);
        let likes = getUrl.videoDetails.likes;
        let dislike = getUrl.videoDetails.dislikes;
        let channel = getUrl.videoDetails.ownerChannelName;
        let uploadDate = getUrl.videoDetails.uploadDate;
        let thumb =
          getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail
            .thumbnails[0].url;
        resolve({
          creator: "Guxta",
          title,
          result: tinyUrl,
          quality: resultFix[0].quality,
          size: resultFix[0].size,
          duration: resultFix[0].duration,
          thumb,
          views,
          likes,
          dislike,
          channel,
          uploadDate,
          desc,
        });
      })
      .catch(reject);
  });
}


module.exports.ytMpGuxta = ytMpGuxta
module.exports.bytesToSize = bytesToSize