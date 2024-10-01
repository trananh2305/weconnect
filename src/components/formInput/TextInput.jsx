import { TextField } from "@mui/material";

const TextInput = ({ onChange, value, name, type = "text", error
 }) => {
  return (
    // slotProps de them funtion cho tuy chinh doc tren document cua mui
    <TextField
    fullWidth
      slotProps={{
        input: { className: "h-10 py-2 px-3" },
        htmlInput: { className: "!p-0" },
      }}
      name={name}
      onChange={onChange}
      value={value}
      type={type}
      // neu loi la bao do
      error={error}
    />
  );
};

export default TextInput;
