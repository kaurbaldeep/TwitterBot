// Load environment variables from a .env file located in the same directory as this script
require("dotenv").config({ path: __dirname + "/.env" });

// Import required modules and libraries
const { twitterClient } = require("./twitterClient.js");
const CronJob = require("cron").CronJob;
const express = require('express')
const { download } = require("./utilities");

const app = express()
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

// Define the tweet function
const tweet = async () => {
    // URL of the image to be tweeted
    const uri = "https://picsum.photos/200/300";
    const filename = "image.png";

    // Download the image from the URL
    download(uri, filename, async function(){
        try {
            // Upload the downloaded image to Twitter and get the media ID
            const mediaId = await twitterClient.v1.uploadMedia("./image.png");
            console.log(mediaId)
            
            // Post a tweet with the uploaded media
            await twitterClient.v2.tweet({
                text: "Hello world! This is an image of something!!",
                media: {
                    media_ids: [mediaId]
                }
            });
        } catch (e) {
            console.log(e)
        }
    });
}

// Set up an interval to call the tweet function every 60 seconds
const interval = setInterval(tweet, 60000); // 60000 milliseconds = 60 seconds
