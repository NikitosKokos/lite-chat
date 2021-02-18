const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{
    cors: {
      origin: 'http://localhost:3000',
    }
  });


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'client/build')));

const rooms = new Map();

app.get('/rooms/:id',(req,res) => {
    const {id: roomId} = req.params;
    const obj = rooms.has(roomId) ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
        password: rooms.get(roomId).get('password'),
    }: { users: [], messages: [],password: null,};
    res.json(obj);
});

app.get('/rooms/:id/password',(req,res) => {
    const {id: roomId} = req.params;
    const obj = rooms.has(roomId) ? {
        password: rooms.get(roomId).get('password'),
    }: { password: null,};
    res.json(obj);
});

app.post('/rooms/:id/password',(req,res) => {
    const {id: roomId} = req.params;
    const {password} = req.body;
    rooms.get(roomId).set('password', password);
    res.send();
});

app.post('/rooms', (req,res) => {
    const {roomId} = req.body;
    if(!rooms.has(roomId)){
        rooms.set(roomId, new Map([
            ['users', new Map()],
            ['messages', []],
        ]));
    }
    res.send();
})

io.on('connection', socket => {
    socket.on('ROOM:JOIN', ({roomId,userName}) => {
        socket.join(roomId);
        rooms.get(roomId).get('users').set(socket.id, userName);
        const users = [...rooms.get(roomId).get('users').values()];
        socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
    });

    socket.on('ROOM:NEW_MESSAGE', ({roomId,userName, text}) => {
        const obj = {
            userName,
            text
        }
        rooms.get(roomId).get('messages').push(obj);
        socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', obj);
    });

    socket.on('ROOM:LEAVE', () => {
        rooms.forEach((value,roomId) => {
            if(value.get('users').delete(socket.id)){
                const users = [...value.get('users').values()];
                socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
            }
        })
    });

    socket.on('disconnect', () => {
        rooms.forEach((value,roomId) => {
            if(value.get('users').delete(socket.id)){
                const users = [...value.get('users').values()];
                socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
            }
        })
    });
});

const PORT = process.env.PORT || 8888;
server.listen(PORT, (err) => {
    if(err){
        throw Error();
    }
    console.log('Server started');
});

