
import Image from "next/image";

const Features = () => {
  return (
    <div className="bg-transparent">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-green-800 bg-opacity-50 p-8 rounded-lg text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/pets-welcomed.svg"
                alt="Pets Welcomed"
                width={50}
                height={50}
              />
            </div>
            <h3 className="text-white text-xl">PETS WELCOMED</h3>
          </div>
          <div className="bg-green-800 bg-opacity-50 p-8 rounded-lg text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/sheets-towels.svg"
                alt="Sheets & Towels Incl."
                width={50}
                height={50}
              />
            </div>
            <h3 className="text-white text-xl">
              SHEETS & TOWELS INCL.
            </h3>
          </div>
          <div className="bg-green-800 bg-opacity-50 p-8 rounded-lg text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/full-privacy.svg"
                alt="Full Privacy"
                width={50}
                height={50}
              />
            </div>
            <h3 className="text-white text-xl">FULL PRIVACY</h3>
          </div>
          <div className="bg-green-800 bg-opacity-50 p-8 rounded-lg text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/food-drink.svg"
                alt="Food & Drink Service"
                width={50}
                height={50}
              />
            </div>
            <h3 className="text-white text-xl">
              FOOD & DRINK SERVICE
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
