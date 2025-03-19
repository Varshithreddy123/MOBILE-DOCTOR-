"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DoctorsList from "../../../_components/DoctorsList";

const Search = () => {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (searchParams?.get("cnames")) {
      setCategory(searchParams.get("cnames"));
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">
        Search Results {category ? `for ${category}` : ""}
      </h1>
      {category ? (
        <DoctorsList category={category} />
      ) : (
        <p className="text-gray-500">No category selected.</p>
      )}
    </div>
  );
};

export default Search;
