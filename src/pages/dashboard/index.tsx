import { FiTrash } from "react-icons/fi";
import { Container } from "../../components/container";
import { PanelHeader } from "../../components/panelHeader";
import { useContext, useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";
import { deleteObject, ref } from "firebase/storage";

interface CarProps {
  id: string;
  name: string;
  year: string;
  price: string | number;
  city: string;
  km: string;
  uid: string;
  images: CarImagesProps[];
}

interface CarImagesProps {
  name: string;
  uid: string;
  url: string;
}

export function Dashboard() {
  const { user } = useContext(AuthContext);
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);

  useEffect(() => {
    function loadCars() {
      if (!user?.uid) {
        return;
      }
      const carsRef = collection(db, "cars");
      const queryRef = query(carsRef, where("uid", "==", user.uid));

      getDocs(queryRef).then((snapshot) => {
        const listcars = [] as CarProps[];

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

    loadCars();
  }, [user]);

  async function handleDeleteCar(car: CarProps) {
    const itemCar = car;
    const docRef = doc(db, "cars", itemCar.id);
    await deleteDoc(docRef);
    itemCar.images.map(async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`;
      const imageRef = ref(storage, imagePath);
      try {
        await deleteObject(imageRef);
        setCars(cars.filter((car) => car.id !== itemCar.id));
      } catch (err) {
        console.log(err);
      }
    });
  }

  function handleImageLoad(id: string) {
    setLoadImages((prev) => [...prev, id]);
  }

  return (
    <Container>
      <PanelHeader />

      {cars.length === 0 && (
        <div className="flex items-center justify-center mt-10">
          Você não possui carros cadastrados.
        </div>
      )}

      <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <section key={car.id} className="w-full bg-white rounded-lg relative">
            <button
              onClick={() => {
                handleDeleteCar(car);
              }}
              className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow"
            >
              <FiTrash size={26} color="#000" />
            </button>
            <div
              className="w-full h-64 rounded-lg bg-slate-200"
              style={{
                display: loadImages.includes(car.id) ? "none" : "block",
              }}
            ></div>
            <img
              src={car.images[0]?.url}
              className="w-full rounded-lg h-64 object-cover mb-2"
              alt="Foto do Carro"
              onLoad={() => handleImageLoad(car.id)}
              style={{
                display: loadImages.includes(car.id) ? "block" : "none",
              }}
            />
            <p className="font-bold mt-1 px-2 mb-2">{car.name}</p>
            <div className="flex flex-col px-2">
              <span className="text-zinc-700 mb-4">
                Ano {car.year} • {car.km} KM
              </span>
              <strong className="text-black font-medium text-xl">
                {car.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>
            <div className="w-full h-px bg-slate-200 my-2"></div>
            <div className="px-2 pb-2">
              <span className="text-zinc-700">{car.city}</span>
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
}
