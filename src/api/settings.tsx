import { dokuGet, dokuPut } from "./doku";
import { BranchNotificationSetting } from "@/types/settings";

export const getBranchNotificationSettings = async (
  branchId: string,
  channelType: "whatsapp" | "sms" | "email",
): Promise<BranchNotificationSetting[]> => {
  return dokuGet(
    `branch-notification-settings/branch/${branchId}?channelType=${channelType}`,
  );
};

export const updateBranchNotificationSetting = async (
  settingId: string,
  payload: Partial<BranchNotificationSetting>,
): Promise<BranchNotificationSetting> => {
  return dokuPut(`branch-notification-settings/${settingId}`, payload);
};
