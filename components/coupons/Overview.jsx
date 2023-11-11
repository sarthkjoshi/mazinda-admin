const Overview = () => {
    return (
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <h2 className="font-semibold text-xl text-gray-800">Overview</h2>
        <div className="flex my-2">
          <div className="w-1/3 bg-red-500 p-4 text-white rounded-xl mx-2 shadow-md">
            <span className="mr-5 block">Coupons Activated</span>
            <span className="block text-3xl font-bold">43</span>
          </div>
  
          <div className="w-1/3 bg-yellow-700 p-4 text-white rounded-xl mx-2 shadow-md">
            <span className="mr-5 block">Coupons Disabled</span>
            <span className="block text-3xl font-bold">5</span>
          </div>
        </div>
      </div>
    );
  };
  
  export default Overview;