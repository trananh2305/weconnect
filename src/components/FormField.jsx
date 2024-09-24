import { Controller } from "react-hook-form";

const FormField = ({ control, lable, name, Component, type}) => {
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
            />
          );
        }}
      />
    </div>
  );
};

export default FormField;
