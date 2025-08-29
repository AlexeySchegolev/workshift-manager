// Dashboard-Komponenten Export
export { default as StatistikCard } from './StatisticsCard.tsx';
export type { StatistikCardProps } from './StatisticsCard.tsx';

export { default as WochenUebersicht } from './WeekOverview.tsx';
export type { WochenUebersichtProps, WochenTag } from './WeekOverview.tsx';

export { default as SchnellAktionen, createDefaultSchnellAktionen } from './QuickActions.tsx';
export type { SchnellAktionenProps, SchnellAktion } from './QuickActions.tsx';

export { default as StatusAmpel, createShiftPlanningStatusItems } from './StatusLight.tsx';
export type { StatusAmpelProps, StatusItem, StatusLevel } from './StatusLight.tsx';