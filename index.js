const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});
const textParser = bodyParser.text({type: "text/html"});
const http = require("http");
const https = require("https");
const host = "localhost";
const portHTTP = 5000;

// const host = '88.99.148.11';
// const portHTTP = 80;
// const portHTTPS = 443;
// const optionsHTTP = {
//     key: fs.readFileSync("radiance.key"),
//     cert: fs.readFileSync("radiance.crt")
// };
const server = http.createServer(app);
// const httpsserver = https.createServer(optionsHTTP, app);

// app.use ((req, res, next) => {if (req.secure) {next();} else {res.redirect('https://' + req.headers.host + req.url);}});
app.use(express.static("build"));
// app.set('views', './views');
// app.set('view engine', 'pug');

// app.get('/', function (req, res) {
//     res.render('index', { });
//     res.end(); // Write response
//     console.log('get / route rendered view with locale:');
// });

server.listen(portHTTP, host, () => {
	console.log("Radiance http server is running at http://localhost:3000");
});

// httpsserver.listen(portHTTPS, host, () => {
//   console.log('Radiance https server is running');
// });

app.use(express.static("build"));
