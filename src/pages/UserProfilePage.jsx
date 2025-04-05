import { Avatar, Tab, Tabs } from "@mui/material";
import { useParams } from "react-router-dom";
import { theme } from "@configs/muiConfig";
import PostCreation from "@components/PostCreation";
import { useUserInfo } from "@hooks/index";
import { useGetUserInfoByIdQuery } from "@services/userApi";
import Loading from "@components/Loading";
import PostList from "@components/PostList";

const UserProfilePage = () => {
  const { userId } = useParams();
  const { _id } = useUserInfo();

  const { data = {}, isLoading } = useGetUserInfoByIdQuery(userId);

  if (isLoading) {
    return <Loading />;
  }

  const isMyProfile = userId === _id;
  return (
    <div className="container flex-col ">
      <div className="card p-0 relative">
        <img
          className="h-36 sm:h-80 object-cover"
          src="https://placehold.co/1920x540"
          alt=""
        />
        <div className="flex gap-3 mb-3 px-6  sm:items-end absolute transform sm:-translate-y-1/2 sm:flex-row flex-col items-center w-full -translate-y-1/3  ">
          <Avatar className="!bg-primary-main sm:!size-44 !size-24 border-4 border-white !text-6xl">
            {data?.fullName[0]?.toUpperCase()}
          </Avatar>
          <div className="text-center sm:text-left ">
            <p className="font-bold truncate text-2xl sm:text-3xl text-">Anh</p>
            <p className="text-dark-400 text-sm">{data.totalFriends} friends</p>
          </div>
        </div>
        <div className="pt-28">
          <div className="border-t border-dark-300 px-6 py-2">
            <Tabs
              value={0}
              sx={{
                "&& .Mui-selected": {
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                  borderRadius: "5px",
                },
                "&& .MuiTabs-indicator": {
                  display: "none",
                },
                "&& .MuiTab-root": {
                  minHeight: "auto",
                },
                "&& .MuiTabs-scroller": {
                  marginTop: "4px",
                },
              }}
            >
              <Tab label="About" />
              <Tab label="Friends" />
            </Tabs>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className=" flex-[2] space-y-4 hidden sm:block">
          <div className="card">
            <p className="font-bold mb-3 text-lg">Introduction</p>
            <p>{data?.about}</p>
          </div>
          <div className="card">
            <p className="font-bold">Photos</p>
          </div>
        </div>
        <div className=" flex-[3]">
          <div className="flex-1 flex flex-col gap-4">
            {isMyProfile && <PostCreation />}
            {/* key dùng để cho react biết lúc nào thay đổi thì sẽ rerender lại tất cả state của component này */}
            <PostList userId={userId} key={userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
