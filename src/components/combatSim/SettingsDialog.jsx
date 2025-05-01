import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Paper,
  TextField,
  InputAdornment,
  Collapse,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { t } from "../../translation/translate";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  AutoFixHigh as AutoUseMPIcon,
  DragIndicator as UseDragAndDropIcon,
  SaveAs as AutosaveIcon,
  History as AutoOpenLogsIcon,
  Timer as AutosaveIntervalIcon,
  Notifications as ShowSaveSnackbarIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as AutoCheckTurnIcon,
  Delete as AskBeforeRemoveIcon,
  TimesOneMobiledata as AutoRollSpellOneTargetIcon,
  Restore as ResetDefaultsIcon,
} from "@mui/icons-material";
import { PiSwordFill } from "react-icons/pi";
import { GoLog as HideLogsIcon } from "react-icons/go";
import {
  GiBurningDot as ShowSpellEffectIcon,
  GiClawSlashes as ShowBaseAttackEffectIcon,
  GiDeathSkull as AutoRemoveNPCFaintIcon,
} from "react-icons/gi";
import { getDefaultSettings } from "../../utility/combatSimSettings";
import { globalConfirm } from "../../utility/globalConfirm";

const SettingsDialog = ({
  open,
  onClose,
  onSave,
  settings,
  onSettingChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === "dark";

  // State to track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState({
    automation: true,
    interface: true,
  });

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const {
    autoUseMP,
    autoOpenLogs,
    useDragAndDrop,
    autosaveEnabled,
    autosaveInterval,
    showSaveSnackbar,
    hideLogs,
    showBaseAttackEffect,
    showWeaponAttackEffect,
    showSpellEffect,
    autoCheckTurnAfterRoll,
    askBeforeRemove,
    autoRemoveNPCFaint,
    autoRollSpellOneTarget,
  } = settings;

  const handleSwitchChange = (name) => (event) => {
    onSettingChange(name, event.target.checked);
  };

  const handleIntervalChange = (event) => {
    const value = event.target.value;

    // Allow empty input while typing
    if (value === "") {
      onSettingChange("autosaveInterval", "");
      return;
    }

    // Otherwise parse to integer
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue)) {
      onSettingChange("autosaveInterval", parsedValue);
    }
  };

  const handleIntervalBlur = () => {
    let value = settings.autosaveInterval;

    // If it's empty or invalid, default to 0
    if (value === "" || isNaN(value)) {
      value = 0;
    }

    // Clamp to 0–300
    const clamped = Math.min(Math.max(value, 0), 300);
    onSettingChange("autosaveInterval", clamped);
  };

  const settingsCategories = [
    {
      title: t("combat_sim_settings_automation"),
      key: "automation",
      items: [
        {
          // Automatically check for new turns after rolling
          name: "autoCheckTurnAfterRoll",
          value: autoCheckTurnAfterRoll,
          label: t("combat_sim_settings_auto_check_turn"),
          icon: <AutoCheckTurnIcon />,
          type: "switch",
        },
        {
          // Automatically use MP when NPC casts spells
          name: "autoUseMP",
          value: autoUseMP,
          label: t("combat_sim_settings_auto_use_mp"),
          icon: <AutoUseMPIcon />,
          type: "switch",
        },
        {
          // Automatically roll for spells that have 1 target without asking the amount of targets
          name: "autoRollSpellOneTarget",
          value: autoRollSpellOneTarget,
          label: t("combat_sim_settings_auto_roll_spell_one_target"),
          icon: <AutoRollSpellOneTargetIcon />,
          type: "switch",
        },
        {
          // Automatically open logs when rolling for NPCs
          name: "autoOpenLogs",
          value: autoOpenLogs,
          label: t("combat_sim_settings_auto_open_logs"),
          icon: <AutoOpenLogsIcon />,
          type: "switch",
        },
        {
          // Turn on automatic save if there are unsaved changes
          name: "autosaveEnabled",
          value: autosaveEnabled,
          label: t("combat_sim_settings_autosave_desktop"),
          icon: <AutosaveIcon />,
          type: "switch",
        },
        {
          // Set the autosave interval
          name: "autosaveInterval",
          value: autosaveInterval,
          label: t("combat_sim_settings_autosave_interval"),
          icon: <AutosaveIntervalIcon />,
          type: "number",
          disabled: !autosaveEnabled,
        },
        {
          // Ask before removing an NPC
          name: "askBeforeRemove",
          value: askBeforeRemove,
          label: t("combat_sim_settings_ask_before_remove"),
          icon: <AskBeforeRemoveIcon />,
          type: "switch",
        },
        {
          // Automatically remove NPC when they faint
          name: "autoRemoveNPCFaint",
          value: autoRemoveNPCFaint,
          label: t("combat_sim_settings_auto_remove_npc_faint"),
          icon: <AutoRemoveNPCFaintIcon />,
          type: "switch",
        },
      ],
    },
    {
      title: t("combat_sim_settings_interface"),
      key: "interface",
      items: [
        {
          // Use drag and drop to move items in the list
          name: "useDragAndDrop",
          value: useDragAndDrop,
          label: t("combat_sim_settings_use_drag_and_drop"),
          icon: <UseDragAndDropIcon />,
          type: "switch",
        },
        {
          // Show a snackbar when saving changes
          name: "showSaveSnackbar",
          value: showSaveSnackbar,
          label: t("combat_sim_settings_show_save_snackbar"),
          icon: <ShowSaveSnackbarIcon />,
          type: "switch",
        },
        {
          // Hide the combat logs
          name: "hideLogs",
          value: hideLogs,
          label: t("combat_sim_settings_log_hide"),
          icon: <HideLogsIcon />,
          type: "switch",
        },
        {
          // Show the effect of base attacks in the log if the attack has it
          name: "showBaseAttackEffect",
          value: showBaseAttackEffect,
          label: t("combat_sim_settings_show_base_attack_effect"),
          icon: <ShowBaseAttackEffectIcon />,
          type: "switch",
        },
        {
          // Show the effect of weapon attacks in the log if the attack has it
          name: "showWeaponAttackEffect",
          value: showWeaponAttackEffect,
          label: t("combat_sim_settings_show_weapon_attack_effect"),
          icon: <PiSwordFill />,
          type: "switch",
        },
        {
          // Show the effect of spells in the log if the spell has it
          name: "showSpellEffect",
          value: showSpellEffect,
          label: t("combat_sim_settings_show_spell_effect"),
          icon: <ShowSpellEffectIcon />,
          type: "switch",
        },
      ],
    },
  ];

  const handleResetDefaults = async () => {
    const confirmReset = await globalConfirm(
      t("combat_sim_settings_reset_defaults_confirm")
    );

    if (!confirmReset) return;

    // Get default settings
    const defaultSettings = getDefaultSettings();

    // Update all settings at once
    Object.entries(defaultSettings).forEach(([name, value]) => {
      onSettingChange(name, value);
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: isMobile ? 0 : 3,
          padding: 0,
          height: isMobile ? "100%" : "auto",
          maxHeight: isMobile ? "100%" : "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 1,
          pt: 2,
          px: 3,
        }}
      >
        <Box display="flex" alignItems="center">
          <SaveIcon
            sx={{
              mr: 1.5,
              color: isDarkMode
                ? theme.palette.secondary.main
                : theme.palette.primary.main,
            }}
          />
          <Typography variant="h3" fontWeight="bold">
            {t("combat_sim_settings")}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            mt: 0,
            overflowY: "auto",
            maxHeight: isMobile ? "100%" : "60vh",
          }}
        >
          {settingsCategories.map((category, categoryIndex) => (
            <Paper
              key={categoryIndex}
              elevation={0}
              sx={{
                m: 2,
                mb: 3,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  bgcolor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                  px: 2,
                  py: 1.5,
                  borderBottom: expandedCategories[category.key]
                    ? `1px solid ${theme.palette.divider}`
                    : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => toggleCategory(category.key)}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {category.title}
                </Typography>
                <IconButton
                  size="small"
                  sx={{ p: 0.5 }}
                  aria-label={
                    expandedCategories[category.key]
                      ? "Collapse section"
                      : "Expand section"
                  }
                  aria-expanded={expandedCategories[category.key]}
                >
                  {expandedCategories[category.key] ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>

              <Collapse in={expandedCategories[category.key]}>
                <List sx={{ py: 0 }}>
                  {category.items.map((item, itemIndex) => (
                    <ListItem
                      key={itemIndex}
                      sx={{
                        borderBottom:
                          itemIndex < category.items.length - 1
                            ? `1px solid ${theme.palette.divider}`
                            : "none",
                        py: 0.5,
                        alignItems: "center",
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {React.cloneElement(item.icon, {
                          style: {
                            color:
                              (item.type === "switch" && item.value) ||
                              (item.type === "number" && !item.disabled)
                                ? isDarkMode
                                  ? theme.palette.secondary.main
                                  : theme.palette.primary.main
                                : theme.palette.text.disabled,
                            fontSize: 20, // Explicit size for all icons
                            verticalAlign: "middle",
                            ...item.icon.props.style, // Preserve existing styles
                          },
                          size: 20, // For react-icons
                          fontSize: "small", // For MUI icons
                        })}
                      </ListItemIcon>
                      <ListItemText primary={item.label} sx={{ my: 0 }} />
                      {item.type === "switch" && (
                        <Switch
                          checked={item.value}
                          onChange={handleSwitchChange(item.name)}
                          size="medium"
                          color="primary"
                          inputProps={{ "aria-label": item.label }}
                        />
                      )}
                      {item.type === "number" && (
                        <TextField
                          type="number"
                          value={item.value}
                          onChange={handleIntervalChange}
                          onBlur={handleIntervalBlur}
                          disabled={item.disabled}
                          size="small"
                          sx={{ width: "100px" }}
                          slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  sec
                                </InputAdornment>
                              ),
                              inputProps: { step: 5 },
                            },
                          }}
                        />
                      )}
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Paper>
          ))}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 0,
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          position: "relative",
          bottom: 0,
          bgcolor: theme.palette.background.paper,
        }}
      >
        {/* Left side - Reset button (on mobile it'll appear first in column) */}
        <Box
          sx={{
            display: "block",
            justifyContent: "flex-start",
          }}
        >
          {isMobile ? (
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleResetDefaults}
              sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
            >
              <ResetDefaultsIcon />
            </Button>
          ) : (
            <Button
              onClick={handleResetDefaults}
              color="inherit"
              variant="outlined"
              sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
              startIcon={<ResetDefaultsIcon />}
            >
              {t("combat_sim_settings_reset_defaults")}
            </Button>
          )}
        </Box>

        {/* Right side - Cancel and Save buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={onClose}
            color="inherit"
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              mr: 1,
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={onSave}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
            }}
          >
            {t("Save Changes")}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
