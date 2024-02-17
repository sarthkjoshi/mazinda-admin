import CurrentOrders from "@/components/dashboard/CurrentOrders";
import Overview from "@/components/dashboard/Overview";
import OrdersTabs from "@/components/utility/OrderTabs";

const Dashboard = () => {
  return (
    <>
      <h1 className="font-semibold text-3xl my-2">Mazinda : Admin Dashboard</h1>
      <Overview />
      <OrdersTabs />
      {/* <CurrentOrders /> */}
    </>
  );
};

export default Dashboard;
