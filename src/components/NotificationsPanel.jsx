import { generateNotificationMessage } from "@libs/utils";
import { Circle, Notifications } from "@mui/icons-material";
import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import { useGetNotificationsQuery } from "@services/notificationApi";
import { useState } from "react";

const NotificationsPanel = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { data = {} } = useGetNotificationsQuery();
  console.log("noti", data);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotiIconClick = (e) => {
    setAnchorEl(e.target);
  };

  const newNotiCount =
    (data?.notifications || []).filter((noti) => !noti.seen)?.length || 0;
  console.log("newCOunt", newNotiCount);
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
          <p>{generateNotificationMessage(notification)}</p>
          {!notification.seen && (
            <Circle fontSize="10" className="text-primary-main" />
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
