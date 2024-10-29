import { useEffect, useState } from "react";

export const useCLock = () => {
    const date = new Date();
  const [hours, setHours] = useState(date.getHours());
  const [minutes, setMinutes] = useState(date.getMinutes());

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      setHours(date.getHours());
      setMinutes(date.getMinutes());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    clockHours: hours,
    clockMinutes: minutes,
  };
};
