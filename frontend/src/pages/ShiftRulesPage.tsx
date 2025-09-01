import React, {useState, useEffect} from 'react';
import {
    Box,
    Typography,
    Container,
    Fade,
    useTheme,
    alpha,
    Paper,
    Alert,
    AlertTitle,
} from '@mui/material';
import {
    Rule as RuleIcon,
    Settings as SettingsIcon,
    Security as SecurityIcon,
} from '@mui/icons-material';

import ShiftRuleManager from '../components/ShiftRuleManager';
import { ShiftRulesResponseDto } from '../api/data-contracts';

/**
 * Modern Shift Rules Page in Dashboard Style
 */
const ShiftRulesPage: React.FC = () => {
    const theme = useTheme();

    // Animation control
    const [showCards, setShowCards] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShowCards(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSaveConfiguration = (config: ShiftRulesResponseDto) => {
        // Here the configuration would be saved
        console.log('Schichtregeln-Konfiguration gespeichert:', config);
        // TODO: Integration with Backend/LocalStorage
        alert('Schichtregeln-Konfiguration wurde gespeichert!');
    };

    return (
        <Container maxWidth="xl" sx={{py: 3}}>
            {/* Hero section */}
            <Fade in timeout={800}>
                <Paper
                    elevation={0}
                    sx={{
                        p: {xs: 3, md: 4},
                        mb: 4,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        },
                    }}
                >
                    <Box sx={{position: 'relative', zIndex: 1}}>
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Schichtregeln
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{mb: 2, maxWidth: 600}}
                        >
                            Verwaltung und Übersicht aller Regeln für die Schichtplanung in beiden Praxen
                        </Typography>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <RuleIcon sx={{color: 'primary.main', fontSize: '1.2rem'}}/>
                                <Typography variant="body2" color="text.secondary">
                                    Automatische Regelanwendung
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <SettingsIcon sx={{color: 'info.main', fontSize: '1.2rem'}}/>
                                <Typography variant="body2" color="text.secondary">
                                    Konfigurierbare Parameter
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <SecurityIcon sx={{color: 'success.main', fontSize: '1.2rem'}}/>
                                <Typography variant="body2" color="text.secondary">
                                    Strikte & gelockerte Modi
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Fade>

            {/* Info Alert */}
            <Fade in={showCards} timeout={1000}>
                <Alert
                    severity="info"
                    sx={{
                        mb: 4,
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    }}
                >
                    <AlertTitle>Wichtige Information</AlertTitle>
                    Diese Regeln werden automatisch bei der Schichtplanung angewendet.
                    Bei Konflikten wird zunächst der strikte Modus verwendet, bei Bedarf auf den gelockerten Modus gewechselt.
                </Alert>
            </Fade>

            {/* Shift rules configuration - full width */}
            <Fade in={showCards} timeout={1200}>
                <Paper
                    sx={{
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: 'hidden',
                        mb: 4,
                    }}
                >
                    <ShiftRuleManager onSave={handleSaveConfiguration} />
                </Paper>
            </Fade>
        </Container>
    );
};

export default ShiftRulesPage;