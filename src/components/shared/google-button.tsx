import { FcGoogle } from "react-icons/fc";

interface GoogleSignInButtonProps {
  onClick?: () => void
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors font-body"
    >
      <FcGoogle />
      Continue with Google
    </button>
  )
}

export default GoogleSignInButton
