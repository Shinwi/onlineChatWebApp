const port = process.env.PORT || 3000
const {addUser, getUsersInRoom, getUserInRoom, addAvatarToUser, getUsersAvatars} = require('./users')

console.log('connected in port: ' + port)

const io = require('socket.io')(port, {
     cors: {
         origin: ['http://localhost:8080','https://randydandy.herokuapp.com/', 'http://localhost:8081']
     }
})
// console.log(io)
console.log('connected to port: ' + port)

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
        
        if (getUsersInRoom(payload.roomCode).length >= 2) {
            console.log('room full: ' + payload.roomCode)
            socket.emit('roomFull')
            return
        }
        console.log(payload)
        let roomCode = payload.roomCode
        let userName = payload.userName
        // let roomCode = payload.roomCode
        // let userName = payload.userName
        addUser(socket.id, userName, roomCode)
        socket.join(roomCode)

        let allUsersInRoom = getUsersInRoom(roomCode)
        io.sockets.in(roomCode).emit('roomInfoUpdate', {roomCode, userName, allUsersInRoom })
    })

    // sending messages in given chatroom
    socket.on('sendMessage', (payload) => {
        socket.to(payload.roomCode).emit('receivedMessage', {receivedMessage: payload.message})
    })

    // fired when the user avatar is loaded
    socket.on('userAvatarLoaded', (payload) => {
        addAvatarToUser(payload.userId, payload.userAvatar, payload.roomCode)
        let allUsersAvatars = getUsersAvatars(payload.roomCode)
        io.sockets.in(payload.roomCode).emit('usersAvatars', {allUsersAvatars: allUsersAvatars})
    })

    // fired when a user change their activity status
    socket.on('activityStatusChange', (payload) => {
        console.log(payload)
        socket.to(payload.roomCode).emit('statusChange', {userId: payload.userId, status: payload.status})
    })
})
