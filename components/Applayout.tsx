"use client"
import React, { useState } from "react";
import Navbar from "./Navbar";
import HomePage from "./HomePage";

const Applayout = () => {
    const [inputSearch, setInputSearch] = useState("")
    // inputSearch={inputSearch} setInputSearch={setInputSearch}

    const [searchInput, setSearchInput] = useState('');

  return (
    <>
        <Navbar searchInput={searchInput} setSearchInput={setSearchInput}  />
        <HomePage searchInput={searchInput}  />
    </>
  );
};

export default Applayout;
