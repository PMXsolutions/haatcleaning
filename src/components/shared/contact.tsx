"use client";
import { Button } from "@/components/shared/button";
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner";
import React from "react";

interface FormValues {
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactUs() {
  const [values, setValues] = React.useState<FormValues>({
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = React.useState<Partial<FormValues>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Form validation function
  const validateForm = () => {
    const newErrors: Partial<FormValues> = {};
    if (!values.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      newErrors.email = "Invalid email format";

    if (!values.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d+$/.test(values.phone))
      newErrors.phone = "Phone number must be numeric";

    if (!values.subject.trim()) newErrors.subject = "Subject is required";
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
        message: values.message,
        recipient: 'olabodegrace98@gmail.com', 
        mailFrom: values.email, 
        subject: values.subject
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
          email: "",
          phone: "",
          subject: "",
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
    <main className="">
      <Toaster />

      <section className="bg-gold my-24 rounded-lg">
        <div className="max-w-2xl mx-auto">
          <div className="lg:mt-10">
            <div className="py-6 rounded-lg px-4 md:px-8 order-2">
              <div className="text-center mb-10 pt-10">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading text-primary mb-4">Contact Us</h2>
                <p className="text-lg text-primary font-text max-w-2xl mx-auto">
                  Choose the perfect cleaning package for your home or business needs
                </p>
              </div>
              <form onSubmit={onSubmit}>
                {/* Email */}
                <div className="mt-4">
                  <label className="block mb-2 lg:text-lg text-sm text-primary">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="name@email.com"
                    className="block w-full px-5 py-2.5 mt-2 text-primary placeholder-gray-400 bg-primary rounded-lg"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
                {/* Mobile Number */}
                <div className="mt-4">
                  <label className="block mb-2 lg:text-lg text-sm text-primary">
                    Your Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    placeholder="Mobile number"
                    className="block w-full px-5 py-2.5 mt-2 text-primary placeholder-gray-400 bg-primary rounded-lg"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>
                {/* Subject */}
                <div className="mt-4">
                  <label className="block mb-2 lg:text-lg text-sm text-primary">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={values.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="block w-full px-5 py-2.5 mt-2 text-primary placeholder-gray-400 bg-primary rounded-lg"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm">{errors.subject}</p>
                  )}
                </div>
                {/* Message */}
                <div className="w-full mt-4">
                  <label className="block mb-2 lg:text-lg text-sm text-primary">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={values.message}
                    onChange={handleChange}
                    className="block w-full h-32 px-5 py-2.5 mt-2 text-primary placeholder-gray-400 bg-white border border-gray-200 rounded-lg md:h-56"
                    placeholder="Message"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="mt-4">
                  <Button 
                    disabled={isSubmitting}
                    label={isSubmitting ? "Sending..." : "Send Message"} 
                    variant="outline"
                  />
                </div>
              </form>
            </div>
            {/* <div className="flex flex-col gap-6 ">
              <div>
                <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl lg:text-4xl font-serif ">
                  Contact us
                </h1>
              </div>
              <div className="text-white">
                <h2 className=" text-base lg:text-lg font-medium font-serif ">
                  Address
                </h2>
                <p className="  text-gray-200">Gold Coast, Qld, Australia.</p>
              </div>
              <div className="text-white">
                <h2 className=" text-base lg:text-lg font-medium font-serif ">
                  Email
                </h2>
                <p className="  text-gray-200">info@shemewe.com.au</p>
              </div>
              <div className="text-white">
                <h2 className=" text-base lg:text-lg font-medium font-serif ">
                  Phone
                </h2>
                <p className="  text-gray-200">+61 7 5509 4427</p>
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </main>
  );
}
