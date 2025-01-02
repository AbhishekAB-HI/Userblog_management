import React from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  error: string | undefined;
  touched: boolean | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  error,
  touched,
  onChange,
  onBlur,
}) => {
  return (
    <div className="mb-6">
      <label
        className="block text-gray-700 text-left text-sm font-bold mb-2"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          touched && error ? "border-red-500" : ""
        }`}
      />
      {touched && error && (
        <p className="text-red-500 text-xs italic">{error}</p>
      )}
    </div>
  );
};

export default InputField;
