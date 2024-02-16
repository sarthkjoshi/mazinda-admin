import EditImageForm from "@/components/EditImageForm";
import LookingSectionLists from "@/components/looking-for/ImageLists";
const ManageLayout = () => {
  const carouselImagePaths = [
    "https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/top-carousel/1.jpeg",
    "https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/top-carousel/2.jpeg",
    "https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/top-carousel/3.jpeg",
    "https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/top-carousel/4.jpeg",
  ];

  const squareImagesPaths = [
    "https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/square-four-images/1.jpg",
    "https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/square-four-images/2.jpg",
    "https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/square-four-images/3.jpg",
    "https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/square-four-images/4.jpg",
  ];

  const bannerOnePath =
    "https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/banner_one.JPG";
  const bannerTwoPath =
    "https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/banner_end.JPG";

  return (
    <div className="bg-white rounded-md h-full p-5">
      <h1 className="mt-3 mb-8 text-2xl font-bold">
        Customise and Edit the Images of the UI
      </h1>
      <div className="border border-gray-200 p-5 rounded-lg flex flex-col gap-5">
        <h1 className="text-center text-xl">Top Carousel</h1>
        {carouselImagePaths.map((imagePath, index) => (
          <div key={index} className="flex justify-evenly border-b-2 py-3">
            <img
              src={imagePath}
              alt={`banner-${index + 1}`}
              className="w-1/2"
            />
            <EditImageForm existingImagePath={imagePath} />
          </div>
        ))}
      </div>

      <div className="border border-gray-200 p-5 rounded-lg flex flex-col gap-5">
        <h1 className="text-center text-xl">What are you looking for ?</h1>

         
        <LookingSectionLists/>

        {/* {squareImagesPaths.map((imagePath, index) => (
          <div key={index} className="flex justify-evenly border-b-2 py-3">
            <img
              src={imagePath}
              alt={`img-${index + 1}`}
              className="w-[20vw] border border-gray-200"
            />
            <EditImageForm existingImagePath={imagePath} />
          </div>
        ))} */}
      </div>

      <div className="border border-gray-200 p-5 rounded-lg flex flex-col gap-5">
        <h1 className="text-center text-xl">Promotional Banner 1</h1>
        <div className="flex justify-evenly border-b-2 py-3">
          <img
            src={bannerOnePath}
            alt={`banner-one`}
            className="w-1/2 border border-gray-200"
          />
          <EditImageForm existingImagePath={bannerOnePath} />
        </div>
      </div>

      <div className="border border-gray-200 p-5 rounded-lg flex flex-col gap-5">
        <h1 className="text-center text-xl">Promotional Banner 2</h1>
        <div className="flex justify-evenly border-b-2 py-3">
          <img
            src={bannerTwoPath}
            alt={`banner-two`}
            className="w-1/2 border border-gray-200"
          />
          <EditImageForm existingImagePath={bannerTwoPath} />
        </div>
      </div>
    </div>
  );
};

export default ManageLayout;
