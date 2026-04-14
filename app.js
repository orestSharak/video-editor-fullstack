const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 10000;

const backend = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'server'),
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, PORT: '3000' }
});


app.use('/api', createProxyMiddleware({ target: 'http://127.0.0.1:3000', changeOrigin: true }));
app.use('/graphql', createProxyMiddleware({ target: 'http://127.0.0.1:3000', changeOrigin: true }));

app.use(express.static(path.join(__dirname, 'client/dist')));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Main Production Server running on port ${PORT}`);
});