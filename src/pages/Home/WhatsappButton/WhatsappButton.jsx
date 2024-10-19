import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsappButton = () => {
  const whatsappLink = "https://wa.me/573102663619"; // Reemplaza con tu número de teléfono en formato internacional sin símbolos

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
      style={{ zIndex: 1000 }} // Asegurarse de que el botón siempre esté visible
    >
      <FaWhatsapp className="text-3xl" />
    </a>
  );
};

export default WhatsappButton;
