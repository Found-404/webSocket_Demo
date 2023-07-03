const express = require('express')
const app = express()
const port = 3000
// 托管静态资源-express.static()
app.use(express.static('public'))
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`http://localhost:${port}`))

// 引入 ws，并且解构使用我们需要的 WebSocketServer        
const { WebSocketServer, WebSocket } = require('ws');
// import { WebSocketServer } from 'ws';
// 创建WebSocketServer的实例wss，并指定端口号
const wss = new WebSocketServer({ port: 8080 });
// 通过实例wss进行监听
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    // 客户端
    ws.on('message', function message(data) {
        console.log('received: %s', data);
        // 服务器广播
        // 广播到所有连接的WebSocket客户端，包括其自身。
        console.log('连接了多少个', wss.clients.size)
        wss.clients.forEach(function each(client) {
            // 判断当前连接服务端的所有客户端的ws用户。
            // client!==ws 表示不是当前发送的用户[不要自己广播自己]
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                // binary表示数据是否是二进制。binary:false表示不是二进制
                client.send(data, { binary: false });
            }
        });
    });
    // 第一次连接成功后发送的消息。
    ws.send('');
});
