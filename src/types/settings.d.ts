export interface BranchNotificationSetting {
  id: string;
  branchId: string;
  notificationType: string;
  channelType: "whatsapp" | "sms" | "email";
  isEnabled: boolean;
  config: {
    priority: "high" | "medium" | "low";
    templateId?: string;
    delayMinutes: number;
    retryAttempts: number;
  };
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  branch: {
    id: string;
    name: string | null;
  };
}
