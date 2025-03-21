import React from "react";


const Navbar = () => {
    return (
      <nav className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">OICSA</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className="pr-5">Admin</span>
            </span>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;