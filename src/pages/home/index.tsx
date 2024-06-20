import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { Container } from "../../components/container";
import { db } from "../../services/firebaseConnection";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface CarsProps {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  km: string;
  images: CarImagesProps[];
}

interface CarImagesProps {
  name: string;
  uid: string;
  url: string;
}
export function Home() {
  const [cars, setCars] = useState<CarsProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    loadCars();
  }, []);

  function loadCars() {
    const carsRef = collection(db, "cars");
    const queryRef = query(carsRef, orderBy("created", "desc"));

    getDocs(queryRef).then((snapshot) => {
      const listcars = [] as CarsProps[];

      snapshot.forEach((doc) => {
        listcars.push({
          id: doc.id,
          name: doc.data().name,
          year: doc.data().year,
          km: doc.data().km,
          city: doc.data().city,
          price: doc.data().price,
          images: doc.data().images,
          uid: doc.data().uid,
        });
      });
      setCars(listcars);
    });
  }

  function handleImageLoad(id: string) {
    setLoadImages((prev) => [...prev, id]);
  }

  async function handleSearchCar() {
    if (input === "") {
      loadCars();
      return;
    }

    setCars([]);
    setLoadImages([]);

    const q = query(
      collection(db, "cars"),
      where("name", ">=", input.toUpperCase()),
      where("name", "<=", input.toUpperCase() + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);
    const listcars = [] as CarsProps[];
    querySnapshot.forEach((doc) => {
      listcars.push({
        id: doc.id,
        name: doc.data().name,
        year: doc.data().year,
        km: doc.data().km,
        city: doc.data().city,
        price: doc.data().price,
        images: doc.data().images,
        uid: doc.data().uid,
      });
    });
    setCars(listcars);
  }

  return (
    <Container>
      <section className="bg-white p-4 rounded-xl mx-auto flex justify-center items-center gap-2  w-full max-w-2xl">
        <input
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          placeholder="Digite o nome do carro"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSearchCar}
          className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
        >
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-8">
        Carros novos e usados em todo o Brasil
      </h1>
      <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <Link key={car.id} to={`/car/${car.id}`}>
            {" "}
            <section className="w-full mx-auto max-w-sm mb-4 hover:scale-105 transition-all bg-white rounded-lg">
              <div
                className="w-full h-64 rounded-lg bg-slate-200"
                style={{
                  display: loadImages.includes(car.id) ? "none" : "block",
                }}
              ></div>
              <img
                className="w-full rounded-lg mb-2 rounded-b-none h-64 object-cover"
                src={car.images[0]?.url}
                alt="Foto do Carro"
                onLoad={() => handleImageLoad(car.id)}
                style={{
                  display: loadImages.includes(car.id) ? "block" : "none",
                }}
              />
              <p className="font-bold mt-1 mb-2 px-2 text-xl">{car.name}</p>
              <div className="flex flex-col px-2">
                <span className="text-zinc-700 mb-4">
                  Ano {car.year} • {car.km} KM
                </span>
                <strong className="text-black font-medium text-xl">
                  R$ {car.price}
                </strong>
              </div>
              <div className="w-full h-px bg-slate-200 my-2"></div>
              <div className="px-2 pb-2">
                <span className="text-zinc-700">{car.city}</span>
              </div>
            </section>
          </Link>
        ))}
      </main>
    </Container>
  );
}
