import { Tab, Tabs } from "@mui/material";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { theme } from "@configs/muiConfig";
import { useUserInfo } from "@hooks/index";
import { useGetUserInfoByIdQuery } from "@services/userApi";
import Loading from "@components/Loading";
import { UserActionButton } from "@components/UserCard";
import AvatarUser from "@components/Avatar";

const UserProfilePage = () => {
  const { userId } = useParams();
  const { _id } = useUserInfo();
  const location = useLocation();

  const pathname = location.pathname.split("/").filter(Boolean).pop();

  const { data = {}, isLoading } = useGetUserInfoByIdQuery(userId);

  if (isLoading) {
    return <Loading />;
  }

  const isMyProfile = userId === _id;

  const TABS = [
    {
      patch: "about",
      label: "About",
      index: 0,
    },
    {
      patch: "friends",
      label: "Friends",
      index: 1,
    },
  ];

  const getActiveTab = (patchname) => {
    if (pathname === `/users/${userId}`) {
      return 0;
    }
    const matchedTab = TABS.find((tab) => tab.patch === patchname);

    return matchedTab ? matchedTab.index : 0;
  };

  const activeTab = getActiveTab(pathname);

  return (
    <div className="container flex-col ">
      <div className="card p-0 relative">
        <img
          className="h-36 sm:h-80 object-cover w-full"
          src={data.coverImage ?? "https://placehold.co/1920x540"}
          alt=""
        />
        <div className="  mb-3 px-6 absolute transform sm:-translate-y-1/2 w-full -translate-y-1/3 flex flex-col sm:flex-row sm:justify-between items-center sm:items-end  ">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end">
            <AvatarUser
              className="sm:!size-44 !size-24 border-4 border-white !text-6xl"
              name={data.fullName}
              imageUrl={data.image}
            />
            <div className="text-center sm:text-left ">
              <p className="font-bold truncate text-2xl sm:text-3xl text-">
                {data?.fullName}
              </p>
              <p className="text-dark-400 text-sm">
                {data.totalFriends} friends
              </p>
            </div>
          </div>
          {!isMyProfile && (
            <div>
              <UserActionButton
                userId={userId}
                fullName={data?.fullName}
                isFriend={data?.isFriend}
                requestReceived={data?.requestReceived}
                requestSent={data?.requestSent}
              />
            </div>
          )}
        </div>
        <div className="sm:pt-28 pt-40">
          <div className="border-t border-dark-300 px-6 py-2">
            <Tabs
              value={activeTab}
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
              {TABS.map((tab) => (
                <Tab
                  key={tab.label}
                  label={tab.label}
                  LinkComponent={Link}
                  to={`/users/${userId}/${tab.patch}`}
                />
              ))}
            </Tabs>
          </div>
        </div>
      </div>
      {/* truyền dữ liệu cho componnet con */}
      <Outlet context={{ data, isMyProfile }} />
    </div>
  );
};

export default UserProfilePage;
