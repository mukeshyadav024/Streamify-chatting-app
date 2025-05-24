import {  useQuery} from "@tanstack/react-query";
import {
  getOutgoingFriendsReqs,
  getRecommendedUser,
  getUserFriends,
} from "../lib/api";
import {  useEffect, useState } from "react";
import {  UserIcon } from "lucide-react";
import { Link } from "react-router";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

import RecommendationUser from "../components/RecommendationUser";
import NoRecommendationUser from "../components/NoRecommendationUser";

const HomePage = () => {

  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });
  const { data: recommendedUser = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["recommendedUser"],
    queryFn: getRecommendedUser,
  });
  const { data: outgoingFriendsReqs = [] } = useQuery({
    queryKey: ["outgoingFriendsReqs"],
    queryFn: getOutgoingFriendsReqs,
  });
 
  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendsReqs && outgoingFriendsReqs.length > 0) {
      outgoingFriendsReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendsReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UserIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>
        {/* SHOW FRIENDS IF HAVE ANY  */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              
              <FriendCard key={friend._id} friend={friend} />
             
            ))}
          </div>
        )}

        {/* RECOMMENDED USERS  */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Learner
                </h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your
                  profile
                </p>
              </div>
            </div>
          </div>

          {/* SHOW USERS IF EXISTS  */}
          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUser.length === 0 ? (
           <NoRecommendationUser/>
          ) : (
            <RecommendationUser recommendedUser={recommendedUser} outgoingRequestsIds={outgoingRequestsIds} />
          )}
        </section>

      </div>
    </div>
  );
};

export default HomePage;
