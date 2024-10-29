import { useEffect, useState } from "react";

export const useCLock = () => {
    const date = new Date();
  const [hours, setHours] = useState(date.getHours());
  const [minutes, setMinutes] = useState(date.getMinutes());
  const [isPM, setIsPM] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      setHours(date.getHours());
      setMinutes(date.getMinutes());
      setIsPM(date.getHours() >= 12);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    clockHours: hours,
    clockMinutes: minutes,
    isPM,
  };
};
