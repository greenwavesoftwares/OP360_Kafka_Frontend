import React, { useEffect, useRef, useState } from "react";
import { useFullscreen } from 'react-haiku';

export default function MaximizeWindow() {
      const documentRef = useRef(null);

  useEffect(() => {
    documentRef.current = document.documentElement;
  }, []);

    const [isHovered, setIsHovered] = useState(false);

     const {isFullscreen, toggleFullscreen } = useFullscreen(documentRef);
  return (
     <div
      style={{ display: "flex", justifyContent: "flex-end", position: "relative", cursor:'pointer' }}
      onClick={toggleFullscreen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <i
        className="pi pi-window-maximize"
        style={{
          fontSize: "1rem",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      ></i>
    </div>
  )
}
