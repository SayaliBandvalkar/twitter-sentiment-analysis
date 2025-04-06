import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";

const Slider = () => {
  return (
    <Swiper spaceBetween={50} slidesPerView={1} navigation>
      <SwiperSlide>
        <div className="text-center p-10 bg-blue-500 text-white text-2xl">
          <Link to="/">Home</Link>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="text-center p-10 bg-green-500 text-white text-2xl">
          <Link to="/about">About</Link>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default Slider;
