/*
 * Deploying server that is in charge of monitoring and displaying the pushes.
 * In order for this to work you should:
 *   1. create config.json, should follow the format:
 *     {
 *       "port": NUMBER,
 *       "logs": './PATH/TO/HISTORY/LOG',
 *       "deploy": "deploy/string",
 *     }
 *   2. create the first history file in the logs path
 *   3. setup this as forever process
 */

const fs = require('fs');
const http = require('http');
const util = require('util');
const child_process = require('child_process');

const appendFile = util.promisify(fs.appendFile);
const exec = util.promisify(child_process.exec);
const readFile = util.promisify(fs.readFile);

const CONFIG_PATH = './config.json';

async function parseConfig(setupServer) {
 const rawConfig = await readFile(CONFIG_PATH);
 const config = JSON.parse(rawConfig);
 setupServer(config);
}

function setupServer(config) {
 async function requestHandler(request, response, logFilePath) {
   if (request.method === 'GET') {
     const logs = await readFile(logFilePath);
     response.end(logs);
   } else if (request.method === 'POST') {
     const {stdout, stderr} = await exec(config.deploy);
     const now = new Date().toISOString();
     if (stdout) appendFile(logFilePath, `[${now}] SUCCESS\n${stdout}\n`);
     if (stderr) appendFile(logFilePath, `[${now}] FAILURE\n${stderr}\n`);
     response.end(stdout + stderr);
   }
 }

 const server = http.createServer(
   (request, response) =>
     requestHandler(request, response, config.logs)
 );

 server.listen(config.port, (err) => {
   if (err) {
     return console.log('something bad happened', err)
   }
   console.log(`deploying server is listening on ${config.port}`)
 });
}

parseConfig(setupServer);
