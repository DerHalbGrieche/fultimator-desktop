import React from "react";
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
  InputAdornment
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { t } from "../../translation/translate";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import HistoryIcon from "@mui/icons-material/History";
import TimerIcon from "@mui/icons-material/Timer";
import NotificationsIcon from '@mui/icons-material/Notifications';
import InfoIcon from '@mui/icons-material/Info';

const SettingsDialog = ({
  open,
  onClose,
  onSave,
  settings,
  onSettingChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === "dark";

  const { autoUseMP, autoOpenLogs, useDragAndDrop, autosaveEnabled, autosaveInterval, showSaveSnackbar, hideLogs } = settings;

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
      items: [
        {
          name: "autoUseMP",
          value: autoUseMP,
          label: t("combat_sim_auto_use_mp"),
          icon: <AutoFixHighIcon />,
          type: "switch"
        },
        {
          name: "autoOpenLogs",
          value: autoOpenLogs,
          label: t("combat_sim_auto_open_logs"),
          icon: <HistoryIcon />,
          type: "switch"
        },
        {
          name: "autosaveEnabled",
          value: autosaveEnabled,
          label: t("combat_sim_autosave_setting_desktop"),
          icon: <SaveAsIcon />,
          type: "switch"
        },
        {
          name: "autosaveInterval",
          value: autosaveInterval,
          label: t("combat_sim_autosave_interval"),
          icon: <TimerIcon />,
          type: "number",
          disabled: !autosaveEnabled
        }
      ]
    },
    {
      title: t("combat_sim_settings_interface"),
      items: [
        {
          name: "useDragAndDrop",
          value: useDragAndDrop,
          label: t("combat_sim_use_drag_and_drop"),
          icon: <DragIndicatorIcon />,
          type: "switch"
        },
        {
          name: "showSaveSnackbar",
          value: showSaveSnackbar,
          label: t("combat_sim_show_save_snackbar"),
          icon: <NotificationsIcon />,
          type: "switch"
        },
        {
          name: "hideLogs",
          value: hideLogs,
          label: t("combat_sim_log_hide"),
          icon: <InfoIcon />,
          type: "switch"
        }
      ]
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      sx={{ 
        "& .MuiDialog-paper": { 
          borderRadius: isMobile ? 0 : 3, 
          padding: 0,
          height: isMobile ? "100%" : "auto",
          maxHeight: isMobile ? "100%" : "80vh"
        } 
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
          px: 3
        }}
      >
        <Box display="flex" alignItems="center">
          <SaveIcon sx={{ mr: 1.5, color: isDarkMode ? theme.palette.secondary.main : theme.palette.primary.main }} />
          <Typography variant="h3" fontWeight="bold">
            {t("combat_sim_settings")}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ mt: 0, overflowY: "auto", maxHeight: isMobile ? "100%" : "60vh" }}>
          {settingsCategories.map((category, categoryIndex) => (
            <Paper
              key={categoryIndex}
              elevation={0}
              sx={{ 
                m: 2, 
                mb: 3, 
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                overflow: "hidden"
              }}
            >
              <Box
                sx={{
                  bgcolor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                  px: 2,
                  py: 1.5,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {category.title}
                </Typography>
              </Box>
              
              <List sx={{ py: 0 }}>
                {category.items.map((item, itemIndex) => (
                  <ListItem
                    key={itemIndex}
                    sx={{
                      borderBottom: itemIndex < category.items.length - 1 ? `1px solid ${theme.palette.divider}` : "none",
                      py: 0.5,
                      alignItems: "center"
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {React.cloneElement(item.icon, {
                        color: (item.type === "switch" && item.value) || 
                               (item.type === "number" && !item.disabled) ? 
                               (isDarkMode ? "secondary" : "primary") : "disabled",
                        fontSize: "small"
                      })}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label}
                      sx={{ my: 0 }}
                    />
                    {item.type === "switch" && (
                      <Switch
                        checked={item.value}
                        onChange={handleSwitchChange(item.name)}
                        size="medium"
                        color="primary"
                        inputProps={{ 'aria-label': item.label }}
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
                      sx={{ width: '100px' }}
                      slotProps={{
                        input: {
                          endAdornment: <InputAdornment position="end">sec</InputAdornment>,
                          inputProps: { step: 5 }
                        }
                      }}
                    />                    
                    )}
                  </ListItem>
                ))}
              </List>
            </Paper>
          ))}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{ 
          justifyContent: "flex-end", 
          p: 2, 
          borderTop: `1px solid ${theme.palette.divider}`,
          position: isMobile ? "sticky" : "relative",
          bottom: 0,
          bgcolor: theme.palette.background.paper
        }}
      >
        <Button
          onClick={onClose}
          color="inherit"
          variant="outlined"
          sx={{ 
            borderRadius: 2, 
            textTransform: "none", 
            px: 3,
            mr: 1
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
            px: 3 
          }}
        >
          {t("Save Changes")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;