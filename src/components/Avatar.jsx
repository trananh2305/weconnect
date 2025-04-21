import { useUserInfo } from "@hooks/index";
import { Avatar } from "@mui/material";

const AvatarUser = ({ className, isMyAvtar = false, name, imageUrl }) => {
  const { fullName, image } = useUserInfo();

  const userName = isMyAvtar ? fullName : name;
  const avatarImage = isMyAvtar ? image: imageUrl;
  return (
    <Avatar className={`!bg-primary-main ${className}`} src={avatarImage}>
      {userName?.[0].toUpperCase()}
    </Avatar>
  );
};

export default AvatarUser;
