import { useForm } from "react-hook-form";
import FormField from "../../components/FormField";
import { Button } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import OTPInput from "../../components/formInput/OTPInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useVerifyOTPMutation } from "@services/rootApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { openSnackbar } from "@redux/slices/snackbarSlice";
import { login } from "@redux/slices/authSlice";

const OTPVerifyPage = () => {
  // trong thang location nay se co state cua trang do
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formSchema = yup.object().shape({
    otp: yup.string().required(),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues:{
      otp:''
    }
  });
  const [verifyOTP, { data, isError, isSuccess, error }] =
    useVerifyOTPMutation();
  function onSubmit(formData) {
    verifyOTP({ email: location?.state?.email, otp: formData?.otp });
    // console.log({email: location.state.email, otp: formData.otp})
  }
  useEffect(() => {
    if (isError) {
      dispatch(openSnackbar({ type: "error", message: error?.data?.message }));
    }
    if (isSuccess) {
      dispatch(openSnackbar({ message: "Login successfully!" }));
      dispatch(login(data));
      console.log({data})
      // navigate co the truyen ca gia tri
      navigate("/");
    }
  }, [isSuccess, dispatch, navigate, data?.message, error, isError, data]);
  return (
    <div>
      <p className="text-2xl mb-5 font-bold text-center ">Verify</p>
      <form
        action=""
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          name="otp"
          lable="Type your 6 digit security code"
          control={control}
          Component={OTPInput}
          error={errors["otp"]}
        />

        <Button variant="contained" type="submit">
          Verify my account
        </Button>
      </form>
      <p className="mt-4">
          
        <Link className="text-sky-600" to="/login">
          Resend
        </Link>
      </p>
    </div>
  );
};

export default OTPVerifyPage;
