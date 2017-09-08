const http = require('http');

const PORT = 3000;

async function requestHandler(request, response) {
  response.end('Hello world!');
}

const server = http.createServer(requestHandler);

server.listen(PORT, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`deploying server is listening on ${PORT}`)
});
