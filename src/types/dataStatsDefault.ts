// dataStatsDefault.ts
import React from "react";

export interface dataStatsDefault {
  icon: React.ReactNode; // Updated to accept React elements
  color: string;
  title: string;
  value: string;
  growthRate: number;
}
