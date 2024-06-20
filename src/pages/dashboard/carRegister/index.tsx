import { useForm } from "react-hook-form";
import { Container } from "../../../components/container";
import { PanelHeader } from "../../../components/panelHeader";
import { FiUpload, FiTrash } from "react-icons/fi";
import { Input } from "../../../components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../contexts/AuthContext";
import { v4 as uuidV4 } from "uuid";
import { db, storage } from "../../../services/firebaseConnection";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { IoMdAdd } from "react-icons/io";

const schema = z.object({
  name: z.string().min(1, "É obrigatório informar o nome"),
  model: z.string().min(1, "É obrigatório informar o modelo"),
  year: z.string().min(1, "É obrigatório informar o ano"),
  km: z.string().min(1, "É obrigatório informar os quilômetros rodados"),
  price: z.string().min(1, "É obrigatório informar o preço"),
  city: z.string().min(1, "É obrigatório informar a cidade"),
  whatsapp: z
    .string()
    .min(1, "É obrigatório informar um telefone/whatsapp")
    .refine((value) => /^(\d{11,12})$/.test(value), {
      message: "Número de telefone inválido",
    }),
  description: z.string().min(1, "A descrição é obrigatória"),
});

type FormData = z.infer<typeof schema>;

interface ImageItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export function CarRegister() {
  const { user } = useContext(AuthContext);
  const [carImages, setCarImages] = useState<ImageItemProps[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        await handleUpload(image);
      } else {
        toast.error("Envie imagens no formato JPEG/PNG");
        return;
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) {
      return;
    }

    const currentUid = user?.uid;
    const uidImage = uuidV4();
    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);

    uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        const imageItem = {
          name: uidImage,
          uid: currentUid,
          previewUrl: URL.createObjectURL(image),
          url: downloadUrl,
        };
        setCarImages((images) => [...images, imageItem]);
      });
    });
  }

  function onSubmit(data: FormData) {
    if (carImages.length === 0) {
      toast.error(
        "É necessário enviar pelo menos 1 imagem para que o carro seja cadastrado",
        {
          style: {
            textAlign: "center",
          },
        }
      );
      return;
    }
    const carListImages = carImages.map(car => {
      return{
        uid: car.uid,
        name: car.name,
        url: car.url
      }
    })
   addDoc(collection(db, "cars"),{
    name: data.name.toUpperCase(),
    model: data.model,
    whatsapp: data.whatsapp,
    city: data.city,
    year: data.year,
    km: data.km,
    price: data.price,
    description: data.description,
    created: new Date(),
    owner: user?.name,
    uid: user?.uid,
    images: carListImages,
   }).then(() => {
    reset();
    setCarImages([]);
    toast.success("Carro cadastrado")
   }).catch((error) => {
    console.log(error)
   })
  }

  async function handleDeleteImage(item: ImageItemProps) {
    const imagePath = `images/${item.uid}/${item.name}`;
    const imageRef = ref(storage, imagePath);
    try {
      await deleteObject(imageRef);
      setCarImages(carImages.filter((car) => car.url !== item.url));
    } catch (err) {
      toast.error("Erro ao deletar imagem");
    }
  }

  return (
    <Container>
      <PanelHeader />
      <div className="w-fit max-w-full bg-white p-3 rounded-lg flex flex-col mx-auto sm:mx-0 sm:flex-row items-center gap-2">
     {carImages.length === 0 && (   <button className="border-2 w-48 rounded-lg flex items-center justify-center border-gray-600 h-32 md:w-48">
          <div className="absolute">
            <FiUpload size={30} color="#000" />
          </div>
          <div>
            <input
              className="opacity-0 py-12 w-44 cursor-pointer"
              type="file"
              accept="image/*"
              onChange={handleFile}
            />
          </div>
        </button>)}
        {carImages.map((item) => (
          <div
            key={item.name}
            className="w-full h-32 flex items-center justify-center relative"
          >
            <button
              onClick={() => handleDeleteImage(item)}
              className="absolute p-3 rounded-md opacity-70 bg-white"
            >
              <FiTrash size={28} color="#000" />
            </button>
            <img
              className="rounded-lg w-48 h-32 object-cover"
              src={item.previewUrl}
              alt={item.name}
            />
          </div>
        ))}
         {carImages.length > 0 && (   <button className="border-2 w-48 rounded-lg flex items-center justify-center border-gray-600 h-32 md:w-48">
          <div className="absolute">
            <IoMdAdd size={36} color="#000" />
          </div>
          <div>
            <input
              className="opacity-0 py-12 w-44 cursor-pointer"
              type="file"
              accept="image/*"
              onChange={handleFile}
            />
          </div>
        </button>)}
      </div>
      <div className="w-full sm:text-base text-sm bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2 mb-6">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <p className="mb-2 font-medium">Nome do Carro</p>
            <Input
              type="text"
              name="name"
              placeholder="Ex.: Ônix 1.0 Branco"
              register={register}
              error={errors.name?.message}
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Modelo do Carro</p>
            <Input
              type="text"
              name="model"
              placeholder="Ex.: 1.0 Flex Manual"
              register={register}
              error={errors.model?.message}
            />
          </div>
          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Ano do Carro</p>
              <Input
                type="text"
                name="year"
                placeholder="Ex.: 2018/2018"
                register={register}
                error={errors.year?.message}
              />
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">Kms Rodados</p>
              <Input
                type="text"
                name="km"
                placeholder="Ex.: 40.000"
                register={register}
                error={errors.km?.message}
              />
            </div>
          </div>
          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Telefone/WhatsApp</p>
              <Input
                type="text"
                name="whatsapp"
                placeholder="Ex.: 11992345678"
                register={register}
                error={errors.whatsapp?.message}
              />
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <Input
                type="text"
                name="city"
                placeholder="Ex.: São Paulo"
                register={register}
                error={errors.city?.message}
              />
            </div>
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium">Preço</p>
            <Input
              type="text"
              name="price"
              placeholder="Ex.: 69.000"
              register={register}
              error={errors.price?.message}
            />
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="
          border-2 w-full rounded-md h-24 px-2"
              {...register("description")}
              name="description"
              id="description"
              style={{ resize: "none" }}
            />
            {errors.description && (
              <p className="my-1 text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 text-white w-full font-medium h-10"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </Container>
  );
}
