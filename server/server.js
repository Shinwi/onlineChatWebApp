const {addUser, getUsersInRoom} = require('./users')

// init the socketio connection
const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080', 'http://localhost:8081']
    }
})

io.on('connection', socket => {
    console.log(socket.id + ' just connected!')

    // creating a room and adding user to it
    socket.on('createRoom', (payload) => {
        let roomCode = socket.id.slice(-6)
        let userName = payload.userName
        // registering the new player
        addUser(socket.id, userName, roomCode)
        // adding user to the room
        socket.join(roomCode)
        let allUsersInRoom = getUsersInRoom(roomCode)

        // sending back to client info about created room
        io.sockets.in(roomCode).emit('roomInfoUpdate', {roomCode, userName, allUsersInRoom})
    })

    // joining rooms
    socket.on('joinRoom', (payload) => {
        console.log(payload)
        let roomCode = payload.roomCode
        let userName = payload.userName
        addUser(socket.id, userName, roomCode)
        socket.join(roomCode)

        let allUsersInRoom = getUsersInRoom(roomCode)
        io.sockets.in(roomCode).emit('roomInfoUpdate', {roomCode, userName, allUsersInRoom })
    })

    // sending messages in given chatroom
    socket.on('sendMessage', (payload) => {
        socket.to(payload.roomCode).emit('receivedMessage', {receivedMessage: payload.message})
    })
})
