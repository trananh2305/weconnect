import { useLogout } from "@hooks/useLogout";
import { useUserInfo } from "@hooks/useUserInfo";
import { Notifications, Search, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { toggleDrawer } from "@redux/slices/settingSlice";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const userInfo = useUserInfo();
  const { logOut } = useLogout();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (
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
    >
      <MenuItem>Profile</MenuItem>
      <MenuItem
        onClick={() => {
          logOut();
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );
  const handleUserProfileClick = (e) => {
    setAnchorEl(e.target);
  };
  return (
    <>
      <AppBar color="white" position="static" className="py-4 px-2">
        <div className="flex justify-between items-center !min-h-fit">
          {isMobile ? (
            <IconButton onClick={() => dispatch(toggleDrawer())}>
              <MenuIcon />
            </IconButton>
          ) : (
            <div className="flex gap-4 ">
              <Link to="/">
                {" "}
                <img src="/weconnect-logo.png" alt="" className="w-8 h-8 " />
              </Link>

              <div className="flex items-center gap-1">
                <Search />
                <TextField
                  placeholder="Search"
                  name="search"
                  slotProps={{
                    input: { className: "h-10 py-2 px-3" },
                    htmlInput: { className: "!p-0" },
                  }}
                  sx={{'.MuiInputBase-root::before':{
                    display:'none'
                  }}}
                  variant="standard"
                />
              </div>
            </div>
          )}
          <div>
            {isMobile && (
              <IconButton>
                <Search />
              </IconButton>
            )}
            <IconButton size="medium">
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton size="medium" onClick={handleUserProfileClick}>
              {/* <AccountCircle /> */}
              <Avatar className="!bg-primary-main">
                {userInfo.fullName?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
          </div>
        </div>
      </AppBar>
      {renderMenu}
    </>
  );
};

export default Header;
