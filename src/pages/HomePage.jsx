import FriendRequests from "@components/FriendRequests";
import PostCreation from "@components/PostCreation";
import PostList from "@components/PostList";
import SideBar from "@components/SideBar";

const HomePage = () => {
  return (
    <div className="flex gap-4 p-6 bg-dark-200 ">
      <SideBar />
      <div className="flex-1">
        <PostCreation />
        <PostList />
      </div>
      <div className="w-64 hidden sm:block">
        <FriendRequests />
      </div>
    </div>
  );
};

export default HomePage;
