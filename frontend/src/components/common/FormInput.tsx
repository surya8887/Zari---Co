interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
}

export const FormInput = ({
  label,
  type = 'text',
  value,
  onChange,
  disabled = false,
  required = false,
  placeholder,
  icon,
}: FormInputProps) => {
  return (
    <div>
      <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1.5 flex items-center gap-1.5">
        {icon}
        {label}
      </label>
      <input
        type={type}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none transition-all duration-200 ${
          disabled
            ? 'bg-neutral-100/50 border-neutral-200 cursor-not-allowed text-slate-500'
            : 'bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white'
        }`}
      />
    </div>
  );
};
export default FormInput;
