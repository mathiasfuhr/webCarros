import { useEffect, useState } from "react";
import { Container } from "../../components/container";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Swiper, SwiperSlide } from "swiper/react";

interface CarProps {
  id: string;
  name: string;
  model: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  km: string;
  description: string;
  created: string;
  whatsapp: string;
  owner: string;
  images: ImagesCarProps[];
}

interface ImagesCarProps {
  name: string;
  uid: string;
  url: string;
}

export function CarDetails() {
  const [car, setCar] = useState<CarProps>();
  const { id } = useParams();
  const [sliderPerView, setSliderPerView] = useState<number>(2);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCar() {
      if (!id) {
        return;
      }

      const docRef = doc(db, "cars", id);
      getDoc(docRef).then((snapshot) => {
        if (!snapshot.data()) {
          navigate("/");
        }
        setCar({
          id: snapshot.id,
          name: snapshot.data()?.name,
          model: snapshot.data()?.model,
          year: snapshot.data()?.year,
          uid: snapshot.data()?.uid,
          price: snapshot.data()?.price,
          city: snapshot.data()?.city,
          km: snapshot.data()?.km,
          description: snapshot.data()?.description,
          created: snapshot.data()?.created,
          whatsapp: snapshot.data()?.whatsapp,
          owner: snapshot.data()?.owner,
          images: snapshot.data()?.images,
        });
      });
    }

    loadCar();
  }, [id]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 900) {
        setSliderPerView(1);
      } else {
        setSliderPerView(2);
      }
    }
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container>
      {car && (
        <Swiper
          slidesPerView={sliderPerView}
          className="w-3/4 rounded"
          pagination={{ clickable: true }}
          navigation
        >
          {car?.images.map((image) => (
            <SwiperSlide key={image.name}>
              <img src={image.url} className="w-full object-cover h-96" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {car && (
        <main className="w-3/4 bg-white rounded-lg p-6 my-4 mx-auto">
          <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
            <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
            <h1 className="font-bold text-3xl text-black">R$ {car?.price}</h1>
          </div>
          <p>{car?.model}</p>
          <div className="flex w-full gap-6 my-4">
            <div className="flex flex-row gap-10">
              <div>
                {" "}
                <p>Cidade</p>
                <strong>{car?.city}</strong>
              </div>
              <div>
                {" "}
                <p>Ano</p>
                <strong>{car?.year}</strong>
              </div>
              <div>
                {" "}
                <p>KM</p>
                <strong>{car?.km}</strong>
              </div>
            </div>
          </div>
          <strong>Descrição</strong>
          <p className="my-2">{car?.description}</p>
          <strong>Telefone/Whatsapp</strong>
          <p className="mt-2">{car?.whatsapp}</p>
          <a
            className="bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg drop-shadow font-medium cursor-pointer"
            target="_blank"
            href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá, vi esse ${car?.name} no site WebCarros e gostaria de mais informações.`}
          >
            Conversar com o vendedor <FaWhatsapp size={22} color="#fff" />
          </a>
        </main>
      )}
    </Container>
  );
}
