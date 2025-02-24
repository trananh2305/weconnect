import FriendRequests from "@components/FriendRequests";
import PostCreation from "@components/PostCreation";
import PostList from "@components/PostList";
import SideBar from "@components/SideBar";

const HomePage = () => {
  return (
    <div className="container">
      <SideBar />
      <div className="flex-1 flex flex-col gap-4">
        <PostCreation />
        <PostList />
      </div>
      <div className="w-72 hidden sm:block">
        <FriendRequests />
      </div>
    </div>
  );
};

export default HomePage;
