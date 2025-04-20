import { useEffect, useState } from "react";

export default function useTelegramUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      setUser(tg.initDataUnsafe.user);
    }
  }, []);

  return user;
}