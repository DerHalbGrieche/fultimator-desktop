import React from "react";
import {
  Typography,
  ThemeProvider,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import attributes from "../../../../../libs/attributes";
import { useTranslate } from "../../../../../translation/translate";
import { useCustomTheme } from "../../../../../hooks/useCustomTheme";

const StyledTableCell = styled(TableCell)({ 
  padding: "2px 4px",
  fontSize: "0.75rem",
  borderBottom: "1px solid rgba(224, 224, 224, 1)"
});

function ThemedSpellEntropistGamble({ gamble }) {
  const { t } = useTranslate();
  const theme = useCustomTheme();

  return (
    <TableContainer component={Paper} sx={{ marginBottom: 1 }}>
      <Table size="small">
        <TableBody>
          {/* Header Row */}
          <TableRow sx={{ backgroundColor: theme.primary }}>
            <StyledTableCell colSpan={4} sx={{ color: "white", fontWeight: "bold", fontSize: "0.8rem", textAlign: "center" }}>
              {gamble.spellName} - {gamble.mp}MP × {gamble.maxTargets} {t("Max Dices")} - {t(attributes[gamble.attr].shortcaps)}
            </StyledTableCell>
          </TableRow>

          {/* Target Effects */}
          {gamble.targets?.map((target, index) => (
            <TableRow key={index} sx={{ background: index % 2 === 0 ? `linear-gradient(to right, ${theme.ternary}, #fff)` : '#fff' }}>
              <StyledTableCell sx={{ width: "15%" }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: "bold" }}>
                  {target.rangeFrom === target.rangeTo 
                    ? target.rangeFrom 
                    : `${target.rangeFrom}-${target.rangeTo}`}
                </Typography>
              </StyledTableCell>
              <StyledTableCell colSpan={3} sx={{ width: "85%" }}>
                <Box>
                  <Typography sx={{ fontSize: "0.75rem" }}>
                    {target.effect}
                  </Typography>
                  {target.secondRoll && target.secondEffects?.length > 0 && (
                    <Box sx={{ marginTop: 0.25, paddingLeft: 0.5 }}>
                      <Typography sx={{ fontSize: "0.7rem", fontStyle: "italic", fontWeight: "bold" }}>
                        {t("Second Roll:")}
                      </Typography>
                      {target.secondEffects.map((secondEffect, secondIndex) => (
                        <Typography key={secondIndex} sx={{ fontSize: "0.7rem", paddingLeft: 0.5 }}>
                          {secondEffect.rangeFrom === secondEffect.rangeTo 
                            ? secondEffect.rangeFrom 
                            : `${secondEffect.rangeFrom}-${secondEffect.rangeTo}`}: {secondEffect.effect}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function SpellEntropistGamble(props) {
  const theme = useCustomTheme();
  return (
    <ThemeProvider theme={theme}>
      <ThemedSpellEntropistGamble {...props} />
    </ThemeProvider>
  );
}