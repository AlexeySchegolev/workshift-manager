// Dashboard-Komponenten Export
export { default as StatistikCard } from './StatistikCard';
export type { StatistikCardProps } from './StatistikCard';

export { default as WochenUebersicht } from './WochenUebersicht';
export type { WochenUebersichtProps, WochenTag } from './WochenUebersicht';

export { default as SchnellAktionen, createDefaultSchnellAktionen } from './SchnellAktionen';
export type { SchnellAktionenProps, SchnellAktion } from './SchnellAktionen';

export { default as StatusAmpel, createShiftPlanningStatusItems } from './StatusAmpel';
export type { StatusAmpelProps, StatusItem, StatusLevel } from './StatusAmpel';