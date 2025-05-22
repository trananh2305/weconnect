
import { Circle, Notifications } from "@mui/icons-material";
import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import { useGetNotificationsQuery } from "@services/notificationApi";
import { useState } from "react";
import { Link } from "react-router-dom";
import AvatarUser from "./Avatar";
import TimeAgo from "./TimeAgo";

const NotificationItem = ({ notification }) => {
  if (notification.like)
    return (
      <div className="flex gap-1 items-center">
        <AvatarUser
          name={notification.author?.fullName}
          imageUrl={notification.author?.image}
          className="!inline-block"
        />
        <div>
          <div>
            <p className="inline-block font-semibold">
              {" "}
              {notification.author?.fullName}
            </p>{" "}
            liked a post
          </div>
          <TimeAgo
            date={notification.createdAt}
            className="text-xs text-dark-400 -mt-[1px] "
          />
        </div>
      </div>
    );
  if (notification.comment)
    return (
      <div className="flex gap-1 items-center">
        <AvatarUser
          name={notification.author?.fullName}
          imageUrl={notification.author?.image}
        />
        <div>
          <div>
            <p className="inline-block font-semibold">
              {" "}
              {notification.author?.fullName}
            </p>{" "}
            commented a post
          </div>
          <TimeAgo
            date={notification.createdAt}
            className="text-xs text-dark-400 -mt-[1px] "
          />
        </div>
      </div>
    );
  return "";
};

const NotificationsPanel = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { data = {} } = useGetNotificationsQuery();


  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotiIconClick = (e) => {
    setAnchorEl(e.target);
  };

  const newNotiCount =
    (data?.notifications || []).filter((noti) => !noti.seen)?.length || 0;

  const renderNotificationsMenu = (
    <Menu
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={handleMenuClose}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      // Trong Material-UI (MUI), thuộc tính classes được sử dụng để tùy chỉnh giao diện của component bằng cách thêm các class CSS tùy chỉnh.
      classes={{ paper: "!min-w-80 !max-h-80 overflow-y-auto" }}
    >
      {(data?.notifications || []).map((notification) => (
        <MenuItem key={notification._id} className="flex !justify-between">
          <Link
            to={`/users/${notification.author?._id}`}
            onClick={handleMenuClose}
          >
            <NotificationItem notification={notification} />
          </Link>
          {!notification.seen && (
            <Circle className="text-primary-main ml-2 !size-2" />
          )}
        </MenuItem>
      ))}
    </Menu>
  );
  return (
    <>
      <IconButton size="medium" onClick={handleNotiIconClick}>
        <Badge badgeContent={newNotiCount || undefined} color="error">
          <Notifications />
        </Badge>
      </IconButton>
      {renderNotificationsMenu}
    </>
  );
};

export default NotificationsPanel;
