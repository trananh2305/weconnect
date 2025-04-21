import FormField from "./FormField";
import Button from "./Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextInput from "./formInput/TextInput";
import TextareaInput from "./formInput/TextareaInput";
import { useUploadInformProfileMutation } from "@services/userApi";
import { useUserInfo } from "@hooks/index";
import { openSnackbar } from "@redux/slices/snackbarSlice";
import { useDispatch } from "react-redux";

const UpdateUserInfoForm = () => {
  const [uploadInformProfile, { isLoading }] = useUploadInformProfileMutation();
  const { about, fullName } = useUserInfo();
  const dispatch = useDispatch();

  const formSchema = yup.object().shape({
    about: yup.string(),
    fullName: yup.string().required(),
  });
  const {
    control,
    handleSubmit,
    reset,
    // isDirty để xem người dùng đã sửa form hay chưa
    formState: { errors, isDirty },
    // getValues de lay gia tri o trong form
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      about,
      fullName,
    },
  });

  async function onSubmit(formData) {
    try {
      await uploadInformProfile(formData).unwrap();
      dispatch(openSnackbar({ message: "Update successfully!" }));
      reset(formData);
    } catch (error) {
      dispatch(openSnackbar({ type: "error", message: error.data.message }));
    }
  }
  return (
    <form
      action=""
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormField
        name="fullName"
        lable="FullName"
        control={control}
        Component={TextInput}
        error={errors["fullName"]}
      />
      <FormField
        name="about"
        lable="About"
        control={control}
        Component={TextareaInput}
        type="textarea"
        error={errors["about"]}
      />
      <Button
        variant="contained"
        isLoading={isLoading}
        inputProps={{ disabled: !isDirty, type: "submit" }}
        className="w-fit"
      >
        Save Change
      </Button>
    </form>
  );
};

export default UpdateUserInfoForm;
