
interface SpecialInstructionsProps {
  value: string
  onChange: (instructions: string) => void
}

export const SpecialInstructions: React.FC<SpecialInstructionsProps> = ({ value, onChange }) => {
  return (
    <section className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white text-primary font-text">
      <h2 className="text-lg font-semibold mb-3">Special Instructions</h2>
      <p className="mb-4">
        Please provide any special instructions or requests for your cleaning service (optional)
      </p>

      <div className="relative">
        <textarea
          id="special-instructions"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Examples: Entry instructions, areas that need special attention, pets in the home, etc."
          className="w-full p-4 border border-gray-300 rounded-lg  focus:border-transparent min-h-[120px]"
          maxLength={500}
        />
        <div className="absolute bottom-2 right-2 text-xs">{value.length}/500 characters</div>
      </div>
    </section>
  )
}
