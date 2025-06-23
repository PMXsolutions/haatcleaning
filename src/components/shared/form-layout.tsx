import { Link } from "react-router-dom"

interface AuthLayoutProps {
  children: React.ReactNode
}

const FormLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#D8D3BE] flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="mb-8">
        <Link to="/">
          <img
            src="/images/logo.png"
            className="w-25 h-10 mt-4"
            alt="Logo"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="relative max-w-[500px] w-full">

        {/* Form content with higher z-index */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Decorative images positioned within the white box */}
        <div className="absolute -left-12 top-[40%] -translate-y-1/2">
          <img src="/images/icon.png" alt="Decorative icon" className="" />
        </div>

        <div className="absolute -right-12 top-[50%] -translate-y-1/2">
          <img src="/images/icon2.png" alt="Decorative icon" className="" />
        </div>

      </div>
    </div>
  )
}

export default FormLayout
