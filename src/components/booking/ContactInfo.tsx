import { ChangeEvent } from 'react';
import { ContactDetails } from '../../types';

type ContactInfoErrors = Partial<Record<keyof ContactDetails, string>>;

interface ContactInfoProps {
	value: ContactDetails;
	onChange: (value: ContactDetails) => void;
	errors?: ContactInfoErrors;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ value, onChange, errors = {} }) => {

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value: inputValue } = e.target;
		onChange({ ...value, [name]: inputValue });
	};

	// Common input styling
	const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
	const errorInputClass = "border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500";
  const errorTextClass = "mt-1 text-xs text-red-600";

	return (
		<section className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
			<h3 className="text-lg font-semibold mb-4 text-gray-800">Contact Information</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
				<div>
					<label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
						First Name
					</label>
					<input
						type="text"
						name="firstName"
						id="firstName"
						value={value.firstName}
						onChange={handleChange}
						required
						className={`${inputClass} ${errors.firstName ? errorInputClass : ''}`}
						autoComplete="given-name"
						aria-invalid={!!errors.firstName} 
						aria-describedby={errors.firstName ? "firstName-error" : undefined}
				/>
					{errors.firstName && <p id="firstName-error" className={errorTextClass}>{errors.firstName}</p>}
				</div>
				<div>
					<label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
						Last Name
					</label>
					<input
						type="text"
						name="lastName"
						id="lastName"
						value={value.lastName}
						onChange={handleChange}
						required
						className={`${inputClass} ${errors.lastName ? errorInputClass : ''}`}
						autoComplete="family-name"
						aria-invalid={!!errors.lastName}
						aria-describedby={errors.lastName ? "lastName-error" : undefined}
					/>
						{errors.lastName && <p id="lastName-error" className={errorTextClass}>{errors.lastName}</p>}
				</div>
				<div className="sm:col-span-2">
					<label htmlFor="email" className="block text-sm font-medium text-gray-700">
						Email Address
					</label>
					<input
						type="email"
						name="email"
						id="email"
						value={value.email}
						onChange={handleChange}
						required
						className={`${inputClass} ${errors.email ? errorInputClass : ''}`}
						autoComplete="email"
						aria-invalid={!!errors.email}
						aria-describedby={errors.email ? "email-error" : undefined}
					/>
						{errors.email && <p id="email-error" className={errorTextClass}>{errors.email}</p>}
				</div>
				<div className="sm:col-span-2">
					<label htmlFor="phone" className="block text-sm font-medium text-gray-700">
						Phone Number
					</label>
					<input
						type="tel" // Use tel for better mobile support
						name="phone"
						id="phone"
						value={value.phone}
						onChange={handleChange}
						required
						className={`${inputClass} ${errors.phone ? errorInputClass : ''}`}
						autoComplete="tel"
						aria-invalid={!!errors.phone}
						aria-describedby={errors.phone ? "phone-error" : undefined}
					/>
						{errors.phone && <p id="phone-error" className={errorTextClass}>{errors.phone}</p>}
			</div>
			</div>
		</section>
	);
};