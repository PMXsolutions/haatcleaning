import type { ServiceType } from "@/types"
import { HomeIcon, BuildingIcon, BedDoubleIcon } from "lucide-react"

interface ServiceTypeSelectorProps {
  value: ServiceType
  onChange: (serviceType: ServiceType) => void
}

export const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({ value, onChange }) => {
  const serviceTypes: { id: ServiceType; name: string; icon: React.ReactNode; description: string }[] = [
    {
      id: "residential",
      name: "Residential",
      icon: <HomeIcon className="h-8 w-8 mb-2" />,
      description: "For homes and apartments",
    },
    {
      id: "commercial",
      name: "Commercial",
      icon: <BuildingIcon className="h-8 w-8 mb-2" />,
      description: "For offices and business spaces",
    },
    {
      id: "airbnb",
      name: "Airbnb",
      icon: <BedDoubleIcon className="h-8 w-8 mb-2" />,
      description: "For vacation rentals and Airbnb properties",
    },
  ]

  return (
    <section className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white text-primary font-text">
      <h2 className="text-xl font-semibold mb-3">Service Type</h2>
      <p className="mb-4">Select the type of property you need cleaned</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {serviceTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => onChange(type.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
              value === type.id
                ? "border-color shadow-md"
                : "border-gray-200 hover:border-gold hover:bg-gray-50"
            }`}
          >
            {type.icon}
            <h3 className="font-semibold text-lg">{type.name}</h3>
            <p className="text-sm text-gray-500 text-center mt-1">{type.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
