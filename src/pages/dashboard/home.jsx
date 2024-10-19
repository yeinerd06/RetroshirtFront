import React from "react";

export function Home() {
  return (
    <div className="mt-12 flex flex-col items-center bg-blue-900">
      <div className="w-full max-w-xl">
        <img
          src="/img/retro-shirt.png"
          alt="Welcome Image"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}

export default Home;
