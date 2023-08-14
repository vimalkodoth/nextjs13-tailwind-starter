"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const ToggleButton = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  if (!mounted) return null;

  return (
    <button onClick={handleClick}>
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default ToggleButton;
