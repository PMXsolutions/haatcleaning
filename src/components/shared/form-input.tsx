import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface FormInputProps {
  type: string
  name?: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  label?: string
  required?: boolean
  autoComplete?: string
  id?: string
}

const FormInput: React.FC<FormInputProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  error,
  label,
  required = false,
  autoComplete,
  id,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword && showPassword ? "text" : type

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          name={name}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors ${
            error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gold"
          } ${isPassword ? "pr-12" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}

export default FormInput