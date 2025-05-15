import { Button } from "@/components/shared/button"
import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"

const SignUp = () => {
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

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Validate password
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Validate password confirmation
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

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gold px-4 py-10">
      <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-lg pt-8 px-6 pb-6">
        <h2 className="font-heading text-gold text-3xl font-semibold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4 font-text">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full p-3 border-b-2 ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                } outline-none focus:border-[#8A7C3D] placeholder-gray-400`}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            <div className="flex-1">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full p-3 border-b-2 ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                } outline-none focus:border-[#8A7C3D] placeholder-gray-400`}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border-b-2 ${
                errors.email ? "border-red-500" : "border-gray-300"
              } outline-none focus:border-[#8A7C3D] placeholder-gray-400`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 border-b-2 ${
                errors.password ? "border-red-500" : "border-gray-300"
              } outline-none focus:border-[#8A7C3D] placeholder-gray-400`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 border-b-2 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } outline-none focus:border-[#8A7C3D] placeholder-gray-400`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="pt-2">
            <Button
              label={isSubmitting ? "Creating Account..." : "Sign Up"}
              variant="primary"
              disabled={isSubmitting}
              className="w-full p-3 bg-gold text-white rounded-full text-lg font-medium hover:opacity-90 transition disabled:opacity-70"
            />
          </div>

          <div className="text-center mt-4 font-text">
            <p className="text-primary text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-gold hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
