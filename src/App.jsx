import { useState } from "react";
import "./App.css";

const API_URL = "https://localhost:7038/api/Chat";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: "bot",
          text: data.response,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: "bot",
          text: "Sorry, I could not connect to the chatbot server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="app">
      <div className="chat-container">

        <div className="chat-header">
          <h1>AI Chatbot</h1>
          <p>Powered by Ollama</p>
        </div>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="welcome">
              <h2>Hello 👋</h2>
              <p>Ask me anything.</p>
            </div>
          )}

          {messages.map((chatMessage, index) => (
            <div
              key={index}
              className={`message-row ${chatMessage.sender}`}
            >
              <div className="message">
                {chatMessage.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row bot">
              <div className="message typing">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          <button
            onClick={sendMessage}
            disabled={loading || !message.trim()}
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;