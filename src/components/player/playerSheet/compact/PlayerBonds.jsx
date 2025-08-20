import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Tooltip,
  Box
} from "@mui/material";
import { styled, useTheme } from "@mui/system";
import { useTranslate } from "../../../../translation/translate";
import { useCustomTheme } from "../../../../hooks/useCustomTheme";

const StyledTableCellHeader = styled(TableCell)({ padding: 0, color: "#fff" });
const StyledTableCell = styled(TableCell)({ padding: 0 });

export default function PlayerBonds({ player, isMainTab }) {
  const { t } = useTranslate();
  const theme = useTheme();
  const customTheme = useCustomTheme();

  const FilledStarSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 95.74 95.98"
      width="18"
      height="18"
    >
      <path
        fill={theme.palette.mode === 'dark' ? "white" : "black"}
        opacity=".96"
        stroke={theme.palette.mode === 'dark' ? "white" : "black"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6px"
        d="M33.55,33.94l-28.7,11.66c-2.5,1.01-2.46,4.56.06,5.52l29,11.08,11.7,28.97c.98,2.43,4.44,2.41,5.39-.04l11.28-29.09,28.57-11.79c2.54-1.05,2.51-4.66-.05-5.66l-28.84-11.27-11.73-28.5c-1.02-2.47-4.54-2.43-5.5.06l-11.18,29.04Z"
      />
    </svg>
  );

  const calculateBondStrength = (bond) => {
    return (
      (bond.admiration ? 1 : 0) +
      (bond.loyality ? 1 : 0) +
      (bond.affection ? 1 : 0) +
      (bond.inferiority ? 1 : 0) +
      (bond.mistrust ? 1 : 0) +
      (bond.hatred ? 1 : 0)
    );
  };

  const positiveColor = theme.palette.success.main;
  const negativeColor = "red";

  return (
    <>
      {player.info.bonds.length > 0 && (
        <TableContainer component={Paper} sx={{ padding: 0 }} spacing={0}>
          <Table spacing={0} size="small">
            {!isMainTab && (
              <TableHead>
                <TableRow
                  sx={{
                    p: 0.5,
                    background: `${customTheme.primary}`,
                    "& .MuiTypography-root": {
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      textTransform: "uppercase",
                    },
                  }}
                >
                  <StyledTableCellHeader sx={{ px: 4, py: 0.5 }}>
                    <Typography variant="h4" textAlign="left">
                      {t("Bonds")}
                    </Typography>
                  </StyledTableCellHeader>
                  <StyledTableCellHeader />
                  <StyledTableCellHeader />
                </TableRow>
              </TableHead>
            )}
            <TableBody>
              {player.info.bonds.map((bond, index) => (
                <TableRow key={index}>
                  <StyledTableCell sx={{ px: 4, py: 0.5 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {bond.name}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell sx={{ px: 2, py: 0.5 }}>
                    <Typography variant="body2" fontWeight="bold" textAlign="right">
                      {[
                        bond.admiration && (
                          <span
                            key="admiration"
                            style={{ color: positiveColor }}
                          >
                            {t("Admiration")}
                          </span>
                        ),
                        bond.loyality && (
                          <span
                            key="loyality"
                            style={{ color: positiveColor }}
                          >
                            {t("Loyality")}
                          </span>
                        ),
                        bond.affection && (
                          <span
                            key="affection"
                            style={{ color: positiveColor }}
                          >
                            {t("Affection")}
                          </span>
                        ),
                        bond.inferiority && (
                          <span
                            key="inferiority"
                            style={{ color: negativeColor }}
                          >
                            {t("Inferiority")}
                          </span>
                        ),
                        bond.mistrust && (
                          <span
                            key="mistrust"
                            style={{ color: negativeColor }}
                          >
                            {t("Mistrust")}
                          </span>
                        ),
                        bond.hatred && (
                          <span
                            key="hatred"
                            style={{ color: negativeColor }}
                          >
                            {t("Hatred")}
                          </span>
                        ),
                      ]
                        .filter(Boolean)
                        .reduce(
                          (acc, curr, i, arr) => [
                            ...acc,
                            curr,
                            i < arr.length - 1 ? ", " : "",
                          ],
                          []
                        )}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: 60 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {calculateBondStrength(bond) > 0 && (
                        <Tooltip title={t("Bond Strength")}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {FilledStarSVG}
                            <Typography variant="body2" sx={{ ml: 0.5 }} fontWeight="bold">
                              {calculateBondStrength(bond)}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
