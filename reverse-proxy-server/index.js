const express = require('express');
const httpProxy = require('http-proxy');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8001;
const BASE_PATH = process.env.BASE_URL;

const proxy = httpProxy.createProxyServer();

app.use((req, res) => {
    console.log('Request received....')
    const hostName = req.headers.host;
    console.log('req headers ==>', req.headers);
    console.log('hostName ==>', hostName);
    const subDomain = hostName.split('.')[0];
    console.log('subDomain ==>', subDomain);
    const resolvesTo = `${BASE_PATH}/${subDomain}`;
    return proxy.web(req, res, { target: resolvesTo, changeOrigin: true});
});

proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url;
    if(url === '/') {
        proxyReq.path += 'index.html';
    }
    return proxyReq;
});

app.listen(port, () => {
    console.log(`Reverse proxy server is listening on port ${port}`);
});
