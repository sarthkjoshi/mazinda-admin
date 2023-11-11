const Overview = () => {
    return (
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <h2 className="font-semibold text-xl text-gray-800">Overview</h2>
        <div className="flex my-2">
          <div className="w-1/3 bg-red-500 p-4 text-white rounded-xl mx-2">
            <span className="mr-5 block">Total Sales</span>
            <span className="block text-3xl font-bold">1,00,000</span>
          </div>
  
          <div className="w-1/3 bg-yellow-700 p-4 text-white rounded-xl mx-2">
            <span className="mr-5 block">Total Orders</span>
            <span className="block text-3xl font-bold">1,00,000</span>
          </div>
  
          <div className="w-1/3 bg-pink-400 p-4 text-white rounded-xl mx-2">
            <span className="mr-5 block">Previous Day orders</span>
            <span className="block text-3xl font-bold">1,00,000</span>
          </div>
        </div>
      </div>
    );
  };
  
  export default Overview;  