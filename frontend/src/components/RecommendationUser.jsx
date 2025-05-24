
import { sendFriendRequest } from '../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from 'lucide-react';
import { getLanguageFlag } from './FriendCard';
import { capitalize } from '../lib/utils';

const RecommendationUser = ({recommendedUser,outgoingRequestsIds}) => {
const queryClient = useQueryClient()
     const { mutate: sendRequestMutation, isPending } = useMutation({
        mutationFn: sendFriendRequest,
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: ["outgoingFriendsReqs"] }),
      });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recommendedUser.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-4 space-y-1 ">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>
                        {/* USER NAME AND LOCATION */}
                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* LANGUAGE WITH FLAGS  */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary ">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitalize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline text-xs">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitalize(user.learningLanguage)}
                        </span>
                      </div>
                      {/* USER BIO  */}
                      {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                      {/* ACTION BUTTON TO SEND FRIEND REQ  */}
                      <button className={`btn w-full mt-1 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`}
                      onClick={()=>{sendRequestMutation(user._id)}}
                      disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent?(<>
                        <CheckCircleIcon className="size-4 mr-2"/>Request Sent</>):(
                          <>
                          <UserPlusIcon className="size-4 mr-2"/>
                          Send Friend Request
                          </>
                        )}

                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
  )
}

export default RecommendationUser