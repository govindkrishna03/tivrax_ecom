'use client';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "/carousel/shirts.jpg",
  "/carousel/tshrits.jpg",
  // Add more slides as needed
];

export default function HeroCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000, // smoother transition
    fade: true, // enables crossfade (important!)
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
    cssEase: "ease-in-out", // buttery smooth easing
  };

  return (
    <div className="w-full ">
      <div className="w-full h-[280px] md:h-[500px] lg:h-[450px] sm:h-[400px] overflow-hidden sm:shadow-xl">
        <Slider {...settings}>
          {images.map((src, index) => (
            <div key={index}>
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-[300px] md:h-[500px] lg:h-[600px] object-cover transition-all duration-1000 ease-in-out"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
