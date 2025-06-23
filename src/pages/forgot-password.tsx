import { useState } from "react"
import { Link } from "react-router-dom"
import FormLayout from "@/components/shared/form-layout"
import FormInput from "@/components/shared/form-input"

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: { [key: string]: string } = {}

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      console.log("Password reset email sent to:", email)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <FormLayout>
        <div className="bg-white rounded-xl p-8 w-full font-body">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Check your email</h2>
          <p className="text-gray-600 mb-6">We've sent a password reset link to {email}</p>
          <Link to="/login" className="text-gold hover:underline font-medium">
            Back to Login
          </Link>
        </div>
      </FormLayout>
    )
  }

  return (
    <FormLayout>
      <div className="bg-white rounded-xl p-8 w-full font-body">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Forgot password</h2>
          <p className="text-gray-600 text-sm">Use your work email to sign in to your team workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            label="Email Address"
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-2 font-medium transition-all duration-300 border border-color cursor-pointer rounded-lg flex items-center justify-center gap-2 bg-gold hover:bg-white text-white hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-gold hover:underline font-medium text-sm">
          Back to Login
        </Link>
      </div>
    </FormLayout>
  )
}

export default ForgotPassword
