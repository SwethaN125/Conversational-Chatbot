const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", sendMessage);

async function sendMessage() {
  const message = userInput.value.trim();

  if (message !== "") {
    appendMessage("You: " + message, "user-message");

    const response = await generateResponse(message);
    appendMessage("Chatbot: " + response, "chatbot-message");

    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

async function generateResponse(input) {
  try {
    const response = await fetch(`/api/chat?message=${encodeURIComponent(input)}`);
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error generating response:", error);
    return "An error occurred while generating the response.";
  }
}

function appendMessage(message, messageType) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", messageType);

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  messageContent.textContent = message;

  messageElement.appendChild(messageContent);
  chatBox.appendChild(messageElement);
}
