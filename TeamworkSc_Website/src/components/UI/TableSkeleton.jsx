const SkeletonLoader = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 animate-pulse">
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            {Array.from({ length: 5 }).map((_, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
              >
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Array.from({ length: 10 }).map(
            (
              _,
              rowIndex // Increased to 10 rows
            ) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default SkeletonLoader;
