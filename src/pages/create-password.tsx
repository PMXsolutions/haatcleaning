import { useState } from "react"
import { Link } from "react-router-dom"
import FormLayout from "@/components/shared/form-layout"
import FormInput from "@/components/shared/form-input"

const CreateNewPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters"
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formErrors = validateForm()

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      console.log("Password updated successfully")
    }, 1500)
  }

  if (isSuccess) {
    return (
      <FormLayout>
        <div className="bg-white rounded-xl p-8 w-full font-body text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Password Updated</h2>
          <p className="text-gray-600 mb-6">Your password has been successfully updated.</p>
          <Link
            to="/login"
            className="inline-block px-6 py-2 bg-gold text-white rounded-lg hover:bg-white hover:text-gold transition-all duration-300 border border-gold"
          >
            Continue to Login
          </Link>
        </div>
      </FormLayout>
    )
  }

  return (
    <FormLayout>
      <div className="bg-white rounded-xl p-8 w-full font-body">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Create new password</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            type="password"
            name="newPassword"
            placeholder="Enter Password"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            label="New Password"
            required
          />

          <FormInput
            type="password"
            name="confirmPassword"
            placeholder="Enter Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            label="Confirm Password"
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-2 font-medium transition-all duration-300 border border-color cursor-pointer rounded-lg flex items-center justify-center gap-2 bg-gold hover:bg-white text-white hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Submit"}
          </button>
        </form>
      </div>
    </FormLayout>
  )
}

export default CreateNewPassword
