import FormField from "../../components/FormField";
import { useForm } from "react-hook-form";
import TextInput from "../../components/formInput/TextInput";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const { control } = useForm();
  return (
    <div>
      <p className="text-2xl mb-5 font-bold text-center ">Login</p>
      <form action="" className="flex flex-col gap-4">
        <FormField
          name="email"
          lable="Email"
          control={control}
          Component={TextInput}
        />
        <FormField
          name="password"
          lable="Password"
          control={control}
          Component={TextInput}
          type="password"
        />
        <Button variant="contained">Sign in</Button>
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
