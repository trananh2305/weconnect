import { useForm } from "react-hook-form";
import FormField from "../../components/FormField";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import OTPInput from "../../components/formInput/OTPInput";

const OTPVerifyPage = () => {
  const { control } = useForm();
  return (
    <div>
      <p className="text-2xl mb-5 font-bold text-center ">Verify</p>
      <form action="" className="flex flex-col gap-4">
        <FormField
          name="otp"
          lable="Type your 6 digit security code"
          control={control}
          Component={OTPInput}
        />

        <Button variant="contained">Verify my account</Button>
      </form>
      <p className="mt-4">
        Did&apos; get the code?{" "}
        <Link className="text-sky-600" to="/login">
          Resend
        </Link>
      </p>
    </div>
  );
};

export default OTPVerifyPage;
