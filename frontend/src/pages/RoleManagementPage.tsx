import React, {useState, useEffect} from 'react';
import {
    Box,
    Typography,
    Container,
    Fade,
    useTheme,
    alpha,
    Paper,
} from '@mui/material';
import {
    AdminPanelSettings as AdminPanelSettingsIcon,
    Security as SecurityIcon,
    Group as GroupIcon
} from '@mui/icons-material';
import RoleManagement from '../components/RoleManagement';

/**
 * Modern Role Management Page in Dashboard Style
 */
const RoleManagementPage: React.FC = () => {
    const theme = useTheme();

    // Animation control
    const [showCards, setShowCards] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShowCards(true), 100);
        return () => clearTimeout(timer);
    }, []);

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
                            Rollenverwaltung
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{mb: 2, maxWidth: 600}}
                        >
                            Verwalten Sie die Rollen und Berechtigungen für Ihr Schichtplanungssystem
                        </Typography>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <AdminPanelSettingsIcon sx={{color: 'primary.main', fontSize: '1.2rem'}}/>
                                <Typography variant="body2" color="text.secondary">
                                    Berechtigungen verwalten
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <SecurityIcon sx={{color: 'info.main', fontSize: '1.2rem'}}/>
                                <Typography variant="body2" color="text.secondary">
                                    Sicherheitsrichtlinien
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <GroupIcon sx={{color: 'success.main', fontSize: '1.2rem'}}/>
                                <Typography variant="body2" color="text.secondary">
                                    Rollendefinitionen
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Fade>

            {/* Role management - full width */}
            <Fade in={showCards} timeout={1200}>
                <Paper
                    sx={{
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: 'hidden',
                        mb: 4,
                    }}
                >
                    <RoleManagement />
                </Paper>
            </Fade>
        </Container>
    );
};

export default RoleManagementPage;