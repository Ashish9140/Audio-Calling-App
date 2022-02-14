const express = require('express');
const app = express();
const server = require('http').createServer(app);
const SocketConnection = require('./socket');
const path = require('path');
const Jimp = require('jimp');
app.use('/uploads', express.static('uploads'));
app.use(express.json({ limit: '8mb' }));
app.use(express.json());

app.post("/api/upload/file", async (req, res) => {
    const avatar = req.body.avatar;
    const buffer = Buffer.from(avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
    const imagePath = `${Date.now()}.${Math.round(
        Math.random() * 1e9
    )}.png`;
    try {
        const jimpResp = await Jimp.read(buffer);
        jimpResp.resize(150, Jimp.AUTO).write(path.resolve(__dirname, `./uploads/${imagePath}`));
    } catch (err) {
        res.status(500).json({ message: 'Could Not Process The Image' });
    }
    res.json({ url: `uploads/${imagePath}` });
})

// socket connection
const io = require('socket.io')(server);
SocketConnection(io);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));
}

server.listen(PORT, () => {
    console.log("Server is active");
})