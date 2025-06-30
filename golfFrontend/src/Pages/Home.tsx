import React from 'react';
import { Tereni } from '../components/Tereni';


const HomePage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Image */}
      <div className="w-full h-[400px] bg-gray-300 flex items-center justify-center">
        <span className="text-4xl text-white"><img src="../assets/HeroImage.jpg" alt="" /></span>
      </div>

      {/* Explore Golf Courses Section */}
      <section className="py-12 px-4 text-center">
        <Tereni/>
      </section>

      {/* Wellness Section */}
      <section className="py-12 px-4">
        <h3 className="text-3xl font-bold mb-8 text-center">Wellness</h3>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Image 1/3 */}
          <div className="w-full md:w-1/3 h-[250px] bg-blue-200 flex items-center justify-center">
            <span className="text-white text-lg">Image Placeholder</span>
          </div>

          {/* Text 2/3 */}
          <div className="w-full md:w-2/3">
            <h4 className="text-xl font-semibold mb-2">Relax and Recharge</h4>
            <p className="mb-4 text-gray-700">
              Discover our wellness programs designed to rejuvenate your body and mind. Enjoy spa treatments, healthy cuisine, and peaceful surroundings.
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
