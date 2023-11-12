import CurrentOrders from "@/components/dashboard/CurrentOrders";
import Overview from "@/components/dashboard/Overview";

const Dashboard = () => {
  return (
    <>
      <h1 className="font-semibold text-3xl my-2">Mazinda : Admin Dashboard</h1>
      <Overview />
      <CurrentOrders />
    </>
  );
};

export default Dashboard;