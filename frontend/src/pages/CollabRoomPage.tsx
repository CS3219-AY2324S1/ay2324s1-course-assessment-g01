import { useQuery } from "@tanstack/react-query";
import { User } from "../types/User";
import { getUserData } from "../services/UserAPI";

const CollabRoomPage = () => {
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUserData,
  });

  
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

