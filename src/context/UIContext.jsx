// src/context/UIContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Create a Context for managing the UI state
const UIContext = createContext();

// Custom hook to use the UI context
export const useUIContext = () => {
  return useContext(UIContext);
};

export const UIProvider = ({ children }) => {
  const [isSongQueueOpen, setIsSongQueueOpen] = useState(false);

  return (
    <UIContext.Provider value={{ isSongQueueOpen, setIsSongQueueOpen }}>
      {children}
    </UIContext.Provider>
  );
};