import FormField from "../../components/FormField";
import { useForm } from "react-hook-form";
import TextInput from "../../components/formInput/TextInput";
import { Alert, Button, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoginMutation } from "@services/rootApi";
import { useEffect } from "react";
import { openSnackbar } from "@redux/slices/snackbarSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { data = {}, isLoading, error, isError, isSuccess }] =
    useLoginMutation();
  const formSchema = yup.object().shape({
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email is not valid"
      )
      .required(),
    password: yup.string().required(),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    // getValues de lay gia tri o trong form
    getValues,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function onSubmit(formData) {
    console.log({ formData });
    // register(formData);
    login(formData);
  }
  useEffect(() => {
    // if(isError){
    //   dispatch(openSnackbar({ type: "error",message: error?.data?.message }));
    // }
    // console.log({isSuccess})
    if (isSuccess) {
      dispatch(openSnackbar({ message: data.message }));
      // navigate co the truyen ca gia tri
      navigate("/verify-otp", {
        state: {
          email: getValues("email"),
        },
      });
    }
  }, [isSuccess, dispatch, navigate, data.message, error, isError, getValues]);

  return (
    <div>
      <p className="text-2xl mb-5 font-bold text-center ">Login</p>
      <form
        action=""
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          name="email"
          lable="Email"
          control={control}
          Component={TextInput}
          error={errors["email"]}
        />
        <FormField
          name="password"
          lable="Password"
          control={control}
          Component={TextInput}
          type="password"
          error={errors["password"]}
        />
        <Button variant="contained" type="submit">
          {isLoading && <CircularProgress size="16px" />}
          Sign in
        </Button>
        {isError && <Alert severity="error">{error?.data?.message}</Alert>}
      </form>
      <p className="mt-4">
        If you don&apos;t have an account?{" "}
        <Link className="text-sky-600" to="/register">
          Sign up here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
