import React from "react";
import ChatBox from "../../components/Chat/ChatBox";
import { ChatProvider } from "../../context/ChatContext";

const StreamRoom = ({ streamId, user }) => {
  return (
    <ChatProvider streamId={streamId} user={user}>
      <div style={styles.container}>
        
        <div style={styles.left}>
          <h2>Now Playing + Queue + Stream UI</h2>
          {/* your existing UI goes here */}
        </div>

        <div style={styles.right}>
          <ChatBox />
        </div>

      </div>
    </ChatProvider>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },
  left: {
    flex: 3,
  },
  right: {
    flex: 1.2,
    borderLeft: "1px solid #222",
  },
};

export default StreamRoom;
