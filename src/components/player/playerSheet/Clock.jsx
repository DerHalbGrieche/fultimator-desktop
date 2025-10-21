import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

function calculateCoordinates(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

const Clock = ({ numSections, size, state, setState, isCharacterSheet, onReset }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  
  // Colors based on dark or light mode
  const primary = isDarkMode ? theme.palette.primary.light : theme.palette.primary.main;
  const secondary = isDarkMode ? theme.palette.secondary.light : theme.palette.secondary.main;
  const strokeColor = theme.palette.text.primary;
  const hoveredActiveColor = theme.palette.info.main; // Info color for hover

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchedIndex, setTouchedIndex] = useState(null);

  // Detect if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsMouseDown(false);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  const handleSectionClick = (index) => {
    const updatedSections = [...state];
    const isCurrentlyFilled = updatedSections[index];

    if (isCurrentlyFilled) {
      // If the clicked section is filled, unfill it and all subsequent sections
      for (let i = index; i < numSections; i++) {
        updatedSections[i] = false;
      }
    } else {
      // If the clicked section is unfilled, fill it and all preceding sections
      for (let i = 0; i <= index; i++) {
        updatedSections[i] = true;
      }
    }
    setState(updatedSections);
  };

  const handleRightClick = (e) => {
    e.preventDefault(); // Prevent context menu
    if (onReset && !isCharacterSheet) {
      onReset();
  };

  const handleMouseDown = (index) => {
    if (!isCharacterSheet && !isMobile) {
      setIsMouseDown(true);
      handleSectionClick(index); // Trigger click logic on mousedown
    }
  };

  const handleMouseEnter = (index) => {
    if (!isCharacterSheet && !isMobile) {
      if (isMouseDown) {
        handleSectionClick(index); // Trigger click logic on drag
      }
      setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isCharacterSheet && !isMobile) {
      setHoveredIndex(null);
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (index) => {
    if (!isCharacterSheet && isMobile) {
      setTouchedIndex(index);
    }
  };

  const handleTouchEnd = (index) => {
    if (!isCharacterSheet && isMobile) {
      if (touchedIndex === index) {
        handleSectionClick(index);
      }
      setTouchedIndex(null);
    }
  };

  const handleTouchCancel = () => {
    if (!isCharacterSheet && isMobile) {
      setTouchedIndex(null);
    }
  };

  const handleContextMenu = (e) => {
    if (!isCharacterSheet) {
      e.preventDefault(); // Prevent default context menu
      setState(new Array(numSections).fill(false)); // Reset all sections to false
    }
  };

  const sections = [];
  for (let i = 0; i < numSections; i++) {
    const startAngle = (360 / numSections) * i;
    const endAngle = (360 / numSections) * (i + 1);

    const startPoint = calculateCoordinates(size / 2, size / 2, size / 2, startAngle);
    const endPoint = calculateCoordinates(size / 2, size / 2, size / 2, endAngle);

    const pathData = `
      M ${size / 2},${size / 2}
      L ${startPoint.x},${startPoint.y}
      A ${size / 2},${size / 2} 0 ${endAngle - startAngle > 180 ? 1 : 0},1 ${endPoint.x},${endPoint.y}
      Z
    `;

    const isActive = state[i];
    let fill = "transparent";

    // Visual feedback for hover/drag
    const isHoveredOrDragged = (isMouseDown && hoveredIndex !== null && i <= hoveredIndex) || (hoveredIndex === i && !isMouseDown);

    if (isCharacterSheet) {
      fill = isActive ? primary : "transparent";
    } else if (isMobile) {
      const isCurrentlyTouched = touchedIndex !== null && (i <= touchedIndex); // Highlight up to touched index
      if (isCurrentlyTouched && isActive) {
        fill = hoveredActiveColor;
      } else if (isActive) {
        fill = primary;
      } else if (isCurrentlyTouched) {
        fill = secondary;
      }
    } else {
      // Desktop behavior
      if (isHoveredOrDragged && isActive) {
        fill = hoveredActiveColor;
      } else if (isHoveredOrDragged) {
        fill = secondary;
      } else if (isActive) {
        fill = primary;
      }
    }

    sections.push(
      <path
        key={i}
        d={pathData}
        fill={fill}
        stroke={strokeColor}
        strokeWidth="1"
        onMouseDown={() => handleMouseDown(i)}
        onMouseEnter={() => handleMouseEnter(i)}
        onMouseLeave={handleMouseLeave}
        onTouchStart={() => handleTouchStart(i)}
        onTouchEnd={() => handleTouchEnd(i)}
        onTouchCancel={handleTouchCancel}
        onContextMenu={handleContextMenu}
        style={{ cursor: isCharacterSheet ? "default" : "pointer" }}
      />
    );
  }

  return (
    <svg 
      width={size} 
      height={size}
      onContextMenu={handleRightClick}
      style={{ cursor: isCharacterSheet ? "default" : "pointer" }}
    >
      {sections}
    </svg>
  );
};

export default Clock;