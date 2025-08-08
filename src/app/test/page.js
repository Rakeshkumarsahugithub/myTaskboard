export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Tailwind CSS Test
        </h1>
        <div className="space-y-4">
          <div className="bg-blue-500 text-white p-4 rounded-lg">
            Blue background with white text
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg">
            Green background with white text
          </div>
          <div className="bg-red-500 text-white p-4 rounded-lg">
            Red background with white text
          </div>
          <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded transition-colors">
            Hover me!
          </button>
        </div>
      </div>
    </div>
  );
} 