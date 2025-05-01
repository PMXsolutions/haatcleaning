import { FC } from 'react';

interface TestimonialProps {
  quote: string;
  name: string;
  location: string;
}

const Testimonial: FC<TestimonialProps> = ({ quote, name, location }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
      <p className="text-primary font-text font-medium mb-4 text-lg">"{quote}"</p>
      <div className="mt-auto">
        <p className="font-semibold">{name}</p>
        <p className="text-sm">{location}</p>
      </div>
    </div>
  );
};

interface TestimonialsProps {
  title?: string;
}

export const Testimonials: FC<TestimonialsProps> = ({ 
  title = "What our clients say about our services" 
}) => {
  const testimonials = [
    {
      quote: "Top-notch cleaning services, highly recommend Fresh! Our home has never looked better and the attention to detail is extraordinary.",
      name: "Lilly Cannon",
      location: "Los Angeles"
    },
    {
      quote: "Fresh delivers exceptional cleanliness and service! Their team was professional, on-time, and thoroughly cleaned areas previous services missed.",
      name: "Matt Spencer",
      location: "New York"
    },
    {
      quote: "Our space feels refreshed and immaculate thanks to Fresh. Their eco-friendly products leave no harsh chemical smells, just a clean, healthy environment.",
      name: "Milly Brown",
      location: "Los Angeles"
    },
    {
      quote: "Trust for professional, dependable, and cleaning excellence. Scheduling is easy, staff is courteous, and results are consistently impressive.",
      name: "Dann Green",
      location: "Los Angeles"
    },
    {
      quote: "Reliable, efficient, and thorough always exceeds expectations. They've been cleaning my office for years and I couldn't imagine using anyone else.",
      name: "Morgan Smith",
      location: "New York"
    },
    {
      quote: "No other service compares to the quality is exceptional. Their team respects our space and transforms it every time - worth every penny!",
      name: "Miley Valle",
      location: "New York"
    }
  ];

  return (
    <div className="bg-muted py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl max-w-3xl mx-auto font-bold text-center text-primary font-heading mb-10">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              location={testimonial.location}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

