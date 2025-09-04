import React, {useState, useEffect} from 'react';
import {
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
    Construction as ConstructionIcon,
} from '@mui/icons-material';

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


    return (
        <Container maxWidth="xl" sx={{py: 3}}>
            {/* Feature Unavailable Alert */}
            <Fade in={showCards} timeout={1000}>
                <Alert
                    severity="warning"
                    sx={{
                        mb: 4,
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                    }}
                >
                    <AlertTitle>Feature nicht verfügbar</AlertTitle>
                    Die Schichtregeln-Funktionalität ist derzeit nicht verfügbar, da das entsprechende Backend-Modul
                    noch nicht implementiert wurde.
                </Alert>
            </Fade>

            {/* Feature unavailable content */}
            <Fade in={showCards} timeout={1200}>
                <Paper
                    sx={{
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: 'hidden',
                        mb: 4,
                        p: 4,
                        textAlign: 'center',
                    }}
                >
                    <ConstructionIcon sx={{fontSize: 80, color: 'text.secondary', mb: 2}}/>
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        Feature in Entwicklung
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Die Schichtregeln-Verwaltung wird in einer zukünftigen Version verfügbar sein.
                    </Typography>
                </Paper>
            </Fade>
        </Container>
    );
};

export default ShiftRulesPage;