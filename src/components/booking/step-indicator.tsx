import type React from "react"
interface StepIndicatorProps {
  currentStep: number
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, title: "Select Cleaning package" },
    { number: 2, title: "Cleaning Add-ons" },
    { number: 3, title: "Billing" },
    { number: 4, title: "Booking Confirmation" },
  ]

  return (
    <div className="flex items-center justify-center sm:space-x-4 md:space-x-8 flex-wrap">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-col sm:flex-row pr-2">
          <div className="flex items-center">
            <div
              className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${currentStep >= step.number ? "bg-gold text-white" : "bg-gray-200 text-gray-600"}
            `}
            >
              {step.number}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${currentStep >= step.number ? "text-gray-900" : "text-gray-500"}`}
            >
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && <div className="ml-8 w-8 h-px bg-gray-300 sm:block md:hidden" />}
        </div>
      ))}
    </div>
  )
}
