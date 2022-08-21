require('dotenv').config()
const request = require('request')

var AT = ''

function getToken(callback) {
    const options = {
        url: "https://id.twitch.tv/oauth2/token",
        json: true,
        body:{
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "client_credentials"
        }
    }
    request.post(options, (err, res, body) => {
        if(err) return console.log(err)
        if(res.statusCode !== 200) return callback({status: res.statusCode})

        console.log("Get token. Status: ", res.statusCode)
        console.log(body)
        AT = res.body.access_token
        callback({status: res.statusCode})
    })
}

function getStreams(userLogins, callback) {
    var url = "https://api.twitch.tv/helix/streams?"

    for (let i = 0; i < userLogins.length; i++) {
        if (i === userLogins.length - 1) url += "user_login=" + userLogins[i];
        else url += "user_login=" + userLogins[i] + "&";
    }

    const options = {
        url,
        json: true,
        headers: {
            Authorization: "Bearer " + AT,
            "Client-Id": process.env.CLIENT_ID,
        }
    }
    request.get(options, (err, res, body) => {
        if(err) return console.log(err)
        if(res.statusCode !== 200) return callback(res.statusCode, res.body)
        console.log("Get streams: Status code from twitch: ", res.statusCode)
               
        //console.log(body.data)
        callback(res.statusCode, body.data)
    })
}
function addStreamer(streamerLogin, callback) {
    const options = {
        url: "https://api.twitch.tv/helix/users?login="+streamerLogin,
        json: true,
        headers: {
            Authorization: "Bearer " + AT,
            "Client-Id": process.env.CLIENT_ID,
        }
    }
    request.get(options, (err, res, body) => {
        if(err) return console.log(err)
        if(res.statusCode !== 200) return callback(res.statusCode, res.body)
        console.log("Get user: Status code from twitch: ", res.statusCode)
        
        if (body.data.length) {
            const streamer = {
                login: body.data[0].login,
                display_name: body.data[0].display_name,
                profile_image_url: body.data[0].profile_image_url         
            }
            callback(res.statusCode,[streamer])
        } else {
            callback(res.statusCode,[])
        }
    })
}
function validateToken(callback) {
    const options = {
        url: "https://id.twitch.tv/oauth2/validate",
        json: true,
        headers: {
            Authorization: "OAuth " + AT,
        }
    }
    request.get(options, (err, res, body) => {
        if(err) return console.log(err)
        if(res.statusCode !== 200) return callback(res.body)
        console.log("Validating token: Status code from twitch: ", res.statusCode)
        
        callback(res.body)
    })
}
module.exports = {getToken, getStreams, addStreamer, validateToken}