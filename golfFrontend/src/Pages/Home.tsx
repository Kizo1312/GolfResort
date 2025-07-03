import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Tereni } from '../components/Tereni';
import aromaterapija from '../assets/wellness/aromaterapija.webp';
import masaza from '../assets/wellness/masaza.webp';
import sauna from '../assets/wellness/sauna.webp';
import hero1 from '../assets/hero/HeroImage.jpg';
import hero2 from '../assets/hero/HeroImage2.jpg';
import hero3 from '../assets/hero/HeroImage3.jpg';


const wellnessServices = [
  {
    id: 9,
    title: 'Masaža cijelog tijela',
    description: `Prepustite se čarima potpune opuštenosti uz masažu cijelog tijela od 60 minuta.
Uživajte u nježnim dodirom naših stručnih terapeuta koji će vas osloboditi stresa i napetosti, vraćajući vam unutarnju ravnotežu i energiju. Savršen trenutak za obnovu tijela i duha, u oazi mira našeg resorta.`,
    bgColor: 'bg-blue-300',
    image: masaza
  },
  {
    id: 10,
    title: 'Aromaterapija',
    description: `Aromaterapija – mirisi prirode za savršenu ravnotežu tijela i uma.
Doživite blagodat eteričnih ulja koja umiruju, opuštaju i obnavljaju vašu energiju. Naš tretman aromaterapije vodi vas na putovanje duboke relaksacije i unutarnjeg sklada.`,
    bgColor: 'bg-purple-300',
    image: aromaterapija
  },
  {
    id: 11,
    title: 'Sauna',
    description: `Uživajte u privatnoj finskoj sauni za dvoje – 45 minuta potpune relaksacije.
Iskusite toplinu i blagodati saune u intimnoj atmosferi, idealnoj za opuštanje i detoksikaciju tijela, u društvu najbliže osobe.`,
    bgColor: 'bg-pink-300',
    image: sauna
  },
];

const heroSlides = [
  {
    image: hero1,
    title: 'Tvoj golf vikend počinje ovdje',
    description: 'Rezerviraj svoj termin i osjeti razliku luksuznog odmora.',
    ctaText: 'Rezerviraj sada',
    ctaLink: '/rezervacije',
  },
  {
    image: hero2,
    title: 'Igraj na najprestižnijem golf terenu',
    description: 'Doživi izazov i užitak igre uz vrhunsku prirodu i sadržaje.',
    ctaText: 'Pogledaj terene',
    ctaLink: '/golf-tereni',
  },
  {
    image: hero3,
    title: 'Luksuz i priroda u savršenom balansu',
    description: 'Smješteni u srcu prirode, naši tereni nude više od igre.',
    ctaText: 'Saznaj više',
    ctaLink: '/wellness',
  },
];


const HomePage = () => {
  const navigate = useNavigate();

    return (
      <div className="flex flex-col">
        
      <div className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          slidesPerView={1}
          loop
          autoplay={{ delay: 6000 }}
          pagination={{ clickable: true }}
          className="w-full h-[600px]"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative w-full h-[600px] bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Dynamic Overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="bg-white/80 p-8 rounded-lg shadow-lg text-center max-w-xl">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      {slide.title}
                    </h2>
                    <p className="text-lg text-gray-700 mb-6">
                      {slide.description}
                    </p>
                    <button
                      onClick={() => navigate(slide.ctaLink)}
                      className="px-6 py-3 bg-green-700 text-white rounded hover:bg-green-800 transition"
                    >
                      {slide.ctaText}
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Explore Golf Courses Section */}
      <section className="py-12 px-4 text-center">
        <Tereni />
      </section>

      {/* Wellness Section */}
      <section className="py-12 px-4">
        <h3 className="text-3xl font-bold mb-8 text-center">Wellness</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {wellnessServices.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              <img
                src={service.image}
                alt={service.title}
                className="h-60 w-full object-cover"
              />

              <div className="p-6 flex flex-col flex-grow">
                <h4 className="text-xl font-semibold mb-2">{service.title}</h4>
                <p className="text-gray-700 flex-grow whitespace-pre-line">
                  {service.description}
                </p>
                <button
                  onClick={() => navigate(`/wellness?selectedId=${service.id}`)}
                  className="mt-4 px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100 hover:border-gray-600 transition"
                >
                  Saznaj više
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
