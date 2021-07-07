  
<template>
  <div class="view login" v-if="state.username === '' || state.username === null">
    <form class="login-form" @submit.prevent="Login">
      <div class="form-inner">
        <h1>Fire<span>Chat</span></h1>
        <!-- <label for="username">Username</label> -->
        <input 
          type="text" 
          v-model="inputUsername" 
          placeholder="Username" />
        <input 
          type="submit" 
          value="Login" />
      </div>
    </form>
  </div>
  
  <div class="view chat" v-else>
    <header>
      <button class="logout" @click="Logout">Logout</button>
      <h1>Welcome, {{ state.username }}</h1>
    </header>
    
    <section class="chat-box">
      <div 
        v-for="message in state.messages" 
        :key="message.key" 
        :class="(message.username == state.username ? 'message current-user' : 'message')">
        <div class="message-inner">
          <div class="username">{{ message.username }}</div>
          <div class="content">{{ message.content }}</div>
        </div>
      </div>
    </section>

    <footer>
      <form @submit.prevent="SendMessage">
        <input 
          type="text" 
          v-model="inputMessage" 
          placeholder="Write a message..." />
        <input 
          type="submit" 
          value="Send" />
      </form>
    </footer>
  </div>
</template>

<script>
import { reactive, onMounted, ref } from 'vue';
import db from './db';
export default {
  setup () {
    const inputUsername = ref("");
    const inputMessage = ref("");
    const state = reactive({
      username: "",
      messages: []
    });
    const Login = () => {
      if (inputUsername.value != "" || inputUsername.value != null) {
        state.username = inputUsername.value;
        inputUsername.value = "";
      }
    }
    const Logout = () => {
      state.username = "";
    }
    const SendMessage = () => {
      const messagesRef = db.database().ref("messages");
      if (inputMessage.value === "" || inputMessage.value === null) {
        return;
      }
      const message = {
        username: state.username,
        content: inputMessage.value
      }
      messagesRef.push(message);
      inputMessage.value = "";
    }
    onMounted(() => {
      const messagesRef = db.database().ref("messages");
      messagesRef.on('value', snapshot => {
        const data = snapshot.val();
        let messages = [];
        Object.keys(data).forEach(key => {
          messages.push({
            id: key,
            username: data[key].username,
            content: data[key].content
          });
        });
        state.messages = messages;
      });
    });
    return {
      inputUsername,
      Login,
      state,
      inputMessage,
      SendMessage,
      Logout
    }
  }
}
</script>

<style lang="scss">
* {
	font-family: Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

.view {
	display: flex;
	justify-content: center;
	min-height: 100vh;
	background-color: #fff;
	
	&.login {
		align-items: center;
		.login-form {
			display: block;
			width: 100%;
			padding: 15px;
			
			.form-inner {
				display: flex;
				flex-direction: column;
				justify-content: center;
				height: 620px;
				background-color: #1c1e1f;
				padding: 50px 15px;
				border-radius: 16px;
				box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);

				h1 {
					color: #fafafa;
					font-size: 46px;
					text-align: center;
					margin-bottom: 30px;
				}

				span {
					color: #af5ae8;
					font-size: 50px;
				}

				input[type="text"] {
					appearance: none;
					border: none;
					outline: none;

					display: block;
					width: 100%;
					padding: 15px 20px;
					border-radius: 8px;
					margin-bottom: 20px;
					
					color: #333;
					font-size: 18px;

					border-radius: 82px;
					background: #13171a;
					box-shadow: inset 5px 5px 6px #0f1214,
								inset -5px -5px 6px #171c20;


					transition: 0.4s;

					&::placeholder {
						color: #979797;
						font-size: 14px;
						transition: 0.4s;
					}
				}

				input[type="submit"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;

					display: block;
					width: 100%;
					padding: 15px;
					background: linear-gradient(#af5ae8, #855be5);
					border-radius: 82px;

					color: #fafafa;
					font-size: 16px;
					font-weight: 600;
				}

				&:focus-within {
					input[type="text"] {
						background-color: #FFF;
						box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);

						&::placeholder {
							color: #af5ae8;
						}
					}
				}
			}
		}
	}

	&.chat {
		flex-direction: column;

		header {
			position: relative;
			display: block;
			width: 100%;
			padding: 50px 30px 10px;

			.logout {
				position: absolute;
				top: 15px;
				right: 15px;
				appearance: none;
				border: none;
				outline: none;
				background: none;
				
				color: #FFF;
				font-size: 18px;
				margin-bottom: 10px;
				text-align: right;
			}

			h1 {
				color: #FFF;
			}
		}

		.chat-box {
			border-radius: 24px 24px 0px 0px;
			background-color: #1f2122;
			box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
			flex: 1 1 100%;
			padding: 30px;

			.message {
				display: flex;
				margin-bottom: 15px;
				
				.message-inner {
					.username {
						color: #888;
						font-size: 16px;
						margin-bottom: 5px;
						padding: 0 15px;
					}

					.content {
						display: inline-block;
						padding: 15px 25px;
						border-radius: 42px;

						background: linear-gradient(145deg, #111517, #14191c);
						box-shadow:  5px 5px 6px #0f1214,
									-5px -5px 6px #171c20;

						color: #fafafa;
						font-size: 18px;
						line-height: 1.2em;
						text-align: left;
					}
				}

				&.current-user {
					margin-top: 30px;
					justify-content: flex-end;
					text-align: right;

					.message-inner {
						max-width: 75%;

						.content {
							color: #fff;
							background: linear-gradient(#af5ae8, #855be5);
							box-shadow:  5px 5px 6px #0f1214,
                                        -5px -5px 6px #171c20;
						}
					}
				}
			}
		}

		footer {
			position: sticky;
			bottom: 0px;
			background-color: #1c1e1f;
			padding: 30px;
			box-shadow: 5px 5px 6px #0f1214;

			form {
				display: flex;

				input[type="text"] {
					flex: 1 1 100%;

					appearance: none;
					border: none;
					outline: none;
					background: none;

					display: block;
					width: 100%;
					padding: 10px 15px;
					border-radius: 8px 0px 0px 8px;
					
					color: #af5ae8;
					font-size: 18px;

					background: #13171a;
					box-shadow: inset 5px 5px 6px #0f1214,
								inset -5px -5px 6px #171c20;

					transition: 0.4s;

					&::placeholder {
						color: #979797;
						font-size: 16px;
						transition: 0.4s;
					}
				}
				
				input[type="submit"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;

					display: block;
					padding: 10px 15px;
					border-radius: 0px 8px 8px 0px;

					background-color: #af5ae8;

					color: #FFF;
					font-size: 18px;
					font-weight: 700;
				}
			}
		}
	}
}
</style>
