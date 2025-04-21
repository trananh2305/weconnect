import UserCard from "@components/UserCard";
import { useLazyLoadSearchFriends } from "@hooks/index";

import { useLocation } from "react-router-dom";

const SearchUserPage = () => {
  const location = useLocation();

  const { friends } = useLazyLoadSearchFriends({
    searchQuery: location?.state?.searchTerm,
  });

  return (
    <div className="container flex-col">
      <p className="font-bold text-xl">Search</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(friends || []).map((user) => (
          <UserCard
            key={user._id}
            id={user._id}
            fullName={user.fullName}
            isFriend={user.isFriend}
            requestSent={user.requestSent}
            requestReceived={user.requestReceived}
            imageUrl={user.image}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchUserPage;
