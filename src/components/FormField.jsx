import { FormHelperText } from "@mui/material";
import { Controller } from "react-hook-form";

const FormField = ({ control, lable, name, Component, type, error }) => {
  return (
    <div>
      <p className="font-bold mb-1 text-sm text-dark-100">{lable}</p>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, name } }) => {
          return (
            <Component
              onChange={onChange}
              value={value}
              name={name}
              control={control}
              type={type}
              
              error={error?.message}
            />
          );
        }}
      />
      {/* in loi ra duoi input */}
      {error?.message && (
        <FormHelperText error={true}>{error.message}</FormHelperText>
      )}
    </div>
  );
};

export default FormField;
