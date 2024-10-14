import { useForm } from "react-hook-form";
import FormField from "../../components/FormField";
import TextInput from "../../components/formInput/TextInput";
import { Alert, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@services/rootApi";
import { useDispatch } from "react-redux";
import { openSnackbar } from "@redux/slices/snackbarSlice";
import { useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // tham so thu nhat la ten enpoint
  const [register, { data = {}, isLoading, error, isError, isSuccess }] =
    useRegisterMutation();
  // xử lý validate cho form
  const formSchema = yup.object().shape({
    fullName: yup.string().required(),
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email is not valid"
      )
      .required(),
    password: yup.string().required(),
  });
  const { control, handleSubmit, formState: {errors} } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues:{
      fullName: '',
      email: '',
      password: ''
    }
  });
  function onSubmit(formData) {
    console.log({ formData });
    register(formData);
  }
  useEffect(() => {
    if (isSuccess) {
      dispatch(openSnackbar({ message: data.message }));
      navigate("/login");
    }
  }, [isSuccess, dispatch, navigate, data.message]);
  console.log({ data, isLoading, error });
  return (
    <div>
      <p className="text-2xl mb-5 font-bold text-center ">Register</p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="fullName"
          lable="Full Name"
          control={control}
          Component={TextInput}
          error={errors['fullName']}
        />
        <FormField
          name="email"
          lable="Email"
          control={control}
          Component={TextInput}
          error={errors['email']}
        />
        <FormField
          name="password"
          lable="Password"
          control={control}
          Component={TextInput}
          type="password"
          error={errors['password']}
        />
        <Button variant="contained" type="submit">
          Sign up
        </Button>
        {isError && <Alert severity="error">{error?.data?.message}</Alert>}
      </form>
      <p className="mt-4">
        Already have an account?{" "}
        <Link className="text-sky-600" to="/login">
          Sign in instead
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
