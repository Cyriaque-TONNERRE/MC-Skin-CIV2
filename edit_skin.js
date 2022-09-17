const sharp = require('sharp');

function edit_skin(Pseudo, Skin) {
    return new Promise(async (resolve, reject) => {
        await sharp(`./Skin/${Pseudo}.png`)
            .extract({width: 32, height: 16, left: 0, top: 0})
            .toFile(`./Skin/${Pseudo}-resized.png`);
        resolve(`./Skin/${Pseudo}-resized.png`)
        //paste the head on the body
        await sharp(`./Base_skin/${Skin}.png`)
            .composite([{input: `./Skin/${Pseudo}-resized.png`, top: 0, left: 0}])
            .toFile(`./website/${Skin}/${Pseudo}.png`).then(() => {
                resolve(`./website/${Skin}/${Pseudo}.png`)
            })
    })
}

module.exports = edit_skin;