import { ChangeEvent } from 'react';
import { AddressDetails } from '@/types';

type AddressInfoErrors = Partial<Record<keyof AddressDetails, string>>;

interface AddressInfoProps {
	value: AddressDetails;
	onChange: (value: AddressDetails) => void;
	errors?: AddressInfoErrors;
}

export const AddressInfo: React.FC<AddressInfoProps> = ({ value, onChange, errors = {} }) => {

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value: inputValue } = e.target;
		onChange({ ...value, [name]: inputValue });
	};

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
	const errorInputClass = "border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500";
	const errorTextClass = "mt-1 text-xs text-red-600";

	return (
		<section className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
			<h3 className="text-lg font-semibold mb-4 text-gray-800">Service Address</h3>
			<div className="space-y-4">
				<div>
					<label htmlFor="street" className="block text-sm font-medium text-gray-700">
						Street Address
					</label>
					<input
						type="text"
						name="street"
						id="street"
						value={value.street}
						onChange={handleChange}
						required
						className={`${inputClass} ${errors.street ? errorInputClass : ''}`}
						autoComplete="street-address"
						aria-invalid={!!errors.street}
						aria-describedby={errors.street ? "street-error" : undefined}
					/>
						{errors.street && <p id="street-error" className={errorTextClass}>{errors.street}</p>}
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label htmlFor="city" className="block text-sm font-medium text-gray-700">
							City
						</label>
						<input
							type="text"
							name="city"
							id="city"
							value={value.city}
							onChange={handleChange}
							required
							className={`${inputClass} ${errors.city ? errorInputClass : ''}`}
							autoComplete="address-level2" // City
							aria-invalid={!!errors.city}
							aria-describedby={errors.city ? "city-error" : undefined}
						/>
							{errors.city && <p id="city-error" className={errorTextClass}>{errors.city}</p>}
					</div>
					<div>
						<label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
							ZIP / Postal Code
						</label>
						<input
							type="text"
							name="zipCode"
							id="zipCode"
							value={value.zipCode}
							onChange={handleChange}
							required
							className={`${inputClass} ${errors.zipCode ? errorInputClass : ''}`}
							autoComplete="postal-code"
							aria-invalid={!!errors.zipCode}
							aria-describedby={errors.zipCode ? "zipCode-error" : undefined}
						/>
							{errors.zipCode && <p id="zipCode-error" className={errorTextClass}>{errors.zipCode}</p>}
					</div>
				</div>
			</div>
		</section>
	);
};