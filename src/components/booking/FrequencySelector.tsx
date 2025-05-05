import React from 'react';
import { Frequency } from '../../types';

interface FrequencySelectorProps {
	value: Frequency;
	onChange: (value: Frequency) => void;
}

interface FrequencyOption {
	id: Frequency;
	label: string;
	discount?: string;
}

const frequencyOptions: FrequencyOption[] = [
	{ id: 'one-time', label: 'One Time' },
	{ id: 'weekly', label: 'Weekly', discount: '15% Off' },
	{ id: 'bi-weekly', label: 'Bi-Weekly', discount: '10% Off' },
	{ id: 'monthly', label: 'Monthly', discount: '5% Off' },
];

export const FrequencySelector: React.FC<FrequencySelectorProps> = ({ value, onChange }) => {

	const getButtonClass = (optionId: Frequency): string => {
		const baseClass = "flex-1 text-center px-4 py-3 border rounded-md cursor-pointer transition-all duration-150 ease-in-out focus:outline-none";
		const selectedClass = "bg-gold text-white shadow-md hover:bg-blue-600";
		const unselectedClass = "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400";

		return `${baseClass} ${value === optionId ? selectedClass : unselectedClass}`;
	};

	return (
		<section className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
			<h3 className="text-lg font-semibold mb-4 text-gray-800">How Often?</h3>
			<div className="flex flex-wrap gap-3">
				{frequencyOptions.map((option) => (
					<button
						key={option.id}
						type="button"
						onClick={() => onChange(option.id)}
						className={getButtonClass(option.id)}
						aria-pressed={value === option.id}
					>
						<span className="font-medium">{option.label}</span>
						{option.discount && (
							<span className={`block text-xs mt-0.5 ${value === option.id ? 'text-blue-100' : 'text-green-600 font-semibold'}`}>
								{option.discount}
							</span>
						)}
					</button>
				))}
			</div>
		</section>
	);
};