import * as WebSocket from 'ws';
import http, { IncomingMessage, Server } from 'http';
import { docs, setupWSConnection } from './utils';
const port = (process.env['PORT'] || 3000) as number;

const server: Server = http.createServer((request, response) => {
    if (request.url === '/health') {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(
            JSON.stringify({
                response: 'ok'
            })
        );
        return;
    }
});
const wss = new WebSocket.Server({ server });

wss.on('connection', (conn: WebSocket, req: IncomingMessage) => {
    setupWSConnection(conn, req, { gc: false });
});

// log some stats
setInterval(() => {
    let conns = 0;
    docs.forEach((doc) => {
        conns += doc.conns.size;
    });
    const stats = {
        conns,
        docs: docs.size,
        websocket: `ws://localhost:${port}`,
        http: `http://localhost:${port}`
    };
    console.log(`${new Date().toISOString()} Stats: ${JSON.stringify(stats)}`);
}, 10000);

server.listen(port, '0.0.0.0');

console.log(`Listening to http://localhost:${port}`);
