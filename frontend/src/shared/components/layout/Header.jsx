import { useNavigate } from "react-router-dom";
import { STORAGE_KEYS } from "../../constants/storage";
import { Button } from "../../../shared/components/ui/Button";

export const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "{}");

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">Bienvenido</p>
        <p className="text-sm font-medium text-gray-900">
          {user.username || "Admin"}
        </p>
      </div>
      <Button
        variant="secondary"
        onClick={handleLogout}
      >
        Cerrar sesión
      </Button>
    </header>
  );
};