import React from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  children,
  className = "",
  required = false
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center select-none">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          {label} {required && <span className="text-rose-400 font-bold">*</span>}
        </label>
      </div>
      {children}
      {error && (
        <p className="text-xs text-rose-400 font-semibold leading-none pt-0.5 animate-in slide-in-from-top-1 duration-150">
          {error}
        </p>
      )}
    </div>
  );
};
export default FormField;
