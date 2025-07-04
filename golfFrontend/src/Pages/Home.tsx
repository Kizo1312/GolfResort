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
import hero1 from '../assets/hero/HeroImage.webp';
import hero2 from '../assets/hero/HeroImage2.webp';
import hero3 from '../assets/hero/HeroImage3.webp';
import background from '../assets/background/backgroundteren.webp';


const wellnessServices = [
  {
    id: 12,
    title: 'Masaža cijelog tijela',
    description: `Prepustite se čarima potpune opuštenosti uz masažu cijelog tijela od 60 minuta.
Uživajte u nježnim dodirom naših stručnih terapeuta koji će vas osloboditi stresa i napetosti, vraćajući vam unutarnju ravnotežu i energiju. Savršen trenutak za obnovu tijela i duha, u oazi mira našeg resorta.`,
    bgColor: 'bg-blue-300',
    image: masaza
  },
  {
    id: 14,
    title: 'Aromaterapija',
    description: `Aromaterapija – mirisi prirode za savršenu ravnotežu tijela i uma.
Doživite blagodat eteričnih ulja koja umiruju, opuštaju i obnavljaju vašu energiju. Naš tretman aromaterapije vodi vas na putovanje duboke relaksacije i unutarnjeg sklada.`,
    bgColor: 'bg-purple-300',
    image: aromaterapija
  },
  {
    id: 13,
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
    title: 'Vaš golf vikend počinje ovdje',
    description: 'Rezervirajte svoj termin i osjetite razliku luksuznog odmora.',
    ctaText: 'Rezervirajte sada',
    ctaLink: '/rezervacije',
  },
  {
    image: hero2,
    title: 'Igrajte na najprestižnijem golf terenu',
    description: 'Doživite izazov i užitak igre uz vrhunsku prirodu i sadržaje.',
    ctaText: 'Pogledajte terene',
    ctaLink: '/golf-tereni',
  },
  {
    image: hero3,
    title: 'Luksuz i priroda u savršenom balansu',
    description: 'Uz vrhunske golf terene, otkrijte i svijet wellnessa – mjesto gdje tijelo i um dolaze u ravnotežu.',
    ctaText: 'Otkrijte wellness doživljaj',
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
                <div className="absolute inset-0 bg-gray/35 flex items-center justify-center ">
                  <div className="bg-white/70 p-8 rounded-lg shadow-lg text-center max-w-xl shadow-2x">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      {slide.title}
                    </h2>
                    <p className="text-lg text-gray-900 mb-6">
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

      <div className="h-16 bg-gradient-to-b from-gray to-transparent"></div>

      {/* Explore Golf Courses Section */}
        <section
        className="relative py-16 px-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${background})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gray/50 backdrop-blur-[1px] z-0 rounded-none" />

        {/* Content */}
        <div className="relative z-10 max-w-[90vw] mx-auto">
          <div className="bg-gray/50 bg-white/13 backdrop-blur-sm rounded-xl p-8 shadow-2xl max-w-6xl mx-auto border border-white/20 overflow-visible">
            
            <div className="max-w-[1200px] mx-auto text-center text-white drop-shadow mb-10">
              <h2 className="text-4xl md:text-5xl font-semibold drop-shadow-lg mb-4">
                Golf tereni
              </h2>
              <p className="text-lg md:text-xl drop-shadow-sm">
                Istražite sve naše vrhunske terene – kliknite na teren kako biste saznali više.
              </p>
            </div>
            <div>
            <Tereni
              style={{
                width: '100%',
                margin: '0 auto',
                display: 'block',
                overflow: 'visible',
              }}
            />
            </div>
          </div>
        </div>
      </section>


      <div className="h-8 bg-gradient-to-b from-gray to-transparent"></div>        

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
                  {service.description?.split(".")[0] + "."}
                </p>
                <button
                  onClick={() => navigate(`/wellness?selectedId=${service.id}`)}
                  className="mt-4 px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100 hover:border-gray-600 transition"
                >
                  Saznajte više
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
