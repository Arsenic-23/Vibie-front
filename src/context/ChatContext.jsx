import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase"; 
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export const ChatContext = createContext();

export const ChatProvider = ({ streamId, user, children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!streamId) return;

    const q = query(
      collection(db, "streams", streamId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [streamId]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    await addDoc(collection(db, "streams", streamId, "messages"), {
      text,
      userId: user?.user_id,
      name: user?.name,
      timestamp: serverTimestamp(),
    });
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
