import OrdersList from "./OrdersList";

const CurrentOrders = () => {
  return (
    <div className="p-4 bg-white rounded-xl shadow mt-3">
        <h2 className="text-xl mb-4 font-semibold">Latest Orders History</h2>
        <OrdersList />
    </div>
  )
}

export default CurrentOrders;