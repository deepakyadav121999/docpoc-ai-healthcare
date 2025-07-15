import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type ReminderOverview = {
  name: string;
  enabledOn: string;
  totalTriggers: number;
  activatedChannel: string;
  status: string;
};
