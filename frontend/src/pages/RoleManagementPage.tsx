import React, {useState, useEffect} from 'react';
import {
    Container,
    Fade,
    useTheme,
    Paper,
} from '@mui/material';
import RoleManagement from '../components/role/RoleManagement';

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