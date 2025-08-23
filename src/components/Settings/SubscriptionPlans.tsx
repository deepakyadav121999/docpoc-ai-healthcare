"use client";
import React, { useState, useEffect } from "react";
import {
  SubscriptionPlan,
  formatBytes,
  MySubscriptionResponse,
} from "@/api/usage";
import { Button } from "@nextui-org/react";

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  loading?: boolean;
  currentSubscription?: MySubscriptionResponse | null;
}

type BillingPeriod = "monthly" | "quarterly" | "yearly";

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  plans,
  loading = false,
  currentSubscription,
}) => {
  // Determine the current plan name from subscription or default to "basic"
  const getCurrentPlanName = (): string => {
    if (currentSubscription?.plan?.name) {
      return currentSubscription.plan.name;
    }
    return "basic"; // Default fallback
  };

  // Get billing period from current subscription or default to monthly
  const getCurrentBillingPeriod = (): BillingPeriod => {
    if (currentSubscription?.subscription?.billingCycle) {
      const cycle = currentSubscription.subscription.billingCycle;
      if (cycle === "quarterly" || cycle === "yearly") {
        return cycle as BillingPeriod;
      }
    }
    return "monthly"; // Default fallback
  };

  const [selectedPlan, setSelectedPlan] =
    useState<string>(getCurrentPlanName());
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(
    getCurrentBillingPeriod(),
  );

  // Update selected plan when currentSubscription changes
  useEffect(() => {
    setSelectedPlan(getCurrentPlanName());
    setBillingPeriod(getCurrentBillingPeriod());
  }, [currentSubscription]);

  const getPrice = (plan: SubscriptionPlan, period: BillingPeriod): string => {
    switch (period) {
      case "monthly":
        return plan.monthlyPrice;
      case "quarterly":
        return plan.quarterlyPrice;
      case "yearly":
        return plan.yearlyPrice;
      default:
        return plan.monthlyPrice;
    }
  };

  const getPeriodLabel = (period: BillingPeriod): string => {
    switch (period) {
      case "monthly":
        return "/month";
      case "quarterly":
        return "/quarter";
      case "yearly":
        return "/year";
      default:
        return "/month";
    }
  };

  const handleUpgrade = (planId: string) => {
    // TODO: Implement upgrade logic
    console.log("Upgrading to plan:", planId);
  };

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Subscription Plans
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((index) => (
            <div key={index} className="animate-pulse">
              <div className="rounded-lg border p-6 bg-gray-200 dark:bg-gray-700 h-96"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
          Subscription Plans
        </h3>

        {/* Billing Period Toggle */}
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800">
          {(["monthly", "quarterly", "yearly"] as BillingPeriod[]).map(
            (period) => (
              <button
                key={period}
                onClick={() => setBillingPeriod(period)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  billingPeriod === period
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.name;
          const isCurrentPlan = currentSubscription?.plan?.name === plan.name;
          const price = getPrice(plan, billingPeriod);

          return (
            <div
              key={plan.id}
              className={`relative rounded-lg border-2 p-6 transition-all cursor-pointer ${
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              onClick={() => setSelectedPlan(plan.name)}
            >
              {/* Plan Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {plan.displayName}
                  </h4>
                  {isCurrentPlan && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ₹{price}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    {getPeriodLabel(billingPeriod)}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Max Users:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {plan.maxUsers}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    AI Tokens:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {plan.aiTokensLimit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    WhatsApp Credits:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {plan.whatsappCreditsLimit}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Storage:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatBytes(plan.storageLimitBytes)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Priority Support:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {plan.features.prioritySupport ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Reports:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {plan.features.reports ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Analytics:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {plan.features.analytics ? "✓" : "✗"}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                className={`w-full ${
                  isCurrentPlan
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                    : isSelected
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
                disabled={isCurrentPlan}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isCurrentPlan) handleUpgrade(plan.id);
                }}
              >
                {isCurrentPlan
                  ? "Current Plan"
                  : isSelected
                    ? "Upgrade Now"
                    : "Select Plan"}
              </Button>

              {/* Selection Radio */}
              <div className="absolute top-4 right-4">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    isSelected
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
