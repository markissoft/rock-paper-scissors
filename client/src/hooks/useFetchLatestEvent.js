import { useContext, useEffect, useState } from "react";
import { GameContext } from "../context/GameContext";
import { baseUrl, getRequest } from "../utils/service";

export const useFecthLatestevent = (Game) => {
  const { newevent, notifications } = useContext(GameContext);
  const [latestevent, setLatestevent] = useState(null);

  useEffect(() => {
    const getevents = async () => {
      const response = await getRequest(`${baseUrl}/events/${Game?._id}`);

      if (response.error) {
        return console.log("Error getting events...", error);
      }

      const lastevent = response[response?.length - 1];

      setLatestevent(lastevent);
    };
    getevents();
  }, [newevent, notifications]);

  return { latestevent };
};
