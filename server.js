require('dotenv').config()

const fs = require("fs")
const express = require('express')
const {getToken, getStreams, addStreamer, validateToken} = require('./twitch.js')

const app = express()

app.use(express.json())


app.get('/streamers/streams', (req, res) => {
    console.log("New request: streams, Params: ", req.query.login)
    getStreams(req.query.login, (status, data) => {
        if (status !== 200) {
            console.log("Error getting streams. Status: ", status, data.message)
            return res.status(status).send(data)
        }

        var onlineStreams = []
        if (data.length) {
            data.forEach(stream => {
                onlineStreams.push({
                    user_login: stream.user_login,
                    game_name: stream.game_name,
                    title: stream.title,
                    viewer_count: stream.viewer_count
                })
            })
        }
        console.log("Response from twitch. Status: ", status, "\n\n")
        res.status(200).send(onlineStreams)
    })  
})

app.get('/streamers/streamer', (req, res) => {
    console.log("New request: streamer, Param: ", req.query.login)
    addStreamer(req.query.login, (status, data) => {
        if (status !== 200) {
            console.log("Error getting streamer. Status: ", status, data.message)
            return res.status(status).send(data)
        } 
        console.log("Response from twitch. Status: ", status, "\n\n")
        res.status(status).send(data)
    })
})



app.listen(3000, () => console.log("Server started..."))





getToken(({status}) => {
    if (status !== 200) {
        console.log("Error with geting access token. status: ", status)
    }
})
setInterval(()=> {
    validateToken(res => {
        console.log(res)
        console.log(res)
        if (res.status === 401 || res.expires_in < 3600) {
            getToken(({status}) => {
                if (status !== 200) {
                    console.log("Error with geting access token. status: ", status)
                }
                console.log("New token acquired.")
            })
        }   
    })
}, 3600000)
