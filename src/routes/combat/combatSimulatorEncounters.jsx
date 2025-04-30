import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Paper,
  CardActions,
  Tooltip,
  Snackbar,
  Alert,
  Fade,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getEncounterList,
  addEncounter,
  deleteEncounter,
} from "../../utility/db";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import Layout from "../../components/Layout";
import { useTheme } from "@mui/material/styles";
import CustomHeaderAlt from "../../components/common/CustomHeaderAlt";
import SettingsDialog from "../../components/combatSim/SettingsDialog";
import { SportsMartialArts, NavigateNext } from "@mui/icons-material";
import { t } from "../../translation/translate";

const MAX_ENCOUNTERS = 100;

// Define settings schema and defaults to maintain consistency
const SETTINGS_CONFIG = {
  autoUseMP: {
    key: "combatSimAutoUseMP",
    defaultValue: true
  },
  autoOpenLogs: {
    key: "combatSimAutoOpenLogs",
    defaultValue: true
  },
  useDragAndDrop: {
    key: "combatSimUseDragAndDrop",
    defaultValue: true
  },
  autosaveEnabled: {
    key: "combatSimAutosave",
    defaultValue: false
  },
  autosaveInterval: {
    key: "combatSimAutosaveInterval",
    defaultValue: 30
  },
  showSaveSnackbar: {
    key: "combatSimShowSaveSnackbar",
    defaultValue: true
  }
};

export default function CombatSimulatorEncounters() {
  return (
    <Layout fullWidth={true}>
      <CombatSimEncounters />
    </Layout>
  );
}

