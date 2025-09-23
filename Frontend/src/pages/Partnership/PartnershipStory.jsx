import React, { useEffect, useState } from "react";
import { getPartnershipStory } from "../../services/TestimonyService";
import { Loader2 } from "lucide-react";

const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="h-8 w-8 text-[#EB6407] animate-spin" />
  </div>
);

const PartnershipStory = () => {
  const [partners, setPartners] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3); // Start by showing 3 partners
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getPartners();
  }, []);

  const getPartners = async () => {
    setLoading(true);
    try {
      const response = await getPartnershipStory();
      setPartners(response.partner?.rows);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 3); // Show 3 more partners each time
  };
  const handleShowLess = () => {
    setVisibleCount((prevCount) => prevCount - 3); // Show 3 more partners each time
  };

  if (loading) {
    return <Loader />;
  }
  if (!partners || partners.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-12 relative border-l-4 border-orange-100 pl-8">
        <p className="text-gray-500 text-sm">No recent partners found.</p>
      </div>
    );
  }
  return (
    <div>
      <div className="max-w-4xl mx-auto space-y-12 relative border-l-4 border-orange-100 pl-8">
        {partners.length > 0 ? (
          partners.slice(0, visibleCount).map((item) => (
            <div key={item.id} className="relative pl-6">
              {item.user?.profilePicture ? (
                <img
                  className="absolute -left-[30px] top-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-xl shadow text-orange-600 font-bold"
                  src={item.user?.profilePicture}
                  alt={item.fullName}
                />
              ) : (
                <div className="absolute -left-[30px] top-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-xl shadow text-orange-600 font-bold">
                  🤝
                </div>
              )}
              <div className="bg-white shadow-md rounded-xl p-6 text-left">
                <h3 className="text-lg font-bold text-[#EB6407]">
                  {item.fullName}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{item.profession}</p>
                <p className="text-gray-700 text-sm">
                  “{item.abilityForPartnership}”
                </p>
                {item.abilityDescription && (
                  <p className="text-gray-600 text-sm mt-1">
                    {item.abilityDescription}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No recent partners found.</p>
        )}

        {partners.length > visibleCount && (
          <button
            onClick={handleShowMore}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Show More
          </button>
        )}

        {visibleCount > 3 && (
          <button
            onClick={handleShowLess}
            className="mt-4 inline-flex items-center px-4 mx-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
};

export default PartnershipStory;
