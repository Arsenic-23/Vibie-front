import { useChat } from "../../context/ChatContext";

const MessagesList = () => {
  const { messages } = useChat();

  return (
    <div style={styles.list}>
      {messages.map((msg) => (
        <div key={msg.id} style={styles.msg}>
          <strong>{msg.name}: </strong> {msg.text}
        </div>
      ))}
    </div>
  );
};

const styles = {
  list: {
    flex: 1,
    overflowY: "auto",
    padding: "12px",
  },
  msg: {
    marginBottom: "8px",
  },
};

export default MessagesList;
