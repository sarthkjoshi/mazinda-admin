"use client";

import EditIcon from '@mui/icons-material/Edit';

import { useRouter } from 'next/navigation';

const AvailableStores = ( {stores} ) => {
  const router = useRouter()

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm overflow-scroll">
      <div className="font-semibold text-xl text-gray-800">
        Available Stores
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full ">
          <thead className="border-b">
            <tr>
              <th className="py-3 text-gray-600">Store ID</th>
              <th className="py-3 text-gray-600">Store Name</th>
              <th className="py-3 text-gray-600">Products</th>
              <th className="py-3 text-gray-600">Location</th>
              <th className="py-3 text-gray-600">Options</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store, index) => (
              <tr key={index}>
                <td className="text-center py-2 whitespace-nowrap border-b border-gray-300 text-gray-700">
                  {store._id.slice(-5)}
                </td>
                <td className="text-center py-2 whitespace-nowrap border-b border-gray-300">
                  {store.storeName}
                </td>
                <td className="text-center py-2 whitespace-nowrap border-b border-gray-300">
                  {store.products}
                </td>
                <td className="text-center py-2 whitespace-nowrap border-b border-gray-300 text-green-500">
                  {store.storeAddress.address}, {store.storeAddress.city}
                </td>
                <td className="text-center py-2 whitespace-nowrap border-b border-gray-300">
                  <button
                    onClick={() => router.push(`/admin/store-details?id=${store._id}`)}
                    className="mx-1 bg-yellow-300 hover:bg-yellow-700 text-gray-800 text-sm py-1 px-2 rounded-full"
                  >
                    <EditIcon className='text-white' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AvailableStores;
