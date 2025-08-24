import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
  Avatar,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

export interface MitarbeiterAuslastungData {
  id: string;
  name: string;
  role: string;
  location: string;
  geplantStunden: number;
  sollStunden: number;
  maxStunden: number;
}

export interface MitarbeiterAuslastungProps {
  auslastungsDaten: MitarbeiterAuslastungData[];
  title?: string;
  monat: string;
  maxItems?: number;
}

/**
 * Mitarbeiterauslastungs-Komponente für das Dashboard
 */
const MitarbeiterAuslastung: React.FC<MitarbeiterAuslastungProps> = ({
  auslastungsDaten,
  title = 'Mitarbeiterauslastung',
  monat,
  maxItems = 8,
}) => {
  const theme = useTheme();

  // Sortiere nach Auslastung (höchste zuerst)
  const sortierteDaten = [...auslastungsDaten]
    .sort((a, b) => {
      const auslastungA = a.sollStunden > 0 ? (a.geplantStunden / a.sollStunden) * 100 : 0;
      const auslastungB = b.sollStunden > 0 ? (b.geplantStunden / b.sollStunden) * 100 : 0;
      return auslastungB - auslastungA;
    })
    .slice(0, maxItems);

  // Rolle-spezifische Farben
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ShiftLeader': return theme.palette.primary.main;
      case 'Specialist': return theme.palette.success.main;
      case 'Assistant': return theme.palette.info.main;
      default: return theme.palette.grey[500];
    }
  };

  // Avatar-Initialen generieren
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Auslastungsstatus bestimmen
  const getAuslastungsStatus = (geplant: number, soll: number, max: number) => {
    const prozent = soll > 0 ? (geplant / soll) * 100 : 0;
    const maxProzent = max > 0 ? (geplant / max) * 100 : 0;
    
    if (maxProzent > 100) return { status: 'error', label: 'Überlastet', icon: <WarningIcon /> };
    if (prozent >= 100) return { status: 'success', label: 'Optimal', icon: <CheckCircleIcon /> };
    if (prozent >= 80) return { status: 'warning', label: 'Hoch', icon: <TrendingUpIcon /> };
    return { status: 'info', label: 'Niedrig', icon: <TrendingDownIcon /> };
  };

  // Statistiken berechnen
  const gesamtGeplant = auslastungsDaten.reduce((sum, item) => sum + item.geplantStunden, 0);
  const gesamtSoll = auslastungsDaten.reduce((sum, item) => sum + item.sollStunden, 0);
  const durchschnittAuslastung = gesamtSoll > 0 ? Math.round((gesamtGeplant / gesamtSoll) * 100) : 0;
  
  const überlastet = auslastungsDaten.filter(item => 
    item.maxStunden > 0 && item.geplantStunden > item.maxStunden
  ).length;
  
  const unterausgelastet = auslastungsDaten.filter(item => 
    item.sollStunden > 0 && (item.geplantStunden / item.sollStunden) < 0.8
  ).length;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon sx={{ fontSize: '1.25rem', color: 'primary.main' }} />
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          </Box>
        }
        subheader={`${monat} • Ø ${durchschnittAuslastung}% Auslastung`}
        action={
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {überlastet > 0 && (
              <Tooltip title={`${überlastet} überlastete Mitarbeiter`}>
                <Chip
                  label={überlastet}
                  color="error"
                  size="small"
                  icon={<WarningIcon sx={{ fontSize: '0.8rem' }} />}
                  sx={{ fontSize: '0.7rem', height: 24 }}
                />
              </Tooltip>
            )}
            {unterausgelastet > 0 && (
              <Tooltip title={`${unterausgelastet} unterausgelastete Mitarbeiter`}>
                <Chip
                  label={unterausgelastet}
                  color="info"
                  size="small"
                  icon={<TrendingDownIcon sx={{ fontSize: '0.8rem' }} />}
                  sx={{ fontSize: '0.7rem', height: 24 }}
                />
              </Tooltip>
            )}
          </Box>
        }
        sx={{ pb: 1 }}
      />
      
      <CardContent sx={{ pt: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Gesamtübersicht */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Gesamtauslastung
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {gesamtGeplant.toFixed(1)}h / {gesamtSoll.toFixed(1)}h
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(durchschnittAuslastung, 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.grey[500], 0.2),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: 
                  durchschnittAuslastung >= 100 ? theme.palette.success.main :
                  durchschnittAuslastung >= 80 ? theme.palette.warning.main :
                  theme.palette.info.main,
              },
            }}
          />
        </Box>

        {/* Mitarbeiterliste */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Mitarbeiter ({auslastungsDaten.length})
          </Typography>
          
          {sortierteDaten.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                py: 4,
              }}
            >
              <PeopleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body2" color="text.secondary" align="center">
                Keine Auslastungsdaten verfügbar
              </Typography>
            </Box>
          ) : (
            <List sx={{ py: 0 }}>
              {sortierteDaten.map((mitarbeiter, index) => {
                const auslastungProzent = mitarbeiter.sollStunden > 0 
                  ? Math.round((mitarbeiter.geplantStunden / mitarbeiter.sollStunden) * 100) 
                  : 0;
                const maxAuslastungProzent = mitarbeiter.maxStunden > 0 
                  ? Math.round((mitarbeiter.geplantStunden / mitarbeiter.maxStunden) * 100) 
                  : 0;
                
                const status = getAuslastungsStatus(
                  mitarbeiter.geplantStunden, 
                  mitarbeiter.sollStunden, 
                  mitarbeiter.maxStunden
                );
                
                const roleColor = getRoleColor(mitarbeiter.role);
                
                return (
                  <ListItem
                    key={mitarbeiter.id}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor: alpha(roleColor, 0.05),
                      border: `1px solid ${alpha(roleColor, 0.1)}`,
                      '&:hover': {
                        backgroundColor: alpha(roleColor, 0.08),
                        transform: 'translateY(-1px)',
                        boxShadow: theme.shadows[2],
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: roleColor,
                          width: 40,
                          height: 40,
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        {getInitials(mitarbeiter.name)}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                              flex: 1,
                            }}
                          >
                            {mitarbeiter.name}
                          </Typography>
                          <Chip
                            label={`${auslastungProzent}%`}
                            color={status.status as any}
                            size="small"
                            sx={{
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              minWidth: 50,
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip
                              label={mitarbeiter.role}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.7rem',
                                backgroundColor: alpha(roleColor, 0.1),
                                color: roleColor,
                              }}
                            />
                            {mitarbeiter.location === 'Standort B' && (
                              <Chip
                                label="Standort B"
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: '0.7rem',
                                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                                  color: theme.palette.info.main,
                                }}
                              />
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
                              {React.cloneElement(status.icon, { 
                                sx: { fontSize: '0.9rem', color: `${status.status}.main` } 
                              })}
                              <Typography variant="caption" sx={{ color: `${status.status}.main`, fontWeight: 500 }}>
                                {status.label}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              {mitarbeiter.geplantStunden.toFixed(1)}h / {mitarbeiter.sollStunden.toFixed(1)}h geplant
                            </Typography>
                            {maxAuslastungProzent > 100 && (
                              <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 500 }}>
                                {(mitarbeiter.geplantStunden - mitarbeiter.maxStunden).toFixed(1)}h über Limit
                              </Typography>
                            )}
                          </Box>
                          
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(auslastungProzent, 100)}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: alpha(roleColor, 0.2),
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 2,
                                backgroundColor: maxAuslastungProzent > 100 
                                  ? theme.palette.error.main 
                                  : roleColor,
                              },
                            }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>

        {/* Zeige mehr Button */}
        {auslastungsDaten.length > maxItems && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {auslastungsDaten.length - maxItems} weitere Mitarbeiter
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MitarbeiterAuslastung;