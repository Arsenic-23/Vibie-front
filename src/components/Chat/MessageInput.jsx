import { useChat } from "../../context/ChatContext";
import { useState } from "react";

const MessageInput = () => {
  const { sendMessage } = useChat();
  const [text, setText] = useState("");

  const handleSend = () => {
    sendMessage(text);
    setText("");
  };

  return (
    <div style={styles.container}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a message..."
        style={styles.input}
      />
      <button onClick={handleSend} style={styles.btn}>Send</button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    padding: "8px",
    background: "#222",
  },
  input: {
    flex: 1,
    padding: "8px",
  },
  btn: {
    marginLeft: "8px",
  },
};

export default MessageInput;
