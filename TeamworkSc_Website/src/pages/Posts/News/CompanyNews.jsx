

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Newspaper, Rocket, Award, Users } from 'lucide-react';
// import Footer from '../../../components/Footer/Footer';
// import Navbar from '../../../components/Navbar/Navbar';

// const allNews = [
//   {
//     title: 'TeamSync 3.0 Released with Real-Time Collaboration',
//     date: '2025-05-15',
//     description: 'Major upgrade with real-time editing, AI-assisted notes, and smarter task syncing.',
//     type: 'Product',
//   },
//   {
//     title: 'We’ve Raised $75M in Series C',
//     date: '2025-04-10',
//     description: 'Funding to build seamless tools for hybrid and remote collaboration.',
//     type: 'Milestone',
//   },

//   {
//     title: 'Meet Our New CTO: Maria Chen',
//     date: '2025-02-28',
//     description: 'Maria Chen joins to lead innovation and shape engineering culture.',
//     type: 'Leadership',
//   },
//   {
//     title: 'Opened New Office in Berlin',
//     date: '2024-11-10',
//     description: 'Expanding global presence with our first EU HQ.',
//     type: 'Milestone',
//   },
// ];

// const typeIcons = {
//   Product: <Rocket className="w-4 h-4 inline-block mr-1 text-orange-600" />,
//   Milestone: <Award className="w-4 h-4 inline-block mr-1 text-orange-600" />,
//   Leadership: <Users className="w-4 h-4 inline-block mr-1 text-orange-600" />,
// };

// const News = () => {
//   const [selectedType, setSelectedType] = useState('All');

//   const filtered = selectedType === 'All'
//     ? allNews
//     : allNews.filter(item => item.type === selectedType);

//   const grouped = filtered.reduce((acc, item) => {
//     const year = new Date(item.date).getFullYear().toString();
//     if (!acc[year]) acc[year] = [];
//     acc[year].push(item);
//     return acc;
//   }, {});

//   const years = Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a));

//   return (
//     <div className="bg-white min-h-screen text-[#3a4253]">
//       <div className="fixed w-full z-50 bg-white shadow">
//         <Navbar />
//       </div>

//       <section className="pt-44 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
//         <div className="flex items-center gap-3 mb-12">
//           <Newspaper className="text-[#EB6407] w-7 h-7" />
//           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
//             Company News 
//           </h1>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-wrap gap-3 mb-10">
//           {['All', 'Product', 'Milestone', 'Leadership'].map(tag => (
//             <button
//               key={tag}
//               onClick={() => setSelectedType(tag)}
//               className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border shadow-sm ${
//                 selectedType === tag
//                   ? 'bg-[#EB6407] text-white border-[#EB6407]'
//                   : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
//               }`}
//             >
//               {tag}
//             </button>
//           ))}
//         </div>

//         {/* Timeline */}
//         <div className="relative border-l-[3px] border-orange-200 pl-6 space-y-16">
//           {years.map(year => (
//             <div key={year}>
//               <div className="sticky top-20 bg-white/80 backdrop-blur-md px-2 py-1 z-10 mb-4 rounded-md w-fit">
//                 <h2 className="text-lg font-semibold tracking-widest uppercase text-gray-500">
//                   {year}
//                 </h2>
//               </div>

//               <AnimatePresence mode="wait">
//                 {grouped[year].map((item, idx) => (
//                   <motion.div
//                     key={`${item.title}-${selectedType}`}
//                     initial={{ opacity: 0, y: 30 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.3, delay: idx * 0.05 }}
//                     className="relative mb-10"
//                   >
//                     <div className="absolute left-[-0.7rem] top-4 w-4 h-4 bg-[#EB6407] rounded-full border-[3px] border-white shadow-md z-10" />
//                     <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
//                       <div className="flex justify-between items-center mb-1">
//                         <p className="text-sm text-gray-500">{new Date(item.date).toDateString()}</p>
//                         <span className="inline-flex items-center text-xs font-medium px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
//                           {typeIcons[item.type]} {item.type}
//                         </span>
//                       </div>
//                       <h3 className="text-xl font-bold text-[#3a4253] leading-snug">{item.title}</h3>
//                       <p className="mt-3 text-sm text-gray-600 leading-relaxed">
//                         {item.description}
//                       </p>
//                     </div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>
//           ))}
//         </div>

//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default News;


