const get_skin = require('./get_skin.js')
const edit_skin = require('./edit_skin.js')
const http = require('http');
const fs = require('fs');
const port = 1337;
const host = 'localhost';
const regex = new RegExp(/\/(foot|police|soldat|baguette|british)\/[A-z]*\.png/g)


const server = http.createServer(function (req, res) {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream('./website/index.html').pipe(res);
    } else {
        if (regex.test(req.url)) {
            let skin = req.url.split('/')[1];
            let pseudo = req.url.split('/')[2].split('.')[0];
            // verifier si le skin existe deja
            if (fs.existsSync(`./website/${skin}/${pseudo}.png`)) {
                res.setHeader('Content-disposition', `attachment; filename=./website/${skin}/${pseudo}.png`);
                res.writeHead(200, {'Content-Type': 'image/png'});
                fs.createReadStream(`./website/${skin}/${pseudo}.png`).pipe(res);
            } else {
                get_skin(pseudo).then(() => {
                    edit_skin(pseudo, skin).then(() => {
                        setTimeout(() => {
                            res.setHeader('Content-disposition', `attachment; filename=./website/${skin}/${pseudo}.png`);
                            res.writeHead(200, {'Content-Type': 'image/png'});
                            fs.createReadStream(`./website/${skin}/${pseudo}.png`).pipe(res);
                        }, 1000)
                    })
                }).catch(error => {
                    //envoie erreur 404
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end('Ce pseudo n\'existe pas');
                })
            }
        } else {
            // verifier si le fichier existe
            if (fs.existsSync('./website' + req.url)) {
                res.writeHead(200, { 'Content-Type': '' });
                fs.createReadStream('./website/' + req.url).pipe(res);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
            }
        }

    }
});

server.listen(port, host, function () {
    console.log('Web server is running on port 1337');
});
