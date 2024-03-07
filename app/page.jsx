import Overview from "@/components/dashboard/Overview";
import OrdersTabs from "@/components/utility/OrderTabs";

const Home = () => {
  return (
    <>
      <h1 className="font-semibold text-xl md:text-3xl my-2">
        Mazinda : Admin Dashboard
      </h1>
      {/* <Overview /> */}
      <OrdersTabs />
    </>
  );
};

export default Home;
