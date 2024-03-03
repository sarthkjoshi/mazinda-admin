import AddBanner from "@/components/banners/AddBanner";
import ShowLayout from "@/components/banners/ShowLayout";

const ManageLayout = () => {
  return (
    <div className="bg-white rounded-md h-full p-5">
      <h1 className="mt-3 mb-8 text-2xl font-bold">
        Customise and Edit the Images of the UI
      </h1>

      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-3">
          <ShowLayout />
        </div>
        <AddBanner />
      </div>
    </div>
  );
};

export default ManageLayout;
