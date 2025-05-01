export const SETTINGS_CONFIG = {
    autoUseMP: {
      key: "combatSimAutoUseMP",
      defaultValue: true,
    },
    autoOpenLogs: {
      key: "combatSimAutoOpenLogs",
      defaultValue: true,
    },
    useDragAndDrop: {
      key: "combatSimUseDragAndDrop",
      defaultValue: true,
    },
    autosaveEnabled: {
      key: "combatSimAutosave",
      defaultValue: false,
    },
    autosaveInterval: {
      key: "combatSimAutosaveInterval",
      defaultValue: 30,
    },
    showSaveSnackbar: {
      key: "combatSimShowSaveSnackbar",
      defaultValue: true,
    },
    hideLogs: {
      key: "combatSimHideLogs",
      defaultValue: false,
    },
    showBaseAttackEffect: {
      key: "combatSimShowBaseAttackEffect",
      defaultValue: true,
    },
    showWeaponAttackEffect: {
      key: "combatSimShowWeaponAttackEffect",
      defaultValue: true,
    },
    showSpellEffect: {
      key: "combatSimShowSpellEffect",
      defaultValue: true,
    },
    autoCheckTurnAfterRoll: {
      key: "combatSimAutoCheckTurnAfterRoll",
      defaultValue: false,
    },
    askBeforeRemove: {
      key: "combatSimAskBeforeRemove",
      defaultValue: true,
    },
    autoRemoveNPCFaint: {
      key: "combatSimAutoRemoveNPCFaint",
      defaultValue: false,
    },
    autoRollSpellOneTarget: {
      key: "combatSimAutoRollSpellOneTarget",
      defaultValue: false,
    },
  };
  
  // Helper function to get default settings
  export const getDefaultSettings = () => {
    const defaultSettings = {};
    Object.entries(SETTINGS_CONFIG).forEach(([settingName, config]) => {
      defaultSettings[settingName] = config.defaultValue;
    });
    return defaultSettings;
  };