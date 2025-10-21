import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Chip, Typography } from '@mui/material';
import { t } from "../../../translation/translate";

const AttributeModifierDialog = ({ open, onClose, attribute, npc, onUpdate }) => {
    if (!attribute) return null;

    const modifiers = npc.combatStats?.attributeModifiers?.[attribute] || [];

    const handleAddModifier = (value) => {
        const newModifiers = [...modifiers, value];

        const positives = newModifiers.filter(m => m > 0);
        const negatives = newModifiers.filter(m => m < 0);

        while (positives.length > 0 && negatives.length > 0) {
            positives.pop();
            negatives.pop();
        }
        
        const simplified = [...positives, ...negatives];
        onUpdate(attribute, simplified);
    };

    const handleRemoveModifier = (index) => {
        const newModifiers = modifiers.filter((_, i) => i !== index);
        onUpdate(attribute, newModifiers);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ textTransform: 'capitalize' }}>{t("Edit")} {t(attribute)}</DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
                    {t("Base")}: {npc.attributes?.[attribute]}
                </Typography>
                <Box sx={{ my: 2 }}>
                    <Typography variant="h6">{t("Current Modifiers")}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1, p: 1, border: '1px solid #ccc', borderRadius: 1, minHeight: 40 }}>
                        {modifiers.length === 0 && <Typography variant="body2" color="textSecondary">{t("No Modifier")}.</Typography>}
                        {modifiers.map((mod, index) => (
                            <Chip
                                key={index}
                                label={mod > 0 ? `+${mod}` : mod}
                                onDelete={() => handleRemoveModifier(index)}
                                color={mod > 0 ? 'success' : 'error'}
                                variant="outlined"
                            />
                        ))}
                    </Box>
                </Box>
                <Box>
                    <Typography variant="h6">{t("Add Modifier")}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 1, my: 1 }}>
                        <Button size="small" variant="contained" color="success" onClick={() => handleAddModifier(2)}>+2</Button>
                        <Button size="small" variant="contained" color="error" onClick={() => handleAddModifier(-2)}>-2</Button>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t("Close")}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AttributeModifierDialog;
