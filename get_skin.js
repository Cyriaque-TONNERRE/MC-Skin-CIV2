const axios = require('axios')
const fs = require('fs')

function get_skin(username) {
    return new Promise((resolve, reject) => {
        let url = 'https://api.mojang.com/users/profiles/minecraft/' + username
        axios.get(url)
            .then(res => {
                axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${res.data.id}`)
                    .then(res2 => {
                        let decoded = Buffer.from(res2.data.properties[0].value, 'base64').toString('ascii');
                        let skin = JSON.parse(decoded).textures.SKIN.url;
                        axios.get(skin, {responseType: 'arraybuffer'})
                            .then(res3 => {
                                fs.writeFileSync('./Skin/' + username + '.png', res3.data, 'binary');
                                resolve('./Skin/' + username + '.png')
                            }).catch(error => {
                                console.log(error);
                                reject(error)
                        })

                    }).catch(error => {
                        console.log(error);
                        reject(error)
                })
            })
            .catch(error => {
                console.log(error)
                reject(error)
            })
    })
}

module.exports = get_skin;