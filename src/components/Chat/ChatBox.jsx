import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";

const ChatBox = () => {
  return (
    <div style={styles.container}>
      <MessagesList />
      <MessageInput />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    borderLeft: "1px solid #333",
    background: "#111",
  },
};

export default ChatBox;
