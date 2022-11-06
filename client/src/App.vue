<template>
  <div>
    <div v-if="isChatRoom">
      <chatRoom :socket="socket" :userName="userName"/>
    </div>
    <div class="wrapper" v-else>
        <div>
          <h1>Chatt App</h1>
          <p>Aji ndwiw!</p>
        </div>

        <div>
          <form>
            <input type="text" placeholder="Enter Username" v-model="userName">
          </form>
          <form @submit.prevent="joinRoom()">
            <input type="text" placeholder="Enter Room Code" v-model="inviteRoomCode">
            <input type="submit" value="Join">
          </form>
        </div>

        <button class="btn" @click="createRoom()">Create Chatroom</button>
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
    console.log('hello')
    this.socket = io('https://randydandy.herokuapp.com/')

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


<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
   background-color: #fff;
}
.wrapper{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 500px;
  width: 400px;
  padding: 2rem 0 1rem 0;
  margin: 80px auto;
  background: #fff;
  background-color: #fff ;
  border-radius: 10px;
  text-align: center;
  box-shadow: -16px 25px 25px -7px rgba(0,0,0,0.75);
  -webkit-box-shadow: -16px 25px 25px -7px rgba(0,0,0,0.75);
  -moz-box-shadow: -16px 25px 25px -7px rgba(0,0,0,0.75);
}
h1{
  font-size: 2rem;
  color: #07001f;
}


/*styling the form fields*/
form {
  display: flex;
}
form input{
  outline: none;
  border: none;
  background: #dfe9f5;
  padding: 12px 14px;
  margin-bottom: 10px;
  border-radius: 10px;
}
form > input[type="submit"] {
	appearance: none;
	border: none;
	outline: none;
  background: none;
	display: block;
	padding: 10px 15px;
	border-radius: 8px 8px 8px 0px;
	background-color: #6952ea;  
	color: #FFF;
	font-size: 18px;
	font-weight: 700;
  cursor: pointer;
}


button{
  background:   #6952ea;
  color: #fff;
}
.btn {
  font-size: 1.1rem;
  margin-top: 1rem;
  padding: 8px 0;
  border-radius: 5px; 
  border: none;
  width: 85%;
  cursor: pointer;
  width: 100%;
}
</style>

