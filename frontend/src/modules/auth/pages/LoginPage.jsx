import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validations/login.validation";
import { loginRequest } from "../services/auth.service";
import { useAuth } from "../../../shared/context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setServerError("");
      // Asumiendo que el backend devuelve { token, user: {...} }
      const response = await loginRequest(data);
      login(response.token, response.user);
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Error al conectar con el servidor",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2>Acceso Administrativo</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              style={{ width: "100%", padding: "8px" }}
            />
            {errors.email && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              {...register("password")}
              style={{ width: "100%", padding: "8px" }}
            />
            {errors.password && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.password.message}
              </span>
            )}
          </div>

          {serverError && (
            <div
              style={{ color: "red", fontSize: "14px", textAlign: "center" }}
            >
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{ padding: "10px", cursor: "pointer" }}
          >
            {isLoading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
