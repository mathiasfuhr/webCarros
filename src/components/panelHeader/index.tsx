import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "../../services/firebaseConnection";

export function PanelHeader(){
  async function handleLogout(){
    await signOut(auth);
  }

  return(
    <div className="w-full items-center sm:text-base text-sm flex h-10 drop-shadow-lg bg-red-600 rounded-lg text-white gap-8 px-4 mb-4">
      <Link className="hover:scale-110 transition-all" to="/dashboard">Meus Carros</Link>
      <Link className="hover:scale-110 transition-all" to="/dashboard/new">Cadastrar Carro</Link>
      <button className="ml-auto hover:scale-110 transition-all" onClick={handleLogout}>Sair</button>
    </div>
  )
}