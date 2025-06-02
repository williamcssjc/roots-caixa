// src/components/Navbar.jsx
import React from 'react';
import logo from '../assets/logo.png'; // Substituir pelo nome real da imagem

const Navbar = () => {
  return (
    <header className="bg-zinc-900 text-white p-4 shadow-md flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img src={logo} alt="Roots Burguer" className="h-10" />
        <h1 className="text-xl font-bold">Roots Burguer</h1>
      </div>
    </header>
  );
};

export default Navbar;
