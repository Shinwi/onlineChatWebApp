<template>
  <div>
    <!-- <h4>chat room {{ roomCode }}</h4> -->
    <!-- <h4>chat room {{ roomCode }}</h4>
    <div class="usersList">
        <div v-for="(user, idx) in this.usersInRoom" :key="user.userId">
            <h4>User {{ idx + 1}}: {{ user.userName }}</h4>
        </div>
    </div> -->

    <!-- styling the chat -->
    <div class="view chat">
        <header>
            <button class="logout">Disconnect</button>
            <h1>Welcome, {{ userName }}</h1>
        </header>
        <section class="chat-box">
            <div class="message">
                <div class="message-inner">
                    <div class="username">dino</div>
                    <div class="content">this my text wasuup</div>
                </div>
            </div>
            <div class="message current-user" id="addMess">
                <!-- <div class="message-inner">
                    <div class="username">dino</div>
                    <div class="content" id="message-container"></div>
                </div> -->
            </div>
        </section>
        <footer>
            <form @submit.prevent="sendMessage()">
                <input type="text" v-model="chatMessage" placeholder="Enter your message...">
                <input type="submit" value="Send">
            </form>
        </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatRoom',
  props: ["socket", "userName"],
  data () {
    return {
        roomCode: '',
        chatMessage:'',
        usersInRoom: [],
    }
  },
  created () {
    console.log('CHAT room')
    console.log(this.socket)
    console.log(this.userName)

    this.socket.on('roomInfoUpdate', data => {
        this.roomCode = data.roomCode
        this.usersInRoom = data.allUsersInRoom
    }),
    this.socket.on('receivedMessage', data => {
        this.displayReceiverMessage(data.receivedMessage)
    })

    // getting the user name
    // this.userName = this.usersInRoom.filter(u => u.userId === this.socket.id)
    // console.log(this.usersInRoom)
  },
  computed () {
    // isCurrentUser () {
    //     // checks if the username belongs to the current user
    // }
  },
  methods: {
    sendMessage () {
        if (this.chatMessage.length === 0) return
        this.displaySenderMessage(this.chatMessage)
        this.socket.emit('sendMessage', {message: this.chatMessage, roomCode: this.roomCode})
        this.chatMessage = ''
    },
    displaySenderMessage (message) {
        // create message elemts
        let messageElement = document.createElement('div')
        // <!-- <div class="message-inner">
        //             <div class="username">dino</div>
        //             <div class="content" id="message-container"></div>
        //         </div> -->

        // let messageElement = document.createElement('p')
        // messageElement.setAttribute('style', 'color:white;')
        // let sender = this.usersInRoom.filter(u => u.userId === this.socket.id)
        // messageElement.innerHTML = `${sender[0].userName}: ${message}`
        // document.getElementById('message-container').appendChild(messageElement)
    },
    // this will only work when there is only 2 people in the room
    displayReceiverMessage (message) {
        let messageElement = document.createElement('p')
        messageElement.setAttribute('style', 'color:white;')
        let receiver = this.usersInRoom.filter(u => u.userId !== this.socket.id)
        messageElement.innerHTML = `${receiver[0].userName}: ${message}`
        document.getElementById('message-container').appendChild(messageElement)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.usersList {
  border: thin solid rebeccapurple;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: auto;
  /*we can increase height here later??*/
  /*this div can be container to the users names and profile pic??*/
}

.view {
    display: flex;
	justify-content: center;
	min-height: 100vh;
	background-color: #ea526f;
}
.chat {
    flex-direction: column;
}
header {
    position: relative;
	display: block;
	width: 100%;
    padding: 50px 30px 10px;
}
header > h1 {
    color: white;
}
.logout {
    border: none;
    position: absolute;
	top: 15px;
	right: 4rem;
	appearance: none;
	outline: none;
	background: none;			
	color: #FFF;
	font-size: 18px;
	margin-bottom: 10px;
	text-align: right;
}

/* styling the chat box*/
.view > .chat-box {
    border-radius: 24px 24px 0px 0px;
	background-color: #FFF;
	box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
	flex: 1 1 100%;
	padding: 30px;
}
.chat-box > .message {
    display: flex;
    margin-bottom: 15px;
}
.chat-box > .message > .message-inner > .username {
    color: #888;
    font-size: 16px;
	margin-bottom: 5px;
	padding-left: 15px;
	padding-right: 15px;
}
.chat-box > .message > .message-inner > .content {
    display: inline-block;
	padding: 10px 20px;
	background-color: #F3F3F3;
	border-radius: 999px;

	color: #333;
	font-size: 18px;
	line-height: 1.2em;
	text-align: left;
}

/* styling the current user */
.current-user {
    margin-top: 30px;
	justify-content: flex-end;
	text-align: right;
}
.current-user > .message-inner {
    max-width: 75%;
}
/* TODO: change the background color of the current user bubble */
/* .chat-box > .message .current-user > .message-inner > .content {
   background-color: #ea526f;
} */

/* styling the footer */
footer {
    position: sticky;
	bottom: 0px;
	background-color: #FFF;
    padding: 30px;
	box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
}
footer > form { 
    display: flex;
}
form > input[type="text"] {
    flex: 1 1 100%;

	appearance: none;
	border: none;
	outline: none;
	background: none;

	display: block;
	width: 100%;
	padding: 10px 15px;
	border-radius: 8px 0px 0px 8px;
					
	color: #333;
	font-size: 18px;

	box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
	background-color: #F3F3F3;

	transition: 0.4s;
}
form > input[type="submit"] {
	appearance: none;
	border: none;
	outline: none;
    background: none;
	display: block;
	padding: 10px 15px;
	border-radius: 0px 8px 8px 0px;
    /* TODO: change color to some other theme */
	background-color: #ea526f;  
	color: #FFF;
	font-size: 18px;
	font-weight: 700;
}
</style>

