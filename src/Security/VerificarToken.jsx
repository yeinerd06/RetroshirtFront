import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiToken } from "@/Api/Usuarios/Usuarios";

function buscarRol() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const user = JSON.parse(JSON.stringify(parseJwt(token)));
    const rol = user?.roles[0]?.nombre?.split("_")[1]?.toLowerCase();
    return rol;
}

function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    return JSON.parse(jsonPayload);
}

const VerificarToken = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const tieneToken = localStorage.getItem("token") !== null;

    const enviarLogin = () => {
        navigate("/auth/login");
    };

    const validoToken = async () => {
        try {
            const res = await apiToken();
            const data = await res.json();
            return data.success;
        } catch (e) {
            console.log(e);
            localStorage.clear()
            return false;
        }
    };

    useEffect(() => {
        const verificarYRedirigir = async () => {
            if (!tieneToken) {
                if (
                    location.pathname !== "/auth/login" &&
                    location.pathname !== "/auth/recuperar-contraseña"
                ) {
                    //enviarLogin();
                }
            } else {
                if (
                    location.pathname === "/auth/login" ||
                    location.pathname === "/auth/recuperar-contraseña"
                ) {
                    if (await validoToken()) {
                        navigate("/" + buscarRol() + "/inicio");
                    } else {
                        enviarLogin();
                    }
                } else {
                    const rol = buscarRol();
                    if (rol && !location.pathname.includes(rol)) {
                        navigate("/" + rol + "/inicio");
                    }
                }
            }
        };

        verificarYRedirigir();
    }, [location, navigate, tieneToken]);

    return null;
};

export { VerificarToken };
