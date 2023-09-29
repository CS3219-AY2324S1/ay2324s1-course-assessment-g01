import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { User } from "../types/User";
import { useParams } from "react-router-dom";
import { getUserData } from "../services/UserAPI";
import { matchingServiceURL } from "../services/MatchingAPI";

const CollabRoomPage = () => {
  const { diff } = useParams();
  const { jwt } = useContext(UserContext);
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUserData,
  });
  
  useEffect(() => {
    const soc = new WebSocket(matchingServiceURL);
    console.log(user?.user_id);
    soc.addEventListener("open", (event) => {
      soc.send(JSON.stringify({
        "user_id": user?.user_id,
        "action": "Start",
        "difficulty": diff,
        "jwt": jwt
      }));
    })

    soc.addEventListener("message", (event) => {
      console.log(event.data);
    })

    soc.addEventListener("error", (event) => {
      console.log(event);
    })
  
    return () => {
      soc.close();
    };
  }, []);
  return (
    <div>
      <div>
        {user?.user_id}
      </div>
      <div>
        Collab Stub
      </div>
    </div>
  )
}

export default CollabRoomPage;

