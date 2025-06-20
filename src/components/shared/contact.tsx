import { Button } from "@/components/shared/button";
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner";
import { Phone, Mail, MapPin } from "lucide-react"
import { useState } from "react";

interface FormValues {
  name: string;
  email: string;
  // subject: string;
  message: string;
}

export default function ContactUs() {
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    // subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Form validation function
  const validateForm = () => {
    const newErrors: Partial<FormValues> = {};
    if (!values.name.trim()) newErrors.name = "Name is required"
    if (!values.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      newErrors.email = "Invalid email format";

    // if (!values.phone.trim()) newErrors.phone = "Phone number is required";
    // else if (!/^\d+$/.test(values.phone))
    //   newErrors.phone = "Phone number must be numeric";

    // if (!values.subject.trim()) newErrors.subject = "Subject is required";
    if (!values.message.trim()) newErrors.message = "Message cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      toast.error("Please fill the form correctly!");
      setIsSubmitting(false);
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading("Sending your message...");

      const serverUrl = 'https://profitmax-001-site10.ctempurl.com/api/Account/general_email_sending';

      const formData = {
        message: `Name: ${values.name}\nEmail: ${values.email}\n\nMessage: ${values.message}`,
        recipient: 'olabodegrace98@gmail.com', 
        mailFrom: values.email, 
        subject: `Contact Form Submission from ${values.name}`,
      };

      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });      
      toast.dismiss(loadingToast);
      
      // Show success toast
      // toast.success("Message sent successfully!");
      
      if (response.ok) {
        // Show success toast
        toast.success("Message sent successfully!");
        
        // Reset form after successful submission
        setValues({
          name: "",
          email: "",
          message: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Failed to connect to the server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  
  };

  return (
    <div className="py-6 md:py-12 lg:py-16">
      <Toaster />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center md:w-[70%] lg:w-full text-center lg:text-left mx-auto  mb-10 lg:mb-0">
          {/* left side */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 font-heading">
                Find us
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-xl">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 text-xl font-body">Call Us</h3>
                  <p className="text-gray-500">(908) 236 201 888</p>
                </div>
              </div>

              {/* Email Now */}
              <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-xl">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 text-xl font-body">Email Now</h3>
                  <p className="text-gray-500">hello@procleaning.com</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-xl">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 text-xl font-body">Address</h3>
                  <p className="text-gray-500">7616 Brand Tower, New York, USA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="">
            <div className="mb-8">
              <p className="md:text-[14px] lg:text-sm uppercase text-gold font-body">
                Contact Info
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 font-heading">Keep In Touch</h2>
              <p className="mb-4 text-gray-600 font-body">
                Choose the perfect cleaning package for your home or business needs
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:shadow-lg outline-none transition-all"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="">
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:shadow-lg outline-none transition-all"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Message */}
              <div className="">
                <textarea
                  name="message"
                  value={values.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:shadow-lg outline-none transition-all"
                  placeholder="Message"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-4">
                <Button 
                  disabled={isSubmitting}
                  label={isSubmitting ? "Sending..." : "Send Message"} 
                  variant="primary"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
