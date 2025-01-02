import React from "react";

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string | undefined;
  error: string | undefined;
  touched: boolean | undefined;
  onChange: (e: React.ChangeEvent<any>) => void;
  placeholder?: string;
}
const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type,
  value,
  error,
  touched,
  onChange,
  placeholder,
}) => (
  <div className="mb-4">
    <label
      className="block text-left text-gray-700 text-sm font-bold mb-2"
      htmlFor={id}
    >
      {label}
    </label>
    <input
      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
        touched && error ? "border-red-500" : ""
      }`}
      id={id}
      type={type}
      value={value}
      onChange={onChange} // This ensures the form state is updated correctly
      placeholder={placeholder}
    />
    {touched && error && <p className="text-red-500 text-xs">{error}</p>} 
  </div>
);

export default FormField;
