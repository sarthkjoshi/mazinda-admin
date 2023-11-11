import CouponsList from "@/components/coupons/CouponsList";
import Overview from "@/components/coupons/Overview";
import AddCoupon from '@/components/coupons/AddCoupon';

const Coupons = () => {
  return (
    <div>
      <Overview />
      <div className="flex">
        <div className="my-5 w-2/3">
          <CouponsList />
        </div>
        <div className="my-5 w-1/3">
          <AddCoupon />
        </div>
      </div>
    </div>
  );
};

export default Coupons;
