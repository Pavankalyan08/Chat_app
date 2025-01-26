const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

// Prompt for the user's name and emit a new-user event to the server
let name;
while(!name) {
    name = prompt('What is your name?');
}
appendMessage('You joined');
socket.emit('new-user', name);

// Listen for chat-message events from the server
socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`);
});

// Listen for user-connected events from the server
socket.on('user-connected', name => {
  appendMessage(`${name} connected`);
});

// Listen for user-disconnected events from the server
socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`);
});

// Handle form submission for sending messages
messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value;
  if (message.trim()) {
    appendMessage(`You: ${message}`);
    socket.emit('send-chat-message', message);
    messageInput.value = '';
  }
});

// Function to append messages to the message container
function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
  // Scroll to the latest message
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Console logs for debugging connection issues
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});
