"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Command, CommandInput, CommandList, CommandEmpty } from "cmdk";
import Image from "next/image";

const categories = [
  { name: "Dermatologist", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741080751/kp9c1nxmqvsq8pq06z3q.avif" },
  { name: "Cardiologist", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741080437/f3iw2tfcvve32tn3uzwo.webp" },
  { name: "Orthopedic", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741081519/r9mxynyo58o1mytudule.jpg" },
  { name: "Neurologist", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741081036/fvgq0koechd7hzfbyjru.webp" },
  { name: "Otology", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741081889/zd3xhyvxh93kwojkw6xp.jpg" },
  { name: "General Doctor", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741081738/ibcppbgwkbjbs6ptkn8o.avif" },
  { name: "Surgeon", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741523656/dxlgqsswqc3lgorzgp6c.jpg" },
  { name: "Psychotropic", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741523821/uyrj8muyinx6wgzazcxj.jpg" },
  { name: "Eye Specialist", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741523909/mhrsf70idkxavirlwk0c.jpg" },
];

const CategoryList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // Extract category from URL (handles extra segments)
  const pathSegments = pathname.split("/").filter(Boolean);
  const selectedCategory = decodeURIComponent(pathSegments[pathSegments.length - 1] || "").toLowerCase();

  // Filter search results based on input
  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSelect = (category) => {
    router.push(`/search/${encodeURIComponent(category.name)}`);
  };

  // Auto-fill search box with selected category (optional)
  useEffect(() => {
    const matchedCategory = categories.find(cat => cat.name.toLowerCase() === selectedCategory);
    if (matchedCategory) {
      setSearchTerm(matchedCategory.name);
    }
  }, [selectedCategory]);

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-semibold mb-4">Search</h2>
      <Command className="rounded-lg border shadow-md w-96">
        <div className="p-3">
          <CommandInput
            placeholder="Type a specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md w-full"
            aria-label="Search specialties"
          />
        </div>
        <CommandList className="max-h-60 overflow-auto">
          {filteredCategories.length > 0 ? (
            <ul className="space-y-2 p-2">
              {filteredCategories.map((category, index) => {
                const isSelected = selectedCategory === category.name.toLowerCase();
                return (
                  <li
                    key={index}
                    className={`cursor-pointer p-2 rounded-md flex items-center gap-3 transition ${
                      isSelected ? "bg-blue-500 text-white font-bold" : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleSelect(category)}
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <p className="font-medium">{category.name}</p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <CommandEmpty className="text-gray-500 p-2">No results found.</CommandEmpty>
          )}
        </CommandList>
      </Command>
    </div>
  );
};

export default CategoryList;
