import { Fragment } from "react";
import {
  Grid,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  useMediaQuery,
  Box,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell
} from "@mui/material";
import { styled } from "@mui/system";
import { useCustomTheme } from "../../../../hooks/useCustomTheme";
import { useTranslate } from "../../../../translation/translate";
import NotesMarkdown from "../../../common/NotesMarkdown";
import Clock from "../Clock";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

// Styled Components
const StyledTableCellHeader = styled(TableCell)(({ theme }) => ({ 
  padding: 0, 
  color: theme.white 
}));
const StyledTableCell = styled(TableCell)({ padding: 0 });

export default function PlayerNotes({ player, setPlayer, isCharacterSheet }) {
  const { t } = useTranslate();
  const theme = useCustomTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClockStateChange = (noteIndex, clockIndex, newState) => {
    setPlayer((prevPlayer) => {
      const updatedNotes = prevPlayer.notes.map((note, index) => {
        if (index === noteIndex) {
          const updatedClocks = note.clocks.map((clock, cIndex) => {
            if (cIndex === clockIndex) {
              return { ...clock, state: newState };
            }
            return clock;
          });
          return { ...note, clocks: updatedClocks };
        }
        return note;
      });
      return { ...prevPlayer, notes: updatedNotes };
    });
  };

  const resetClockState = (noteIndex, clockIndex) => {
    const resetState = new Array(
      player.notes[noteIndex].clocks[clockIndex].sections
    ).fill(false);
    handleClockStateChange(noteIndex, clockIndex, resetState);
  };

  return (
    <>
      {player.notes.filter((note) => note.showInPlayerSheet !== false).length >
        0 && (
        <>
        <Grid container spacing={0} sx={{ padding: 0 }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: theme.primary,
                  "& .MuiTypography-root": {
                    color: theme.white,
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    textTransform: "uppercase",
                  },
                }}
              >
                <StyledTableCellHeader sx={{ width: 24 }} />
                <StyledTableCellHeader>
                  <Typography variant="h4">{t("Notes")}</Typography>
                </StyledTableCellHeader>
              </TableRow>
            </TableHead>
          </Table>
          
          <Box sx={{ p: 0.5, width: "100%" }}>
            {player.notes
              .filter((note) => note.showInPlayerSheet !== false)
              .map((note, noteIndex) => (
                <Fragment key={noteIndex}>
                  <Box
                    sx={{
                      mb: 1,
                      p: 1,
                      borderRadius: 1,
                      bgcolor: "background.paper",
                      border: `1px solid ${theme.secondary}`,
                      boxShadow: "none",
                    }}
                  >
                    {note.name && (
                      <Typography
                        variant="subtitle2"
                        sx={{
                          mb: 0.5,
                          fontWeight: "bold",
                          color: theme.primary,
                          fontSize: "0.85rem",
                        }}
                      >
                        {note.name}
                      </Typography>
                    )}

{note.clocks && note.clocks.length > 0 ? (
                      <Grid container spacing={1} sx={{ alignItems: "flex-start" }}>
                        {/* Left side clocks */}
                        <Grid item xs={12} md={2}>
                          <Stack spacing={1}>
                            {note.clocks.slice(0, Math.ceil(note.clocks.length / 2)).map((clock, clockIndex) => (
                              <Stack
                                key={clockIndex}
                                alignItems="center"
                                sx={{ position: "relative" }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    mb: 0.25,
                                    textAlign: "center",
                                    fontWeight: "medium",
                                    color: theme.secondary,
                                    fontSize: "0.65rem",
                                  }}
                                >
                                  {clock.name}
                                </Typography>
                                <Clock
                                  isCharacterSheet={isCharacterSheet}
                                  numSections={clock.sections}
                                  size={isSmallScreen ? 60 : 80}
                                  state={clock.state}
                                  setState={(newState) =>
                                    handleClockStateChange(
                                      noteIndex,
                                      clockIndex,
                                      newState
                                    )
                                  }
                                />
                                {!isCharacterSheet && (
                                  <Tooltip
                                    title={`${t("Reset")} ${clock.name}`}
                                    arrow
                                  >
                                    <IconButton
                                      color="primary"
                                      size="small"
                                      onClick={() =>
                                        resetClockState(noteIndex, clockIndex)
                                      }
                                      sx={{
                                        mt: 0.25,
                                        bgcolor: "background.default",
                                        "&:hover": {
                                          bgcolor: "action.selected",
                                        },
                                      }}
                                    >
                                      <RestartAltIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Stack>
                            ))}
                          </Stack>
                        </Grid>

                        {/* Center text content */}
                        <Grid item xs={12} md={8}>
                          <NotesMarkdown
                            sx={{
                              fontFamily: "PT Sans Narrow",
                              fontSize: "0.8rem",
                              lineHeight: 1.4,
                              "& p": { mb: 0.5 },
                              "& ul": { mb: 0.5 },
                              "& ol": { mb: 0.5 },
                              "& h1, & h2, & h3, & h4, & h5, & h6": { 
                                mb: 0.5, 
                                fontSize: "0.85rem" 
                              },
                              px: { xs: 0, md: 1 },
                            }}
                          >
                            {note.description}
                          </NotesMarkdown>
                        </Grid>

                        {/* Right side clocks */}
                        <Grid item xs={12} md={2}>
                          <Stack spacing={1}>
                            {note.clocks.slice(Math.ceil(note.clocks.length / 2)).map((clock, sliceIndex) => {
                              const actualClockIndex = sliceIndex + Math.ceil(note.clocks.length / 2);
                              return (
                                <Stack
                                  key={actualClockIndex}
                                  alignItems="center"
                                  sx={{ position: "relative" }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      mb: 0.25,
                                      textAlign: "center",
                                      fontWeight: "medium",
                                      color: theme.secondary,
                                      fontSize: "0.65rem",
                                    }}
                                  >
                                    {clock.name}
                                  </Typography>
                                  <Clock
                                    isCharacterSheet={isCharacterSheet}
                                    numSections={clock.sections}
                                    size={isSmallScreen ? 60 : 80}
                                    state={clock.state}
                                    setState={(newState) =>
                                      handleClockStateChange(
                                        noteIndex,
                                        actualClockIndex,
                                        newState
                                      )
                                    }
                                  />
                                  {!isCharacterSheet && (
                                    <Tooltip
                                      title={`${t("Reset")} ${clock.name}`}
                                      arrow
                                    >
                                      <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() =>
                                          resetClockState(noteIndex, actualClockIndex)
                                        }
                                        sx={{
                                          mt: 0.25,
                                          bgcolor: "background.default",
                                          "&:hover": {
                                            bgcolor: "action.selected",
                                          },
                                        }}
                                      >
                                        <RestartAltIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Stack>
                              );
                            })}
                          </Stack>
                        </Grid>
                      </Grid>
                    ) : (
                      <NotesMarkdown
                        sx={{
                          fontFamily: "PT Sans Narrow",
                          fontSize: "0.8rem",
                          lineHeight: 1.4,
                          "& p": { mb: 0.5 },
                          "& ul": { mb: 0.5 },
                          "& ol": { mb: 0.5 },
                          "& h1, & h2, & h3, & h4, & h5, & h6": { 
                            mb: 0.5, 
                            fontSize: "0.85rem" 
                          },
                        }}
                      >
                        {note.description}
                      </NotesMarkdown>
                    )}
                  </Box>

                  {noteIndex <
                    player.notes.filter(
                      (note) => note.showInPlayerSheet !== false
                    ).length -
                      1 && <Divider sx={{ my: 0.5 }} />}
                </Fragment>
              ))}
          </Box>
        </Grid>
        </>
      )}
    </>
  );
}
