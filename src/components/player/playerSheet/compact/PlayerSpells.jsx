import React from "react";
import { Paper, Typography, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { styled } from "@mui/system";
import { useTranslate } from "../../../../translation/translate";
import SpellDefault from "../../spells/SpellDefault";
import SpellArcanist from "../../spells/SpellArcanist";
import SpellEntropistGamble from "../../spells/SpellEntropistGamble";
import { useCustomTheme } from "../../../../hooks/useCustomTheme";

// Styled Components
const StyledTableCellHeader = styled(TableCell)({ padding: 0, color: "#fff" });
const StyledTableCell = styled(TableCell)({ padding: 0 });

export default function PlayerSpellsFull({ player, isCharacterSheet }) {
  const { t } = useTranslate();
  const theme = useCustomTheme();

  return (
    <>
      {player.classes.length > 0 &&
        player.classes.some((c) =>
          c.spells.some(
            (spell) =>
              (spell.spellType === "default" || spell.spellType === "gamble") &&
              (spell.showInPlayerSheet || spell.showInPlayerSheet === undefined)
          )
        ) && (
          <Grid container spacing={2}>
            {player.classes
              .filter((c) =>
                c.spells.some(
                  (spell) =>
                    (spell.spellType === "default" ||
                      spell.spellType === "gamble") &&
                    (spell.showInPlayerSheet ||
                      spell.showInPlayerSheet === undefined)
                )
              )
              .map((c, index) => (
                <Grid item xs={12} key={index}>

                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          background: theme.primary,
                          "& .MuiTypography-root": {
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            textTransform: "uppercase",
                          },
                        }}
                      >
                        <StyledTableCellHeader sx={{ width: 24 }} />
                        <StyledTableCellHeader>
                          <Typography variant="h4">{t("Spells") + " - " + t(c.name)}</Typography>
                        </StyledTableCellHeader>
                      </TableRow>
                    </TableHead>
                  </Table>

                    {c.spells
                      .filter(
                        (spell) =>
                          spell.spellType === "default" &&
                          (spell.showInPlayerSheet ||
                            spell.showInPlayerSheet === undefined)
                      )
                      .map((spell, spellIndex) => (
                        <React.Fragment key={spellIndex}>
                          {spellIndex === 0 && (
                          <TableContainer component={Paper}>
                            <Table>
                              <TableHead>
                                <TableRow
                                  sx={{
                                    backgroundColor: theme.primary,
                                    "& .MuiTypography-root": {
                                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                      textTransform: "uppercase",
                                      padding: "2px 24px",
                                    }
                                  }}
                                >
                                  <StyledTableCellHeader />
                                  <StyledTableCellHeader>
                                    <Box display="flex" justifyContent="left" alignItems="center">
                                      <Typography variant="h4">{t("Spell")}</Typography>
                                    </Box>
                                  </StyledTableCellHeader>
                                  <StyledTableCellHeader>
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                      <Typography variant="h4">{t("MP")}</Typography>
                                    </Box>
                                  </StyledTableCellHeader>
                                  <StyledTableCellHeader>
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                      <Typography variant="h4">{t("Target")}</Typography>
                                    </Box>
                                  </StyledTableCellHeader>
                                  <StyledTableCellHeader>
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                      <Typography variant="h4">{t("Duration")}</Typography>
                                    </Box>
                                  </StyledTableCellHeader>
                                </TableRow>
                              </TableHead>
                            </Table>
                          </TableContainer>
                          )}
                          <SpellDefault
                            key={spellIndex}
                            spellName={spell.name}
                            mp={spell.mp}
                            maxTargets={spell.maxTargets}
                            targetDesc={spell.targetDesc}
                            duration={spell.duration}
                            description={spell.description}
                            isEditMode={false}
                            isOffensive={spell.isOffensive}
                            isMagisphere={spell.isMagisphere || false}
                            attr1={spell.attr1}
                            attr2={spell.attr2}
                          />
                        </React.Fragment>
                      ))}

                    {c.spells
                      .filter(
                        (spell) =>
                          spell.spellType === "gamble" &&
                          (spell.showInPlayerSheet ||
                            spell.showInPlayerSheet === undefined)
                      )
                      .map((spell, spellIndex) => (
                        <SpellEntropistGamble
                          key={spellIndex}
                          gamble={spell}
                          isEditMode={false}
                        />
                      ))}
                  
                </Grid>
              ))}
            {player.classes
              .filter((c) =>
                c.spells.some(
                  (spell) =>
                    (spell.spellType === "arcanist" ||
                      spell.spellType === "arcanist-rework") &&
                    (spell.showInPlayerSheet ||
                      spell.showInPlayerSheet === undefined)
                )
              )
              .map((c, index) => (
                <Grid item xs={12} key={index}>
                    {c.spells
                      .filter(
                        (spell) =>
                          (spell.spellType === "arcanist" ||
                            spell.spellType === "arcanist-rework") &&
                          (spell.showInPlayerSheet ||
                            spell.showInPlayerSheet === undefined)
                      )
                      .map((spell, spellIndex) => (
                        <div
                          key={spellIndex}
                        >
                          <SpellArcanist
                            arcana={spell}
                            isEditMode={false}
                            rework={spell.spellType === "arcanist-rework"}
                          />
                        </div>
                      ))}
                </Grid>
              ))}
          </Grid>
        )}
    </>
  );
}
