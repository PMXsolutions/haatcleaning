"use client"

import type React from "react"
import { useState } from "react"

import { useServiceOptions } from "@/hooks/useApi"
import type { SelectedExtra } from "@/types"
import { Check, Plus, Minus, WifiOff } from "lucide-react"

interface Step2Props {
  selectedExtras: SelectedExtra[]
  onExtrasChange: (extras: SelectedExtra[]) => void
  selectedServiceTypeId: string // Add this prop to filter service options
}

export const Step2AddOns: React.FC<Step2Props> = ({ 
  selectedExtras, 
  onExtrasChange, 
  selectedServiceTypeId 
}) => {
  const [otherServiceText, setOtherServiceText] = useState("")
  const { serviceOptions, loading, error, usingFallback } = useServiceOptions(selectedServiceTypeId)
  
  const addOns = [
    ...serviceOptions.map(option => ({
      id: option.serviceOptionId,
      name: option.optionName,
      price: option.pricePerUnit,
      hasQuantity: true,
    })),
    {
      id: "other",
      name: "Other Service Not Listed",
      price: 0,
      hasQuantity: false,
    }
  ]

  const getSelectedExtra = (id: string) => {
    return selectedExtras.find((extra) => extra.id === id)
  }

  const getSelectedQuantity = (id: string) => {
    const selected = getSelectedExtra(id)
    return selected ? selected.quantity : 0
  }

  const isSelected = (id: string) => {
    return selectedExtras.some((extra) => extra.id === id)
  }

  const handleToggle = (id: string) => {
    if (isSelected(id)) {
      onExtrasChange(selectedExtras.filter((extra) => extra.id !== id))
      if (id === "other") {
        setOtherServiceText("")
      }
    } else {
      const newExtra: SelectedExtra = { 
        id, 
        quantity: 1, 
        size: "SM",
        ...(id === "other" && { customText: otherServiceText })
      }
      onExtrasChange([...selectedExtras, newExtra])
    }
  }

  const handleQuantityChange = (id: string, change: number) => {
    const currentQuantity = getSelectedQuantity(id)
    const newQuantity = Math.max(0, currentQuantity + change)

    if (newQuantity === 0) {
      onExtrasChange(selectedExtras.filter((extra) => extra.id !== id))
    } else {
      if (isSelected(id)) {
        const updated = selectedExtras.map((extra) => 
          extra.id === id ? { ...extra, quantity: newQuantity } : extra
        )
        onExtrasChange(updated)
      } else {
        const newExtra: SelectedExtra = { 
          id, 
          quantity: newQuantity, 
          size: "SM",
          ...(id === "other" && { customText: otherServiceText })
        }
        onExtrasChange([...selectedExtras, newExtra])
      }
    }
  }

  const handleOtherServiceTextChange = (text: string) => {
    setOtherServiceText(text)
    
    // Update the selected extra if it's already selected
    if (isSelected("other")) {
      const updated = selectedExtras.map((extra) => 
        extra.id === "other" ? { ...extra, customText: text } : extra
      )
      onExtrasChange(updated)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-medium text-gray-900">Optional add-ons</h2>
        {usingFallback && <WifiOff className="h-4 w-4 text-gray-400" />}
      </div>
      <p className="text-sm text-gray-600 mb-6">Add extra services specific to your selected service type</p>

      {/* Fallback indicator */}
      {usingFallback && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <WifiOff className="h-4 w-4 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-800">
              Showing offline add-on options. Online features may be limited.
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-600">Loading available add-ons...</p>
        </div>
      )}

      {/* Error state (only show if not using fallback) */}
      {error && !usingFallback && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* No add-ons available */}
      {!loading && addOns.length === 1 && addOns[0].id === "other" && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-sm text-gray-600">
            No specific add-ons available for this service type. You can still request other services below.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {addOns.map((addon) => (
          <div key={addon.id} className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleToggle(addon.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected(addon.id) ? "bg-[#8A7C3D] border-[#8A7C3D] text-white" : "border-gray-300"
                  }`}
                >
                  {isSelected(addon.id) && <Check className="w-3 h-3" />}
                </button>
                <span className="font-medium text-gray-900">{addon.name}</span>
              </div>

              <div className="flex items-center space-x-4">
                {addon.id !== "other" && (
                  <span className="text-sm text-gray-600">
                    ${addon.price.toFixed(2)} / unit
                  </span>
                )}

                {addon.hasQuantity && (
                  <div className="flex items-center border border-gray-300 rounded">
                    <button onClick={() => handleQuantityChange(addon.id, -1)} className="p-1 hover:bg-gray-100">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">
                      {getSelectedQuantity(addon.id)}
                    </span>
                    <button onClick={() => handleQuantityChange(addon.id, 1)} className="p-1 hover:bg-gray-100">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => handleToggle(addon.id)}
                  className="px-4 py-2 border border-[#8A7C3D] text-[#8A7C3D] rounded hover:bg-[#8A7C3D] hover:text-white transition-colors"
                >
                  {isSelected(addon.id) ? "Remove" : "Add"}
                </button>
              </div>
            </div>

            {/* Text box for "Other Service Not Listed" */}
            {addon.id === "other" && isSelected(addon.id) && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <label htmlFor="other-service-text" className="block text-sm font-medium text-gray-700 mb-2">
                  Please describe the service you need:
                </label>
                <textarea
                  id="other-service-text"
                  value={otherServiceText}
                  onChange={(e) => handleOtherServiceTextChange(e.target.value)}
                  placeholder="Describe the additional service you need..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7C3D] focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}