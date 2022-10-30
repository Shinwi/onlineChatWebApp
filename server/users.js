const Users = []

function addUser (userId, userName, roomCode) {
    //TODO: check later if we can add user or not, ie: is room full or not
    const newUser = {userId, userName, roomCode}
    Users.push(newUser)
    console.log('players')
    console.log(Users)
}

function getUsersInRoom (roomCode) {
    return Users.filter(u => u.roomCode === roomCode)
}

module.exports = {addUser, getUsersInRoom}