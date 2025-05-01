import { FC, useState } from 'react';
import { FiChevronsDown, FiChevronsRight } from "react-icons/fi";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
}

const FAQItem: FC<FAQItemProps> = ({ question, answer, isOpen, toggleOpen }) => {
  return (
    <div className="border-b border-color font-text text-primary py-4">
      <button 
        className="flex justify-between items-center w-full text-left"
        onClick={toggleOpen}
      >
        <h3 className="font-bold">{question}</h3>
        <div className="text-gold">
          {isOpen ? <FiChevronsDown size={20} /> : <FiChevronsRight size={20} />}
        </div>
      </button>
      {isOpen && (
        <div className="mt-3 text-primary">
          {answer}
        </div>
      )}
    </div>
  );
};

interface FAQProps {
  title?: string;
}

const FAQ: FC<FAQProps> = () => {
  const faqs = [
    {
      question: "In which locations do you service?",
      answer: "We currently provide cleaning services throughout Los Angeles County, Orange County, and the greater New York City area including Manhattan, Brooklyn, and parts of New Jersey. We're continuously expanding to new locations to meet growing demand."
    },
    {
      question: "Can I stick to the same cleaner always?",
      answer: "Yes! We understand the importance of consistency and trust. Once you find a cleaner you're comfortable with, we prioritize maintaining that relationship. While we cannot guarantee the same cleaner for every service due to scheduling, vacations, or illness, we make every effort to honor your preference for consistency."
    },
    {
      question: "Do you offer daily cleaning services?",
      answer: "Absolutely. We offer flexible scheduling options including daily, weekly, bi-weekly, and monthly services. For commercial clients, we also provide customized cleaning schedules that work around your business hours. All daily service plans come with special pricing."
    },
    {
      question: "Are you currently hiring cleaning staff?",
      answer: "Yes, we're always looking for professional, reliable team members who take pride in their work. All our staff undergo thorough background checks and training. If you're interested in joining our team, please visit our Careers page to view current openings and submit your application."
    }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(index === openIndex ? -1 : index);
  };

  return (
    <div className="">
      {/* <h2 className="text-2xl font-bold text-primary font-text mb-6">{title}</h2> */}
      <div>
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={index === openIndex}
            toggleOpen={() => toggleFAQ(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQ;