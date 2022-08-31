const express = require('express')
const {getToken, getStreams, addStreamer, validateToken} = require('./twitch.js')

const app = express()
let port = process.env.PORT || 3000


app.use(express.json())


app.get('/streamers/streams', (req, res) => {
    console.log("New request: streams, Params: ", req.query.login)
    var query = req.query.login
    if(!query) return res.status(400).send({message: "Nie podano stremow do sprawdzenia", status: 400})
    if(!Array.isArray(query)) query = Array(query)

    getStreams(query, (status, data) => {
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
                    viewer_count: stream.viewer_count,
                    thumbnail: stream.thumbnail_url
                })
            })
        }
        console.log("Response from twitch. Status: ", status, "\n\n")
        res.status(200).send(onlineStreams)
    })  
})

app.get('/streamers/streamer', (req, res) => {
    console.log("New request: streamer, Param: ", req.query.login)
    var query = req.query.login
    if(!query) return res.status(400).send({message: "Nie podano stremera do sprawdzenia", status: 400})
   
    if (Array.isArray(query)) query = query[0]

    addStreamer(query, (status, data) => {
        if (status !== 200) {
            console.log("Error getting streamer. Status: ", status, data.message)
            return res.status(status).send(data)
        } 
        console.log("Response from twitch. Status: ", status, "\n\n")
        res.status(status).send(data)
    })
})

app.get('*', function(req, res){
    res.status(404).send('That route doesnt exists... \n try /streamers/streamer?login={name} \n or \n /streamers/streams?login={name}&login={name}')
})

app.listen(port, () => console.log("Server started... PORT: "+port))





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
