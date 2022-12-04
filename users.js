const Users = []
const UsersAvatars = {}
/*
    roomCode: {
        s1: av1,
        s2: av2
    }
*/

function addUser (userId, userName, roomCode) {
    const newUser = {userId, userName, roomCode}
    Users.push(newUser)
    console.log('Users')
    console.log(Users)
}

function addAvatarToUser(userId, userAvatar, roomCode) {
    if (!Object.keys(UsersAvatars).includes(roomCode)) {
        UsersAvatars[roomCode]= {}
    }
    UsersAvatars[roomCode][userId] = userAvatar
    console.log('\nAVATARS')
    console.log(UsersAvatars)
}

function getUsersAvatars (roomCode) {
    if (!Object.keys(UsersAvatars).includes(roomCode)) {
        console.log('this roomCode does not exist, no avatars found')
    }
    return UsersAvatars[roomCode]
}

function getUserInRoom (userId) {
    return Users.filter(p => p.userId == userId)
}

function getUsersInRoom (roomCode) {
    return Users.filter(u => u.roomCode === roomCode)
}

module.exports = {addUser, getUsersInRoom, getUserInRoom, addAvatarToUser, getUsersAvatars}