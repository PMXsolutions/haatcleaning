"use client"

import type React from "react"
import { useState } from "react"

import { useServiceOptions } from "@/hooks/useApi"
import type { SelectedExtra } from "@/types"
import { Check, Plus, Minus } from "lucide-react"

interface Step2Props {
  selectedExtras: SelectedExtra[]
  onExtrasChange: (extras: SelectedExtra[]) => void
}

export const Step2AddOns: React.FC<Step2Props> = ({ selectedExtras, onExtrasChange }) => {
  const [otherServiceText, setOtherServiceText] = useState("")
  const { serviceOptions } = useServiceOptions()
  
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

  // const getSelectedSize = (id: string): Size => {
  //   const selected = getSelectedExtra(id)
  //   return selected?.size || "SM"
  // }

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
      // const currentSize = getSelectedSize(id)
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

  // const handleSizeChange = (id: string ) => {
  //   if (isSelected(id)) {
  //     const updated = selectedExtras.map((extra) => 
  //       extra.id === id ? { ...extra, size } : extra
  //     )
  //     onExtrasChange(updated)
  //   } else {
  //     // If not selected, select it with the chosen size
  //     const newExtra: SelectedExtra = { 
  //       id, 
  //       quantity: 1, 
  //       size,
  //       ...(id === "other" && { customText: otherServiceText })
  //     }
  //     onExtrasChange([...selectedExtras, newExtra])
  //   }
  // }

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

  // const getCurrentPrice = (addon: typeof addOns[0], id: string) => {
  //   const selectedSize = getSelectedSize(id)
  //   return addon.prices[selectedSize]
  // }

  return (
    <div>
      <h2 className="text-xl font-medium text-gray-900 mb-2">Optional add-ons</h2>
      <p className="text-sm text-gray-600 mb-6">e.g., Window Washing, Gutter Cleaning, etc.</p>

      <div className="space-y-4">
        {addOns.map((addon) => (
          <div key={addon.id} className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleToggle(addon.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected(addon.id) ? "bg-gold border-[#8A7C3D] text-white" : "border-gray-300"
                  }`}
                >
                  {isSelected(addon.id) && <Check className="w-3 h-3" />}
                </button>
                <span className="font-medium text-gray-900">{addon.name}</span>
              </div>

              <div className="flex items-center space-x-4">
                {addon.id !== "other" && (
                  <span className="text-sm text-gray-600">
                    $ {addon.price.toFixed(2)} / Day
                  </span>
                )}

                {/* {addon.hasQuantity && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-xs">
                      {(["SM", "MD", "BG"] as Size[]).map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeChange(addon.id, size)}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            getSelectedSize(addon.id) === size
                              ? "bg-gold text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center border border-gray-300 rounded">
                      <button 
                        onClick={() => handleQuantityChange(addon.id, -1)} 
                        className="p-1 hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium">
                        {getSelectedQuantity(addon.id)}
                      </span>
                      <button 
                        onClick={() => handleQuantityChange(addon.id, 1)} 
                        className="p-1 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )} */}

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
                  className="px-4 py-2 border border-[#8A7C3D] text-gold rounded hover:bg-gold hover:text-white transition-colors"
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