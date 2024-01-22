import CouponsList from "@/components/coupons/CouponsList";
import Overview from "@/components/coupons/Overview";
import AddCoupon from "@/components/coupons/AddCoupon";

const Coupons = () => {
  return (
    <div className="flex flex-col gap-3">
      <Overview />
      <div className="md:grid md:grid-cols-3 gap-3 flex flex-col">
        <div className="col-span-2">
          <CouponsList />
        </div>

        <AddCoupon />
      </div>
    </div>
  );
};

export default Coupons;
