import { Container } from "../../components/container";

export function Home() {
  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mxauto flex justify-center items-center gap-2">
        <input
          placeholder="Digite o nome do carro"
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
        />
        <button className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg">
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros novos e usados em todo o Brasil
      </h1>
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <section className="w-full bg-white rounded-lg">
          <img
          className="w-full rounded-lg mb-2 max-h-72 object-cover hover:scale-105 transition-all"
            src="https://i1.wp.com/thegarage.com.br/wp-content/uploads/2023/06/1969-Volkswagen-Fusca-1300-venda-the-garage-for-sale-35-of-37.jpg?ssl=1"
            alt="Carro"
          />
          <p className="font-bold mt-1 mb-2 px-2">Fusca</p>
          <div className="flex flex-col px-2">
            <span className="text-zinc-700 mb-6">1975 | 110.00 km</span>
            <strong className="text-black font-medium text-xl">R$ 50.000</strong>
          </div>
          <div className="w-full h-px bg-slate-200 my-2"></div>
          <div className="px-2 pb-2">
            <span className="text-zinc-700">Alecrim - Rs</span>
          </div>
        </section>
      </main>
    </Container>
  );
}
