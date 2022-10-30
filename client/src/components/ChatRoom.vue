<template>
  <div>
    <div class="view chat">
        <header>
            <div class="chat-room-info">
                <h1>Welcome, {{ userName }}!</h1>
                <h2>Room code: {{ roomCode }}</h2>
            </div>
        </header>
        <section class="chat-box">
            <div class="waiting" v-show="this.usersInRoom.length < 2">
                <div style="margin-bottom:2rem;">
                    <h3>Waiting for other user to join room...</h3>
                </div>
                <div class="lds-ring">
                    <div></div>
                </div>
            </div>
            <div class="message" id="add-here">
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
    this.socket.on('roomInfoUpdate', data => {
        this.roomCode = data.roomCode
        this.usersInRoom = data.allUsersInRoom
    }),
    this.socket.on('receivedMessage', data => {
        this.displayReceiverMessage(data.receivedMessage)
    })
  },
  methods: {
    disconnect () {
        alert('disconnecting')
    },
    sendMessage () {
        if (this.chatMessage.length === 0) {
            alert('Message cannot be empty!')
            return
        }

        this.displaySenderMessage(this.chatMessage)
        this.socket.emit('sendMessage', {message: this.chatMessage, roomCode: this.roomCode})
        this.chatMessage = ''
    },
    showMessageInChatBox (username, message, isCurrent) {
        let messageDiv = `
        <div class="message-inner ${isCurrent? 'current-user':''}">
             <div class="username">${username}</div>
             <div class="content">${message}</div>
        </div>
        `
        // show the message div
        document.getElementById('add-here').innerHTML += messageDiv
    },
    displaySenderMessage (message) {
        let sender = this.usersInRoom.filter(u => u.userId === this.socket.id)
        this.showMessageInChatBox(sender[0].userName, message, true)
    },
    displayReceiverMessage (message) {
        let receiver = this.usersInRoom.filter(u => u.userId !== this.socket.id)
        this.showMessageInChatBox(receiver[0].userName, message, false)
    }
  }
}
</script>

<style>
*{
    margin: 0;
    padding: 0;
}
.view {
    display: flex;
	justify-content: center;
	min-height: 100vh;
	background-color: #6952ea;
}
.chat {
    flex-direction: column;
}
header {
    position: relative;
	display: block;
    padding: 50px 30px 10px;
}
header > .chat-room-info {
    display: flex;
    justify-content: space-between;
    width: 55%;
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
.waiting {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3rem;
}
.view > .chat-box {
    border-radius: 24px 24px 0px 0px;
	background-color: #FFF;
	box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
	flex: 1 1 100%;
	padding: 30px;
}
.chat-box > .message {
    display: flex;
    flex-direction: column;
}
.message-inner {
    margin-bottom: 0.5em;
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
.chat-box > .message .current-user > .content {
   background-color: #6952ea;
   color: white;
} 

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
	background-color: #6952ea;  
	color: #FFF;
	font-size: 18px;
	font-weight: 700;
}

/**
    half circle spinner to show while data is loading.
    usage: 
    <div class="lds-ring"></div>
*/
.lds-ring {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid #6952ea;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #6952ea transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

