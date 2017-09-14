const http = require('http');

async function requestHandler(request, response) {
 response.end('Hello world!');
}

const server = http.createServer(requestHandler);

server.listen(5000, (err) => {
 if (err) {
   return console.log('something bad happened', err)
 }
 console.log(`deploying server is listening on ${5000}`)
});
