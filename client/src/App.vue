<template>
  <div id="app">
    <div v-if="isChatRoom">
      <chatRoom :socket="socket" :userName="userName"/>
    </div>
    <div v-else>
      <form class="form">
        <h1>Karta</h1>
        <div>
          <input type="text" v-model="userName" placeholder="Plese enter your name">
        </div>
        <div>
          <input type="text" v-model="inviteRoomCode" placeholder="Join a game">
          <button class="btn" :disabled="!inviteRoomCode.length || !userName.length" @click="joinRoom()">Join</button>
        </div>
        <button class="btn" :disabled="!userName.length"  @click="createRoom()">Create room</button>
      </form>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import chatRoom from "./components/ChatRoom.vue"
export default {
  name: 'App',
  data() {
    return {
      socket: {},
      userName: '',
      inviteRoomCode: '',
      isChatRoom: false
    }
  },
  components: {
    chatRoom
  },
  created () {
    // connecting to the server
    this.socket = io('http://localhost:3000')

    // connect and create get user socket id : roomCode
    this.socket.on('connect', () => {
      console.log('user id connected: ' + this.socket.id)
    })
  },
  methods: {
    createRoom () {
      if (!this.userName.length) { 
        alert('User name cannot be empty')
        return
      }
      // alert('creating room: ' + this.playerName)
      this.socket.emit('createRoom', {userName: this.userName})
      this.isChatRoom = true
    },
    joinRoom () {
      if (!this.inviteRoomCode.length || !this.userName.length) {
        alert('Username and room code cannot be empty')
        return
      }
      // alert('joining room: ' + this.inviteRoomCode)
      this.socket.emit('joinRoom', {userName: this.userName, roomCode: this.inviteRoomCode})
      this.isChatRoom = true
    }
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
</style>
