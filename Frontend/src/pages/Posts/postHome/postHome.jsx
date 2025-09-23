'use client';
import {
  FaNewspaper,
  FaCalendarAlt,
  FaBriefcase,
  FaUsers,
  FaHandshake,
} from 'react-icons/fa';
import Footer from '../../../components/Footer/Footer';
import Navbar from '../../../components/Navbar/Navbar';

const categories = [
  {
    title: 'News',
    desc: 'Press releases, announcements, and media coverage.',
    icon: <FaNewspaper />,
    link: '/posts/news',
  },
  {
    title: 'Events',
    desc: 'Webinars, conferences, and speaking engagements.',
    icon: <FaCalendarAlt />,
    link: '/posts/events',
  },
  {
    title: 'Jobs',
    desc: 'Join our mission-driven team. View open positions.',
    icon: <FaBriefcase />,
    link: '/posts/jobs',
  },
  {
    title: 'Our Team',
    desc: 'Get to know the people behind the work.',
    icon: <FaUsers />,
    link: '/posts/more/team',
  },
  {
    title: 'Collaborations',
    desc: 'Explore our partners and joint initiatives.',
    icon: <FaHandshake />,
    link: '/posts/more/collaborations',
  },
];

const PostsHome = () => {
  return (
    <div className="font-sans antialiased bg-white text-[#3a4253] overflow-x-hidden">
      {/* Fixed Navbar */}
      <div className="w-full fixed top-0 z-50 bg-white shadow">
        <Navbar />
      </div>

      {/* Main Content */}
      <section className="pt-44 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Page Heading */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-gray-900">
              Discover What’s New
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Browse updates, job openings, events and stories from our team and partners.
            </p>
          </div>

          {/* Featured Insight */}
          <div className="bg-orange-50 rounded-2xl p-8 shadow-lg border border-orange-100">
            <h2 className="text-2xl font-bold mb-4 text-[#EB6407]">Featured Insight</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">Scaling a SaaS App to 1M Users</h3>
                <p className="text-gray-600 text-sm">
                  Our engineers share lessons learned from building high-availability systems for scale.
                </p>
                <a
                  href="/posts/news"
                  className="mt-2 inline-block text-[#EB6407] hover:underline font-medium"
                >
                  Read full story →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ title, desc, icon, link }, idx) => (
            <a
              key={idx}
              href={link}
              className="relative group p-6 rounded-2xl bg-white border border-orange-100 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute -top-6 left-6 w-14 h-14 flex items-center justify-center rounded-full bg-[#EB6407] text-white text-2xl shadow ring-4 ring-white">
                {icon}
              </div>
              <div className="mt-10">
                <h3 className="text-xl font-semibold text-[#3a4253] mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
                <div className="mt-4 text-sm text-[#EB6407] font-semibold group-hover:underline">
                  Read more →
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PostsHome;
