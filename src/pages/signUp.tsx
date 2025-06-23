import { useState } from "react"
import { Link } from "react-router-dom"
import FormLayout from "../components/shared/form-layout"
import GoogleSignInButton from "../components/shared/google-button"
import FormInput from "../components/shared/form-input"


const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const formErrors = validateForm()

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    // Simulate API call
    // setTimeout(() => {
    //   setIsSubmitting(false)
    //   // Redirect or show success message
    // }, 1500)

  }

  const handleGoogleSignIn = () => {
    // Handle Google sign-in logic here
    console.log("Google sign-in clicked")
  }

  return (
    <FormLayout>
      <div className="bg-white rounded-xl p-8 w-full font-body">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Sign up</h2>

        <div className="space-y-6">
          <GoogleSignInButton onClick={handleGoogleSignIn} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              label="First Name"
              required
            />

            <FormInput
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              label="Last Name"
              required
            />

            <FormInput
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              label="Email Address"
              required
            />

            <FormInput
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              label="Password"
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-2 font-medium transition-all duration-300 border border-color cursor-pointer rounded-lg flex items-center justify-center gap-2 bg-gold hover:bg-white text-white hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating Account..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="my-6 text-center">
        <div className="bg-white rounded-full px-8 py-3 w-fit mx-auto">
          <span className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-gold hover:underline font-medium">
              Login
            </Link>
          </span>
        </div>
      </div>
    </FormLayout>
  )
}

export default SignUp
