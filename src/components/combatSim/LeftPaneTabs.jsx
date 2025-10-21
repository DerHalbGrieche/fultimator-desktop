import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Paper, IconButton, Tooltip, Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { t } from '../../translation/translate';
import NpcSelector from './NpcSelector';
import Clock from '../player/playerSheet/Clock';
import { RemoveCircleOutline, RestartAlt, AccessTime, AddCircle, ChevronLeft, ChevronRight, Group, Schedule, Add, Remove, MoreVert } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useCombatSimSettingsStore } from '../../stores/combatSimSettingsStore';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      style={{ height: '100%', display: value === index ? 'flex' : 'none', flexDirection: 'column' }}
    >
      {value === index && (
        <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

const LeftPaneTabs = ({
  npcList,
  handleSelectNPC,
  encounterClocks,
  handleUpdateClock,
  handleRemoveClock,
  handleResetClock,
  addLog,
  isMobile,
  onAddClockClick,
}) => {
  const [value, setValue] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedClockIndex, setSelectedClockIndex] = useState(null);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Get log settings from store
  const { logClockCurrentState } = useCombatSimSettingsStore.getState().settings;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const logCurrentClock = (index) => {
    if (!logClockCurrentState) return;
    
    const clock = encounterClocks[index];
    addLog("combat_sim_log_clock_current_state", "--isClock--", {
      name: clock.name,
      current: clock.state.filter(Boolean).length,
      max: clock.sections,
    });
  };

  const handleIncrementClock = (index) => {
    const clock = encounterClocks[index];
    const currentFilled = clock.state.filter(Boolean).length;
    
    if (currentFilled < clock.sections) {
      const newState = [...clock.state];
      const nextEmptyIndex = newState.findIndex(section => !section);
      if (nextEmptyIndex !== -1) {
        newState[nextEmptyIndex] = true;
        handleUpdateClock(index, newState);
      }
    }
  };

  const handleDecrementClock = (index) => {
    const clock = encounterClocks[index];
    const newState = [...clock.state];
    const lastFilledIndex = newState.lastIndexOf(true);
    
    if (lastFilledIndex !== -1) {
      newState[lastFilledIndex] = false;
      handleUpdateClock(index, newState);
    }
  };

  const handleMenuOpen = (event, index) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedClockIndex(index);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedClockIndex(null);
  };

  const handleMenuAction = (action) => {
    if (selectedClockIndex === null) return;

    switch (action) {
      case 'reset':
        handleResetClock(selectedClockIndex);
        break;
      case 'log':
        logCurrentClock(selectedClockIndex);
        break;
      case 'remove':
        handleRemoveClock(selectedClockIndex);
        break;
      default:
        break;
    }
    handleMenuClose();
  };

  return (
    <Box
      sx={{ 
        flexGrow: 0,
        flexShrink: 0,
        bgcolor: isDarkMode ? "#333333" : "#ffffff",
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: isCollapsed ? '48px' : '350px',
        minWidth: isCollapsed ? '48px' : '300px',
        transition: 'width 0.3s ease',
      }}
    >
      {/* Horizontal Tabs at Top */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
        {!isCollapsed && (
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Left pane tabs"
            sx={{ 
              flexGrow: 1,
              '& .Mui-selected': {
                color: isDarkMode ? '#ffffff' : '#333333',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: isDarkMode ? '#ffffff' : '#333333',
              },
            }}
          >
            <Tab label={t("combat_sim_select_npcs")} {...a11yProps(0)} />
            <Tab label={t("clocks_section_title")} {...a11yProps(1)} />
          </Tabs>
        )}
        <Tooltip title={isCollapsed ? t("expand") : t("collapse")}>
          <IconButton 
            onClick={() => setIsCollapsed(!isCollapsed)}
            sx={{ 
              ml: isCollapsed ? 0 : 'auto',
              mr: 1,
            }}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Collapsed State - Tab Icons */}
      {isCollapsed && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2,
          mt: 2,
        }}>
          <Tooltip title={t("combat_sim_select_npcs")} placement="right">
            <IconButton 
              onClick={() => {
                setValue(0);
                setIsCollapsed(false);
              }}
              sx={{ 
                bgcolor: isDarkMode ? '#424242' : '#f5f5f5',
                '&:hover': {
                  bgcolor: isDarkMode ? '#555' : '#e0e0e0',
                }
              }}
            >
              <Group />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("clocks_section_title")} placement="right">
            <IconButton 
              onClick={() => {
                setValue(1);
                setIsCollapsed(false);
              }}
              sx={{ 
                bgcolor: isDarkMode ? '#424242' : '#f5f5f5',
                '&:hover': {
                  bgcolor: isDarkMode ? '#555' : '#e0e0e0',
                }
              }}
            >
              <Schedule />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      
      {/* Tab Content */}
      {!isCollapsed && (
        <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* NPC Selector Tab */}
          <TabPanel value={value} index={0}>
            <NpcSelector
              isMobile={isMobile}
              npcList={npcList}
              handleSelectNPC={handleSelectNPC}
            />
          </TabPanel>
          
          {/* Clocks Tab */}
          <TabPanel value={value} index={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
              {/* Add Clock Button */}
              <Button
                variant="contained"
                startIcon={<AddCircle />}
                onClick={onAddClockClick}
                fullWidth
                sx={{ mb: 1 }}
              >
                {t("clocks_add_button")}
              </Button>

              {/* Clocks List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, overflow: 'auto', flexGrow: 1 }}>
                {encounterClocks.length > 0 ? (
                  encounterClocks.map((clock, index) => (
                    <Paper 
                      key={index} 
                      sx={{ 
                        p: 1.5, 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 2,
                        bgcolor: isDarkMode ? '#424242' : '#f5f5f5',
                      }}
                    >
                      {/* Clock Visual (Left) */}
                      <Box sx={{ flexShrink: 0 }}>
                        <Clock
                          numSections={clock.sections}
                          size={60}
                          state={clock.state}
                          setState={(newState) => handleUpdateClock(index, newState)}
                          isCharacterSheet={false}
                        />
                      </Box>

                      {/* Right Side - Two Rows */}
                      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {/* First Row: Name and Hamburger Menu */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {clock.name}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, index)}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Box>

                        {/* Second Row: [-] X/X [+] */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleDecrementClock(index)}
                            disabled={clock.state.filter(Boolean).length === 0}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography variant="body2" sx={{ minWidth: '45px', textAlign: 'center' }}>
                            {clock.state.filter(Boolean).length} / {clock.sections}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleIncrementClock(index)}
                            disabled={clock.state.filter(Boolean).length === clock.sections}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary" sx={{ p: 2, textAlign: 'center' }}>
                    {t("clocks_empty_list")}
                  </Typography>
                )}
              </Box>
            </Box>
          </TabPanel>
        </Box>
      )}

      {/* Hamburger Menu for Clock Actions */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuAction('reset')}>
          <ListItemIcon>
            <RestartAlt fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("clocks_reset_tooltip")}</ListItemText>
        </MenuItem>
        {logClockCurrentState && (
          <MenuItem onClick={() => handleMenuAction('log')}>
            <ListItemIcon>
              <AccessTime fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("combat_sim_clock_log_button")}</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => handleMenuAction('remove')}>
          <ListItemIcon>
            <RemoveCircleOutline fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>{t("clocks_remove_tooltip")}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LeftPaneTabs;