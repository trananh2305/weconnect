import UpdateUserInfoForm from "@components/UpdateUserInfoForm";
import UserUploader from "@components/UserUploader";
import { useUserInfo } from "@hooks/index";

const AccountSettings = () => {
  const { image, coverImage } = useUserInfo();

  return (
    <div className="container flex-col">
      <p className="font-bold text-xl">Account Settings</p>
      <div className="card p-0">
        <p className="text-lg p-6 font-semibold border-b border-dark-300">
          Profile Details
        </p>
        <div className="p-6 grid sm:grid-cols-2 gap-4 grid-cols-1 border-2 border-dark-300">
          <UserUploader
            title="Avatar"
            footNote="Allowed JPG and PNG"
            currentImage={image}
          />
          <UserUploader
            title="Cover Image"
            footNote="Allowed JPG and PNG"
            currentImage={coverImage}
            isCover={true}
          />
        </div>
        <div className="p-6 sm:w-1/2">
          <UpdateUserInfoForm/>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
