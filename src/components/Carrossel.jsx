import Slider from "react-slick";

const CarouselPromocoes = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...settings}>
      <div>
        <img src="promo1.jpg" alt="Promoção 1" />
      </div>
      <div>
        <img src="promo2.jpg" alt="Promoção 2" />
      </div>
      {/* Adicione mais slides conforme necessário */}
    </Slider>
  );
};

export default CarouselPromocoes;
