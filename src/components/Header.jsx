import { useDetectLayout, useLogout, useUserInfo } from "@hooks/index";

import { Search, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { toggleDrawer } from "@redux/slices/settingSlice";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import NotificationsPanel from "./NotificationsPanel";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const userInfo = useUserInfo();
  const { logOut } = useLogout();
  const { isMediumLayout } = useDetectLayout();
  const dispatch = useDispatch();
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
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
      <MenuItem>
        <Link to={`/users/${userInfo._id}`} onClick={handleMenuClose}>
          Profile
        </Link>
      </MenuItem>
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
      <AppBar color="white" position="static">
        <div className="flex justify-between items-center !min-h-fit container">
          {isMediumLayout ? (
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
                  sx={{
                    ".MuiInputBase-root::before": {
                      display: "none",
                    },
                  }}
                  variant="standard"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.currentTarget.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      navigate("/search/users", {
                        state: {
                          searchTerm,
                        },
                      });
                    }
                  }}
                />
              </div>
            </div>
          )}
          <div>
            {isMediumLayout && (
              <IconButton>
                <Search />
              </IconButton>
            )}
            <NotificationsPanel />
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
