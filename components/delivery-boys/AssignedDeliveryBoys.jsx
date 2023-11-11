"use client";

// import DeleteIcon from '@mui/icons-material/Delete';
// import VisibilityIcon from '@mui/icons-material/Visibility';

const AssignedDeliveryBoys = () => {
  const deliveryPersons = [
    {
      id: 1,
      name: "Delivery Person 1",
      phone: 9876543210,
      location: "New York",
    },
    {
      id: 2,
      name: "Delivery Person 2",
      phone: 9876543210,
      location: "Los Angeles",
    },
    {
      id: 3,
      name: "Delivery Person 3",
      phone: 9876543210,
      location: "Chicago",
    },
    {
      id: 4,
      name: "Delivery Person 4",
      phone: 9876543210,
      location: "San Francisco",
    },
    {
      id: 5,
      name: "Delivery Person 5",
      phone: 9876543210,
      location: "Miami",
    },
  ];

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm h-screen overflow-scroll">
      <div className="text-2xl font-semibold mb-2">
        Assigned Delivery Boys
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full ">
          <thead className="border-b">
            <tr>
              <th className="py-3 text-gray-600">ID</th>
              <th className="py-3 text-gray-600">Name</th>
              <th className="py-3 text-gray-600">Mobile No</th>
              <th className="py-3 text-gray-600">Location</th>
              <th className="py-3 text-gray-600">Options</th>
            </tr>
          </thead>
          <tbody>
            {deliveryPersons.map((person) => (
              <tr key={person.id}>
                <td className="pl-6 py-3 whitespace-nowrap border-b border-gray-300 text-gray-700">
                  {person.id}
                </td>
                <td className="pl-6 py-3 whitespace-nowrap border-b border-gray-300">
                  {person.name}
                </td>
                <td className="pl-6 py-3 whitespace-nowrap border-b border-gray-300">
                  {person.phone}
                </td>
                <td className="pl-6 py-3 whitespace-nowrap border-b border-gray-300 text-[#3cb0a2]">
                  {person.location}
                </td>
                <td className="pl-6 py-3 whitespace-nowrap border-b border-gray-300">
                  <button
                    onClick={() => onDeleteStore(store.id)}
                    className="mx-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm py-1 px-2 rounded-full"
                  >
                     Delete
                  </button>
                  <button
                    onClick={() => {}}
                    className="mx-1 bg-[#2dd26f] hover:opacity-80 text-white text-sm py-1 px-2 rounded-full"
                  >
                     View
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

export default AssignedDeliveryBoys;
