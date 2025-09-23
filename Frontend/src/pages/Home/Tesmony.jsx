import React, { useEffect, useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { getTestimonies } from "../../services/TestimonyService";

const Tesmony = ({ prevRef, nextRef }) => {
  const [testimonials, setTestimonials] = React.useState([]);
  const sliderRef = useRef(null); // Create a ref for the slider

  useEffect(() => {
    getTestimony();
  }, []);

  const getTestimony = async () => {
    try {
      const response = await getTestimonies();
      setTestimonials(response?.testimony);
    } catch (error) {
      console.error("Failed to fetch testimonies:", error);
    }
  };

  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 3,
  //   slidesToScroll: 1,
  //   autoplay: true,
  //   autoplaySpeed: 3000,
  //   cssEase: "linear",
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         slidesToShow: 2,
  //       },
  //     },
  //     {
  //       breakpoint: 768,
  //       settings: {
  //         slidesToShow: 1,
  //       },
  //     },
  //   ],
  // };

  const settings = {
    dots: true,
    infinite: testimonials.length > 1, // Only allow infinite if more than 1 agent
    speed: 500,
    slidesToShow: Math.min(3, testimonials.length), // Show a maximum of 3 or less if fewer agents
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, testimonials.length), // Adjust for medium screens
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(1, testimonials.length), // Adjust for small screens
        },
      },
    ],
  };

  // Handler for previous button
  const handlePrev = () => {
    sliderRef.current.slickPrev();
  };

  // Handler for next button
  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  // Attach the handlers to the refs
  useEffect(() => {
    if (prevRef.current && nextRef.current) {
      prevRef.current.addEventListener("click", handlePrev);
      nextRef.current.addEventListener("click", handleNext);
    }
    return () => {
      if (prevRef.current && nextRef.current) {
        prevRef.current.removeEventListener("click", handlePrev);
        nextRef.current.removeEventListener("click", handleNext);
      }
    };
  }, [prevRef, nextRef]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Slider ref={sliderRef} {...settings}>
        {testimonials.map((testimonial, index) => (
          <div className="px-2" key={index}>
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center mb-8">
              <div className="text-yellow-500 text-lg">
                {"★".repeat(testimonial.rating)}
              </div>
              <p className="text-gray-600 mt-4">
                {testimonial.message?.length > 100
                  ? `${testimonial.message.slice(0, 100)}...`
                  : testimonial.message}
              </p>
              <div className="mt-6 flex items-center">
                <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {testimonial.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-4 text-left">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {testimonial.fullName}
                  </h4>
                  <p className="text-gray-500">{testimonial.position}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Tesmony;