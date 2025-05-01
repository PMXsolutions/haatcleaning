// import { StatBox } from '@/components/shared/statBox';
// import FeatureItem from '@/components/shared/featureItem';
// import { RiHeartsFill, RiUserFill, RiCalendar2Fill } from "react-icons/ri";
// import { ImCheckboxChecked } from "react-icons/im";

// const features = [
//   "Window Cleaner",
//   "Carpet Cleaner",
//   "Work Vans",
//   "Floor Polisher",
//   "Microfiber",
//   "Sanitizer",
//   "Water Jet Cleaner",
//   "Steam Cleaner",
// ];

// const stats = [
//   {
//     icon: <RiHeartsFill className="w-8 h-8 md:w-14 md:h-14 text-gold" />,
//     value: '3000',
//     label: 'Happy Clients',
//   },
//   {
//     icon: <RiUserFill className="w-8 h-8 md:w-14 md:h-14 text-gold" />,
//     value: '100',
//     label: 'Employees',
//   },
//   {
//     icon: <ImCheckboxChecked className="w-8 h-8 md:w-14 md:h-14 text-gold" />,
//     value: '5000',
//     label: 'Jobs Done',
//   },
//   {
//     icon: <RiCalendar2Fill className="w-8 h-8 md:w-14 md:h-14 text-gold" />,
//     value: '2012',
//     valueSuffix: '', 
//     label: 'Founded In',
//   },
// ];


// const About = () => {
//   return (
//     <section className="py-16 bg-primary">
//       <div className="max-w-6xl mx-auto px-4 text-center">
//         <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary font-heading mb-4">About our company</h2>
//         <p className="max-w-3xl mx-auto text-lg text-primary font-text mb-12">
//           We are a professional cleaning service dedicated to creating spotless and healthy environments. 
//           Since our founding in 2012, we've proudly served thousands of happy clients with precision and care.
//         </p>

//         <div className="mb-12 flex justify-center">
//           <img 
//             src="/images/148192.jpg" 
//             alt="Our cleaning team" 
//             className="w-full rounded-lg shadow-lg"
//           />
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {stats.map((stat, index) => (
//             <StatBox
//               key={index}
//               icon={stat.icon}
//               value={stat.value}
//               label={stat.label}
//               valueSuffix={stat.valueSuffix ?? '+'}
//             />
//           ))}
//         </div>
//       </div>

//       <section className="py-16 px-4 md:px-12 flex flex-col md:flex-row items-center gap-12">
//       <div className="w-full md:w-1/2">
//         <img 
//           src=""
//           alt="Cleaning team" 
//           className="w-full" 
//         />
//       </div>
//       <div className="w-full md:w-1/2">
//         <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//           We have the best staff & equipment
//         </h2>
//         <p className="text-gray-600 mb-6">
//           Our team is trained, experienced, and equipped with the latest tools to make your space spotless. We invest in quality equipment and reliable transportation to ensure top-notch service every time.
//         </p>
//         <div className="grid grid-cols-2 gap-y-4 gap-x-6">
//           {features.map((item) => (
//             <FeatureItem key={item} text={item} />
//           ))}
//         </div>
//       </div>
//     </section>

//     </section>
//   );
// };

// export default About;