const CombatSimEncounters = () => {
  const [encounters, setEncounters] = useState([]);
  const [encounterName, setEncounterName] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  
  // Initialize settings from localStorage with defaults
  const [settings, setSettings] = useState(() => {
    const initialSettings = {};
    
    // Set up each setting with value from localStorage or default
    Object.entries(SETTINGS_CONFIG).forEach(([settingName, config]) => {
      const storedValue = localStorage.getItem(config.key);
      
      // Handle numeric values like autosaveInterval separately
      if (settingName === "autosaveInterval") {
        initialSettings[settingName] = storedValue === null ? 
          config.defaultValue : 
          parseInt(storedValue, 10);
      } else {
        initialSettings[settingName] = storedValue === null ? 
          config.defaultValue : 
          storedValue === "true";
      }
    });
    
    return initialSettings;
  });

  // Handler to update individual settings
  const handleSettingChange = useCallback((name, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value,
    }));
  }, []);

  // Fetch encounters data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const encounterList = await getEncounterList();
      encounterList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setEncounters(encounterList);
    } catch (error) {
      console.error("Error fetching encounters:", error);
      showNotification("Failed to load encounters", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize settings and fetch data on mount
  useEffect(() => {
    // Ensure default settings are in localStorage
    Object.entries(SETTINGS_CONFIG).forEach(([config]) => {
      if (localStorage.getItem(config.key) === null) {
        localStorage.setItem(config.key, config.defaultValue?.toString());
      }
    });
    
    fetchData();
  }, [fetchData]);

  // Show notification helper
  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Save settings to localStorage
  const handleSaveSettings = useCallback(() => {
    Object.entries(settings).forEach(([settingName, value]) => {
      const key = SETTINGS_CONFIG[settingName]?.key;
      if (key) {
        localStorage.setItem(key, value.toString());
      }
    });
    
    setSettingsOpen(false);
    showNotification(t("combat_sim_settings_saved_successfully"));
  }, [settings]);

  // Close settings dialog without saving changes
  const handleCloseSettings = useCallback(() => {
    setSettingsOpen(false);
    
    // Reset settings state from localStorage on close/cancel
    const restoredSettings = {};
    Object.entries(SETTINGS_CONFIG).forEach(([settingName, config]) => {
      if (settingName === "autosaveInterval") {
        const storedValue = localStorage.getItem(config.key);
        restoredSettings[settingName] = storedValue === null ? 
          config.defaultValue : 
          parseInt(storedValue, 10);
      } else {
        restoredSettings[settingName] = localStorage.getItem(config.key) === "true";
      }
    });
    
    setSettings(restoredSettings);
  }, []);

  const handleEncounterNameChange = (event) => {
    setEncounterName(event.target.value);
  };

  const handleSaveEncounter = async () => {
    if (!encounterName.trim() || encounters.length >= MAX_ENCOUNTERS) return;

    try {
      const newEncounter = {
        name: encounterName.trim(),
        round: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addEncounter(newEncounter);
      await fetchData();
      setEncounterName("");
      showNotification(t("combat_sim_encounter_created"));
    } catch (error) {
      console.error("Error saving encounter:", error);
      showNotification(t("combat_sim_error_creating_encounter"), "error");
    }
  };

  const handleDeleteEncounter = async (id) => {
    try {
      await deleteEncounter(id);
      await fetchData();
      showNotification(t("combat_sim_encounter_deleted"));
    } catch (error) {
      console.error("Error deleting encounter:", error);
      showNotification(t("combat_sim_error_deleting_encounter"), "error");
    }
  };

  const handleNavigateToEncounter = (id) => {
    navigate(`/combat-sim/${id}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && encounterName.trim()) {
      handleSaveEncounter();
    }
  };


  return (
    <Box sx={{ padding: 3, maxWidth: "1200px", margin: "auto" }}>
      <Paper
        elevation={isDarkMode ? 6 : 3}
        sx={{
          p: "14px",
          borderRadius: "8px",
          border: `2px solid ${theme.palette.secondary.main}`,
          backgroundColor: theme.palette.background.paper,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Header with Settings Button */}

        <CustomHeaderAlt
          headerText={t("combat_sim_title")}
          icon={<SportsMartialArts fontSize="large" />}
        />

        <div style={{ paddingLeft: 10, paddingRight: 10 }}>
          <Typography variant="h6" gutterBottom color="text.primary">
            {t("combat_sim_new_encounter")}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                label={t("combat_sim_encounter_name")}
                variant="outlined"
                fullWidth
                value={encounterName}
                onKeyDown={handleKeyDown}
                onChange={handleEncounterNameChange}
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSaveEncounter}
                disabled={!encounterName || encounters.length >= MAX_ENCOUNTERS}
                sx={{ height: "100%" }}
              >
                {t("combat_sim_create_encounter")}
              </Button>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            mt={2}
          >
            <Typography variant="h5" color="text.primary">
              {t("combat_sim_saved_encounters")} ({encounters.length}/
              {MAX_ENCOUNTERS})
            </Typography>
            <Tooltip title={t("combat_sim_settings")}>
              <IconButton
                color={isDarkMode ? "white" : "primary"}
                onClick={() => setSettingsOpen(true)}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </div>
      </Paper>

      <Grid container spacing={3} sx={{ marginTop: 2 }}>
        {isLoading && (
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
        )}
        {!isLoading && encounters.map((encounter) => (
          <Grid item xs={12} sm={6} md={4} key={encounter.id}>
            <Card
              sx={{
                backgroundColor: isDarkMode
                  ? "#292929"
                  : theme.palette.background.paper,
                borderRadius: 3,
                boxShadow: isDarkMode ? 6 : 4,
                transition: "0.3s",
                "&:hover": {
                  boxShadow: isDarkMode ? 10 : 8,
                  transform: "scale(1.03)",
                },
                cursor: "pointer",
                color: theme.palette.text.primary,
                position: "relative",
              }}
              onClick={() => handleNavigateToEncounter(encounter.id)}
            >
              <CardContent sx={{ paddingBottom: "10px" }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "text.primary" }}
                >
                  {encounter.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("combat_sim_created")}:{" "}
                  {new Date(encounter.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("combat_sim_last_updated")}:{" "}
                  {new Date(encounter.updatedAt).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions
                sx={{ justifyContent: "flex-end", padding: "10px 16px" }}
              >
                <Tooltip
                  title={t("Delete")}
                  enterDelay={300}
                  leaveDelay={200}
                  enterNextDelay={300}
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEncounter(encounter.id);
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
              <Box
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: theme.palette.text.secondary,
                }}
              >
                <NavigateNext fontSize="medium" />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onClose={handleCloseSettings}
        onSave={handleSaveSettings}
        settings={settings}
        onSettingChange={handleSettingChange}
      />

       {/* Notifications */}
       <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleNotificationClose}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};