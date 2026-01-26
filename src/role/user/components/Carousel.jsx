import React, { useRef, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const FullWidthCarousel = () => {
  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    autoplay.current,
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  const scrollTo = (index) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  };

  // List of images
  const images = [
    "https://jbsoftware.ca/wp-content/uploads/web-design.jpg",
    "https://cdn.corporatefinanceinstitute.com/assets/types-of-assets-1024x575.jpeg",
    "https://tse1.mm.bing.net/th/id/OIP.XCiQu_Dw49GsxzSATLsIbAHaEJ?rs=1&pid=ImgDetMain&o=7&rm=3",
    "https://tse4.mm.bing.net/th/id/OIP.19fOdF1XNiGHTKb7b7Et9gHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
    "https://th.bing.com/th/id/OIP.WBVUFJaLgzuyC8Lb-JknpAHaE8?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
  ];

  return (
    <div className="w-full flex flex-col items-center">
      
      <div className="embla w-full overflow-hidden">
        <div
          className="embla__viewport w-full h-64 sm:h-80 md:h-96"
          ref={emblaRef}
        >
          <div className="embla__container flex h-full">
            {images.map((src, index) => (
              <div key={index} className="embla__slide min-w-full h-full">
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-3 space-x-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === selectedIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FullWidthCarousel;
