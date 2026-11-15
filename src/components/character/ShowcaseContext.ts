import { createContext, useContext } from 'react';

export interface ShowcaseState {
  turnAngle: number;
  setTurnAngle: (deg: number) => void;
  runwayActive: boolean;
}

export const ShowcaseContext = createContext<ShowcaseState | null>(null);

export function useShowcaseContext(): ShowcaseState | null {
  return useContext(ShowcaseContext);
}
