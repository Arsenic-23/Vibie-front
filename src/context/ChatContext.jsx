// src/context/ChatContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export const ChatContext = createContext();

export function ChatProvider({ streamId, user, children }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!streamId) return;

    const q = query(
      collection(db, "streams", streamId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setMessages(list);
    });

    return () => unsub();
  }, [streamId]);

  async function sendMessage(text) {
    if (!text.trim() || !streamId || !user) return;

    await addDoc(collection(db, "streams", streamId, "messages"), {
      text,
      sender_id: user.uid,
      sender_name: user.name,
      sender_pic: user.profile_pic || null,
      timestamp: serverTimestamp(),
    });
  }

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
