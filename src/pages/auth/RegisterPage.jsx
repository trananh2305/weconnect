import { useForm } from "react-hook-form";
import FormField from "../../components/FormField";
import TextInput from "../../components/formInput/TextInput";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const { control } = useForm();
  return (
    <div>
      <p className="text-2xl mb-5 font-bold text-center ">Register</p>
      <form action="" className="flex flex-col gap-4">
        <FormField
          name="fullname"
          lable="Full Name"
          control={control}
          Component={TextInput}
        />
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
        <Button variant="contained">Sign up</Button>
      </form>
      <p className="mt-4">
        Already have an account? <Link className="text-sky-600" to="/login">Sign in instead</Link>
      </p>  
    </div>
  );
};

export default RegisterPage;
