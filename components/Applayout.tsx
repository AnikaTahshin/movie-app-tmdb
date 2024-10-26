import React, { useState } from "react";
import Navbar from "./Navbar";
import HomePage from "./HomePage";

const Applayout = () => {
    const [inputSearch, setInputSearch] = useState("")
  return (
    <div>
        <Navbar  inputSearch={inputSearch} setInputSearch={setInputSearch}  />
        <HomePage />
    </div>
  );
};

export default Applayout;
