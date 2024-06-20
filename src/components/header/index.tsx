import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.svg";
import { FiUser } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export function Header() {
  const { signed, loadingAuth } = useContext(AuthContext);

  return (
    <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4">
      <header className="flex w-full items-center justify-between max-w-7xl px-4 mx-auto">
        <Link to="/">
          <img src={logoImg} alt="Logo do Site" />
        </Link>
        {!loadingAuth && signed && (
          <Link
            className=" hover:scale-110 border-gray-900 transition-all border-2 rounded-full p-1"
            to="/dashboard"
          >
            <FiUser size={20} color="#000" />
          </Link>
        )}
        {!loadingAuth && !signed && (
          <Link
            className="flex items-center border-2 rounded-xl border-gray-900 hover:scale-110 transition-all px-4 py-2 gap-2 text-lg"
            to="/login"
          >
            Login
          </Link>
        )}
      </header>
    </div>
  );
}
