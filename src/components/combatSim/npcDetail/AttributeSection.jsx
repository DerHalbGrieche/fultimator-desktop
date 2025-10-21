import React, { useState } from "react";
import { Box } from "@mui/material";
import { t } from "../../../translation/translate";
import { useTheme } from "@mui/material/styles";
import AttributeModifierDialog from "./AttributeModifierDialog";

const AttributeSection = ({ selectedNPC, setSelectedNPC, selectedNPCs, setSelectedNPCs, calcAttr }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);

  const handleAttributeClick = (attribute) => {
    setSelectedAttribute(attribute);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAttribute(null);
  };

  const handleUpdateModifiers = (attribute, newModifiers) => {
    const updatedNPCs = selectedNPCs.map((n) => {
      if (n.combatId === selectedNPC.combatId) {
        const newNpc = {
          ...n,
          combatStats: {
            ...n.combatStats,
            attributeModifiers: {
              ...n.combatStats?.attributeModifiers,
              [attribute]: newModifiers,
            },
          },
        };
        setSelectedNPC(newNpc);
        return newNpc;
      }
      return n;
    });
    setSelectedNPCs(updatedNPCs);
  };

  const attributes = [
    {
      label: "DEX",
      key: "dexterity",
      value: calcAttr("Slow", "Enraged", "dexterity", selectedNPC),
      color: "#42a5f5",
      originalValue: selectedNPC.attributes?.dexterity,
    },
    {
      label: "INS",
      key: "insight",
      value: calcAttr("Dazed", "Enraged", "insight", selectedNPC),
      color: "#ab47bc",
      originalValue: selectedNPC.attributes?.insight,
    },
    {
      label: "MIG",
      key: "might",
      value: calcAttr("Weak", "Poisoned", "might", selectedNPC),
      color: "#ff7043",
      originalValue: selectedNPC.attributes?.might,
    },
    {
      label: "WLP",
      key: "will",
      value: calcAttr("Shaken", "Poisoned", "will", selectedNPC),
      color: "#e8b923",
      originalValue: selectedNPC.attributes?.will,
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          borderTop: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
          paddingY: 1,
          bgcolor: isDarkMode ? "#333333" : "#f5f5f5",
        }}
      >
        {attributes.map((attr) => (
          <Box
            key={attr.label}
            onClick={() => handleAttributeClick(attr.key)}
            sx={{
              display: "flex",
              alignItems: "center",
              borderRadius: "16px",
              overflow: "hidden",
              bgcolor: isDarkMode ? "#444" : "#e0e0e0",
              cursor: "pointer",
            }}
          >
            {/* Label Part */}
            <Box
              sx={{
                bgcolor: attr.color,
                color: "white",
                paddingX: 1,
                paddingY: 0.5,
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {t(attr.label)}
            </Box>
            {/* Value Part */}
            <Box
              sx={{
                paddingX: 1.5,
                paddingY: 0.5,
                fontSize: "1rem",
                fontWeight: "bold",
                color:
                  attr.value === attr.originalValue
                    ? "inherit"
                    : attr.value > attr.originalValue
                    ? "green !important"
                    : "red !important",
              }}
            >
              {attr.value}
            </Box>
          </Box>
        ))}
      </Box>
      <AttributeModifierDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        attribute={selectedAttribute}
        npc={selectedNPC}
        onUpdate={handleUpdateModifiers}
      />
    </>
  );
};

export default AttributeSection;
