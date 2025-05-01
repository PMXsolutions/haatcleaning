import { Link } from 'react-router-dom'
import { StatBox } from '@/components/shared/statBox';
import { ValueCard } from '@/components/shared/valueCard';
import FeatureItem from '@/components/shared/featureItem';
import { Button } from '@/components/shared/button'
import { RiHeartsFill, RiUserFill, RiCalendar2Fill } from "react-icons/ri";
import { ImCheckboxChecked } from "react-icons/im";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaHandHoldingHeart, FaShieldAlt, FaAward } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import { VscWorkspaceTrusted } from "react-icons/vsc";

const features = [
  "Window Cleaner",
  "Carpet Cleaner",
  "Work Vans",
  "Floor Polisher",
  "Microfiber",
  "Sanitizer",
  "Water Jet Cleaner",
  "Steam Cleaner",
];

const stats = [
  {
    icon: <RiHeartsFill className="w-8 h-8 md:w-14 md:h-14 text-gold" />,
    value: '3000',
    label: 'Happy Clients',
  },
  {
    icon: <RiUserFill className="w-8 h-8 md:w-14 md:h-14 text-gold" />,
    value: '100',
    label: 'Employees',
  },
  {
    icon: <ImCheckboxChecked className="w-8 h-8 md:w-14 md:h-14 text-gold" />,
    value: '5000',
    label: 'Jobs Done',
  },
  {
    icon: <RiCalendar2Fill className="w-8 h-8 md:w-14 md:h-14 text-gold" />,
    value: '2012',
    valueSuffix: '', 
    label: 'Founded In',
  },
];

const values = [
  {
    icon: <FaMagnifyingGlass className="h-10 w-10" />,
    title: "Transparency",
    description: "We operate with complete openness and honesty in all our business practices and communications."
  },
  {
    icon: <FaHandHoldingHeart className="h-10 w-10" />,
    title: "Responsibility",
    description: "We take ownership of our actions and are committed to delivering on our promises to customers."
  },
  {
    icon: <FaShieldAlt className="h-10 w-10" />,
    title: "Security",
    description: "We prioritize the protection of your data and privacy with industry-leading safeguards and protocols."
  },
  {
    icon: <IoTime className="h-10 w-10" />,
    title: "Punctuality",
    description: "We respect your time and consistently deliver our services when promised, without delays."
  },
  {
    icon: <VscWorkspaceTrusted className="h-10 w-10" />,
    title: "Trust",
    description: "We build lasting relationships with clients through reliability, integrity, and consistent excellence."
  },
  {
    icon: <FaAward className="h-10 w-10" />,
    title: "Quality",
    description: "We are dedicated to exceeding expectations with superior service and attention to detail."
  }
];

export const About = () => {
  return (
    <section className="bg-primary">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatBox
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              valueSuffix={stat.valueSuffix ?? '+'}
            />
          ))}
        </div>
      </div>

      <section className="py-16 px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2">
          <img 
            src="images/2148818472.jpg"
            alt="Cleaning team" 
            className="w-full" 
          />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-4">
            We have the best staff & equipment
          </h2>
          <p className="text-primary font-text mb-6">
            Our team is trained, experienced, and equipped with the latest tools to make your space spotless. We invest in quality equipment and reliable transportation to ensure top-notch service every time.
          </p>
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            {features.map((item) => (
              <FeatureItem key={item} text={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary font-heading text-center mb-4">Our values</h2>
          <p className="text-center text-primary font-text mb-12 max-w-2xl mx-auto">
            We're guided by a core set of principles that define who we are and how we work with our clients and partners.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <ValueCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to='/' className='hidden md:flex justify-center'>
              <Button 
                label="Book Now" 
                variant="primary" 
              />
            </Link>
          </div>
        </div>
      </section>
      
    </section>
  );
};

