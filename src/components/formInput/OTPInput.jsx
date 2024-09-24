import { MuiOtpInput } from "mui-one-time-password-input";

const OTPInput = ({ value, onChange }) => {
  return <MuiOtpInput value={value} onChange={onChange} length={6} />;
};

export default OTPInput;
