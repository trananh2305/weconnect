
import { useDetectLayout, useUserInfo } from "@hooks/index";
import { HomeOutlined, Hub, Language, LockPerson, Message, People } from "@mui/icons-material";
import { Drawer, List, ListSubheader,  } from "@mui/material";
import { toggleDrawer } from "@redux/slices/settingSlice";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SideBar = () => {
  const isShowDrawer = useSelector((state) => state.settings.isShowDrawer);
  const dispatch = useDispatch();
  const {isMediumLayout} = useDetectLayout();
  return isMediumLayout ? (
    <Drawer open={isShowDrawer} onClose={() => dispatch(toggleDrawer())} classes={{paper: 'p-4 flex flex-col !bg-dark-200'}}>
      <div className="mb-4">
        <Link to="/">
          {" "}
          <img src="/weconnect-logo.png" alt="" className="w-8 h-8 " />
        </Link>
      </div>
      <SideBarContent />
    </Drawer>
  ) : (
    <SideBarContent />
  );
};

export default SideBar;

const SideBarContent = () => {
  const { _id: userId } = useUserInfo();
  return (
    <div className="w-64 flex flex-col gap-4 ">
      <List className="flex flex-col !py-3 !px-4 bg-white shadow rounded">
        <Link to="/" className="flex items-center gap-1 ">
          <HomeOutlined fontSize="small" /> New Feeds
        </Link>
        <Link to="/messages" className="flex items-center gap-1">
          <Message fontSize="small" /> Messager
        </Link>
        <Link to={`/users/${userId}/friends`} className="flex items-center gap-1">
          <People fontSize="small" /> Friends
        </Link>
        <Link to="/groups" className="flex items-center gap-1">
          <Hub fontSize="small" /> Groups
        </Link>
      </List>
      <List className="flex flex-col !py-3 !px-4 bg-white shadow rounded">
        <ListSubheader className="!px-0 !leading-none">Settings</ListSubheader>
        <Link to="/settings/account" className="flex items-center gap-1">
          <LockPerson fontSize="small" /> Account
        </Link>
        <Link to="/setting/languages" className="flex items-center gap-1">
          <Language fontSize="small" /> Languages
        </Link>
      </List>
    </div>
  );
};
