import { Users } from "lucide-react";
import Footer from "../../../../components/Footer/Footer";
import Navbar from "../../../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTeamEntries } from "../../../../services/TeamService";
import TeamSkeleton from "./TeamSkeleton";

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [displayCount, setDisplayCount] = useState(3); // Start with 3 members displayed
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAllTeamMembers();
  }, []);

  const getAllTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await getTeamEntries();
      setTeamMembers(response?.team?.services || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 3); // Increase by 3
  };

  const handleShowLess = () => {
    setDisplayCount((prev) => Math.max(prev - 3, 3)); // Decrease by 3, but not less than 3
  };

  return (
    <div className="font-sans antialiased bg-white text-[#3a4253] overflow-x-hidden">
      {/* Fixed Navbar */}
      <div className="w-full fixed top-0 z-50 bg-white shadow">
        <Navbar />
      </div>
      <section className="pt-44 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
          <div>
            <div className="flex items-center gap-2 text-[#EB6407] mb-4">
              <Users className="w-6 h-6" />
              <span className="text-lg font-bold uppercase tracking-wider">
                Our Team
              </span>
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Meet the People Behind the Product
            </h1>
            <blockquote className="text-lg text-gray-500 italic border-l-4 border-orange-300 pl-4">
              “Visionaries, builders, and problem-solvers dedicated to
              transforming public service through technology.”
            </blockquote>
          </div>
          <div>
            <div className="bg-orange-50 border-l-4 border-orange-200 rounded-xl px-6 py-4 shadow-sm">
              <p className="text-gray-700 text-lg leading-relaxed">
                Our multidisciplinary team combines engineering excellence with
                user-first design to create solutions that are not just
                innovative--but inclusive, scalable, and built for long-term
                impact.
              </p>
            </div>
          </div>
        </div>
        {/* Team Cards */}
        {loading ? (
          <TeamSkeleton />
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.slice(0, displayCount).map((member) => (
              <div
                key={member.id}
                className="relative bg-white border border-gray-100 rounded-3xl p-6 pt-10 shadow-md hover:shadow-xl transition duration-300 text-center"
              >
                <div className="w-24 h-24 mx-auto -mt-16 rounded-full overflow-hidden shadow-lg border-4 border-white">
                  <img
                    src={member.imageUrl}
                    alt={member.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[#3a4253]">
                  {member.fullName}
                </h3>
                <p className="text-sm text-[#EB6407] font-medium mb-4">
                  {member.title}
                </p>
                <p className="text-sm text-gray-600 italic leading-relaxed">
                  {member.quote}
                </p>
              </div>
            ))}
          </div>
        )}
        {/* Show More / Show Less Buttons */}
        <div className="flex justify-center mt-6 gap-4">
          {teamMembers.length > 3 && displayCount < teamMembers.length && (
            <button
              onClick={handleShowMore}
              className="bg-[#EB6407] text-white font-bold py-2 px-6 rounded transition duration-300 hover:bg-orange-700 shadow-lg"
            >
              Show More
            </button>
          )}
          {displayCount > 3 && (
            <button
              onClick={handleShowLess}
              className="bg-slate-600 text-white font-bold py-2 px-6 rounded transition duration-300 hover:bg-slate-700 shadow-lg"
            >
              Show Less
            </button>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100 border border-orange-200 rounded-3xl p-10 text-center shadow-md">
          <p className="text-gray-800 text-2xl font-semibold max-w-xl mx-auto mb-6">
            Want to work with people who care deeply about impact, innovation,
            and inclusion?
          </p>
          <button
            onClick={() => navigate("/posts/jobs")}
            className="inline-flex items-center justify-center gap-2 bg-[#EB6407] hover:bg-orange-700 text-white font-bold text-lg px-12 py-4 rounded-full transition-all shadow-md hover:shadow-xl"
          >
            See Open Positions
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;
