"use client";
import React, { useState, useEffect } from "react";
import {
  SubscriptionPlan,
  formatBytes,
  MySubscriptionResponse,
} from "@/api/usage";
import { Button } from "@nextui-org/react";
import axios from "axios";

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
  // const [selectedPlan, setSelectedPlan] = useState<string>("basic");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Determine the current plan name from subscription or default to "basic"
  // const getCurrentPlanName = (): string => {
  //   if (currentSubscription?.plan?.name) {
  //     return currentSubscription.plan.name;
  //   }
  //   return "basic"; // Default fallback
  // };

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

  // Update selected plan when currentSubscription changes
  useEffect(() => {
    // setSelectedPlan(getCurrentPlanName());
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

  const getPriceWithGST = (
    plan: SubscriptionPlan,
    period: BillingPeriod,
  ): {
    basePrice: string; // API price minus 18% GST (base price for display)
    gstAmount: string; // 18% GST amount
    totalPrice: string; // final payable amount (API price with GST already included)
    originalPrice: string; // API price (total with GST)
    discountPercentage?: string;
  } => {
    const apiPriceWithGST = parseFloat(getPrice(plan, period));

    // Calculate base price by removing 18% GST from API price
    // If API price = base + 18% GST, then base = API price / 1.18
    const basePrice = apiPriceWithGST / 1.18;
    const gstAmount = apiPriceWithGST - basePrice;

    // Set discount percentage for UI display only (no actual discount calculation)
    let discountPercentage = undefined as string | undefined;
    if (period === "yearly" && plan.name.toLowerCase() !== "basic") {
      discountPercentage = "20"; // Just for UI badge display
    } else if (period === "quarterly" && plan.name.toLowerCase() === "silver") {
      discountPercentage = "5"; // Just for UI badge display
    }

    return {
      basePrice: Math.round(basePrice).toFixed(0),
      gstAmount: Math.round(gstAmount).toFixed(0),
      totalPrice: Math.round(apiPriceWithGST).toFixed(0), // API price is already the total with GST
      originalPrice: Math.round(apiPriceWithGST).toFixed(0), // API price is the total
      discountPercentage,
    };
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

  // Initialize Razorpay
  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle plan upgrade with Razorpay
  const handleUpgrade = async (planId: string, planName: string) => {
    try {
      setPaymentLoading(planId);
      setError(null);

      // Initialize Razorpay
      const res = await initializeRazorpay();
      if (!res) {
        throw new Error("Razorpay SDK failed to load");
      }

      // Get the selected plan details
      const selectedPlan = plans.find((plan) => plan.id === planId);
      if (!selectedPlan) {
        throw new Error("Plan not found");
      }

      // Get price based on billing period
      const finalAmount = parseFloat(getPrice(selectedPlan, billingPeriod));
      const amountInPaise = Math.round(finalAmount * 100); // Convert to paise

      // Get the correct Razorpay payment button ID based on billing cycle
      const getPaymentButtonId = (cycle: BillingPeriod): string => {
        switch (cycle) {
          case "monthly":
            return "pl_RAowpieJjCG2xk";
          case "quarterly":
            return "pl_RAoyrrg2LYaKNT";
          case "yearly":
            return "pl_RAozl3pAonXnKL";
          default:
            return "pl_RAoyrrg2LYaKNT"; // fallback to quarterly
        }
      };

      const paymentButtonId = getPaymentButtonId(billingPeriod);

      // Get Razorpay payment button details directly
      const paymentButtonResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_RAZORPAY_API_URL}/v1/payment_buttons/${paymentButtonId}/button_details`,
      );

      const paymentButtonData = paymentButtonResponse.data.data;

      // Configure Razorpay options using the payment button data
      const options = {
        key: paymentButtonData.key_id, // Use the key_id from Razorpay API
        amount: amountInPaise,
        currency: "INR",
        name: paymentButtonData.merchant.name || "DocPOC",
        description: `Upgrade to ${selectedPlan.displayName} Plan - ${billingPeriod}`,
        prefill: {
          name: currentSubscription?.user?.name || "",
          email: currentSubscription?.user?.email || "",
        },
        theme: {
          color: paymentButtonData.merchant.brand_color || "#3B82F6",
        },
        modal: {
          ondismiss: function () {
            // Clear loading state immediately when modal is dismissed
            setPaymentLoading(null);
            setError(null);
          },
        },
        handler: async function (response: any) {
          try {
            // Payment successful - you can handle success here
            console.log("Payment successful:", response);
            alert("Payment successful! Your plan has been upgraded.");

            // You can add success handling logic here
            // For now, just reload the page
            window.location.reload();
          } catch (error) {
            console.error("Payment success handling error:", error);
            setError(
              "Payment successful but there was an issue processing your upgrade. Please contact support.",
            );
          } finally {
            setPaymentLoading(null);
          }
        },
        notes: {
          planId: planId,
          billingCycle: billingPeriod,
          planName: planName,
        },
      };

      // Open Razorpay checkout
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      setError(error.message || "Payment failed. Please try again.");
      setPaymentLoading(null);
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "basic":
        return {
          bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
          border: "border-green-200 dark:border-green-700",
          badge: "bg-green-500 text-white",
          button: "bg-green-500 hover:bg-green-600 text-white",
          price: "text-green-600 dark:text-green-400",
          accent: "text-green-600 dark:text-green-400",
        };
      case "silver":
        return {
          bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
          border: "border-purple-200 dark:border-purple-700",
          badge: "bg-purple-500 text-white",
          button: "bg-purple-500 hover:bg-purple-600 text-white",
          price: "text-purple-600 dark:text-purple-400",
          accent: "text-purple-600 dark:text-purple-400",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
          border: "border-blue-200 dark:border-blue-700",
          badge: "bg-blue-500 text-white",
          button: "bg-blue-500 hover:bg-blue-600 text-white",
          price: "text-blue-600 dark:text-blue-400",
          accent: "text-blue-600 dark:text-blue-400",
        };
    }
  };

  const getPlanBadge = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "basic":
        return {
          text: "Free Forever",
          icon: (
            <svg
              className="w-5 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.364 7.636c-1.758-1.757-4.61-1.757-6.364 0l-1 1-1-1c-1.757-1.757-4.61-1.757-6.364 0-1.757 1.757-1.757 4.61 0 6.364 1.754 1.757 4.607 1.757 6.364 0l1-1 1 1c1.754 1.757 4.606 1.757 6.364 0 1.757-1.754 1.757-4.607 0-6.364zM8.05 13.95a2.5 2.5 0 1 1 0-3.536 2.5 2.5 0 0 1 0 3.536zm7.9 0a2.5 2.5 0 1 1 0-3.536 2.5 2.5 0 0 1 0 3.536z" />
            </svg>
          ),
        };
      case "silver":
        return {
          text: "Most Popular",
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ),
        };
      default:
        return { text: "Premium", icon: "👑" };
    }
  };

  // Get plan features with real API values
  const getPlanFeatures = (plan: SubscriptionPlan) => {
    if (plan.name.toLowerCase() === "basic") {
      return [
        {
          title: "Your Personal Command Center",
          subtitle: `(${plan.maxUsers} User Access)`,
          icon: "👤",
        },
        {
          title: "Kickstart Patient Engagement",
          subtitle: `(${plan.whatsappCreditsLimit.toLocaleString()} Onetime WhatsApp Credits)`,
          icon: "💬",
        },
        {
          title: "Streamline Your Schedule",
          subtitle: "(Appointment & Patient Management)",
          icon: "📅",
        },
        {
          title: "Professionalize Your Billing",
          subtitle: "(Instant Digital Invoices)",
          icon: "💰",
        },
        {
          title: "Leverage the Future with Your Co‑pilot",
          subtitle: `(Access to Doku AI Co-pilot ${plan.aiTokensLimit.toLocaleString()} ontime tokens)`,
          icon: "🤖",
        },
        {
          title: "Secure Your Digital Records",
          subtitle: `(${plan.storageLimitBytes === -1 ? "Unlimited" : formatBytes(plan.storageLimitBytes)} of Data Storage)`,
          icon: "🗄️",
        },
        {
          title: "Improve Patient Outcomes",
          subtitle: "(Automated WhatsApp Reminders)",
          icon: "🔔",
        },
        {
          title: "Build Your Brand Identity",
          subtitle: "(Custom Branding on Documents)",
          icon: "🎨",
        },
      ];
    } else if (plan.name.toLowerCase() === "silver") {
      const features = [
        {
          title: "Everything in Basic, plus:",
          subtitle: "",
          icon: "star",
        },
        {
          title: "Collaborate With Your Team",
          subtitle: `(Up to ${plan.maxUsers} User Logins)`,
          icon: "👥",
        },
        {
          title: "Never Worry About Space",
          subtitle: `(${plan.storageLimitBytes === -1 ? "Unlimited" : formatBytes(plan.storageLimitBytes)} Storage)`,
          icon: "☁️",
        },
        {
          title: "Supercharge Patient Communication",
          subtitle: `(${plan.whatsappCreditsLimit.toLocaleString()} Monthly WhatsApp Credits)`,
          icon: "💬",
        },
        {
          title: "Leverage the Future with Your Co‑pilot",
          subtitle: `(Exclusive Access to Doku AI Co-pilot upto ${plan.aiTokensLimit.toLocaleString()} token/month)`,
          icon: "🤖",
        },
        {
          title: "Improve Patient Outcomes",
          subtitle: "(Automated WhatsApp Reminders)",
          icon: "🔔",
        },
        {
          title: "Build Your Brand Identity",
          subtitle: "(Custom Branding on Documents)",
          icon: "🎨",
        },
      ];

      // Add conditional features
      if (plan.features.reports) {
        features.push({
          title: "Gain Deeper Insights",
          subtitle: "(Advanced Digital Reports)",
          icon: "📊",
        });
      }

      if (plan.features.prioritySupport) {
        features.push({
          title: "Priority Customer Support",
          subtitle: "(24/7 Dedicated Support)",
          icon: "🎧",
        });
      }

      return features;
    }

    return [];
  };

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Subscription Plans
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((index) => (
            <div key={index} className="animate-pulse">
              <div className="rounded-2xl border p-6 bg-gray-200 dark:bg-gray-700 h-96"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="inline-flex text-red-400 hover:text-red-600"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
          Choose Your Plan
        </h3>

        {/* Billing Period Toggle */}
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-gray-800 shadow-sm">
          {(["monthly", "quarterly", "yearly"] as BillingPeriod[]).map(
            (period) => (
              <button
                key={period}
                onClick={() => setBillingPeriod(period)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  billingPeriod === period
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-6 w-full max-w-md lg:max-w-lg xl:max-w-xl">
          {plans
            .filter((plan) => {
              // Check if user already has a premium plan (silver or higher)
              const userHasPremium =
                currentSubscription?.plan?.name &&
                currentSubscription.plan.name.toLowerCase() !== "basic";

              // If user has premium, only show basic plan and their current plan
              if (userHasPremium) {
                return (
                  plan.name.toLowerCase() === "basic" ||
                  plan.name.toLowerCase() ===
                    currentSubscription?.plan?.name?.toLowerCase()
                );
              }

              // For basic users, hide the basic plan and only show premium plans
              return plan.name.toLowerCase() !== "basic";
            })
            .map((plan) => {
              // const isSelected = selectedPlan === plan.name;
              const isCurrentPlan =
                currentSubscription?.plan?.name === plan.name;
              const price = getPrice(plan, billingPeriod);
              const priceWithGST = getPriceWithGST(plan, billingPeriod);
              const colors = getPlanColor(plan.name);
              const badge = getPlanBadge(plan.name);
              const features = getPlanFeatures(plan);
              const isPaymentLoading = paymentLoading === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-xl border-2 p-3 transition-all cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
                    colors.bg
                  } ${colors.border}`}
                  // onClick={() => setSelectedPlan(plan.name)}
                >
                  {/* Top Badge */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div
                      className={`px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-full text-xs font-bold ${colors.badge} flex items-center gap-1`}
                    >
                      <span>{badge.icon}</span>
                      <span>{badge.text}</span>
                    </div>
                  </div>

                  {/* Plan Header */}
                  <div className="text-center mb-4 mt-3 ">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.displayName}
                    </h4>

                    {/* Price */}
                    <div className="mb-2">
                      {plan.name.toLowerCase() === "basic" ? (
                        <div className="flex items-baseline justify-center">
                          <span
                            className={`text-3xl font-bold ${colors.price}`}
                          >
                            ₹{price}
                          </span>
                          <span className="text-base text-gray-500 dark:text-gray-400 ml-1">
                            {getPeriodLabel(billingPeriod)}
                          </span>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="flex items-baseline justify-center mb-1">
                            <span
                              className={`text-3xl font-bold ${colors.price}`}
                            >
                              ₹{priceWithGST.basePrice}
                            </span>
                          </div>
                          <div className="text-base text-gray-500 dark:text-gray-400 mb-1">
                            {billingPeriod === "quarterly"
                              ? "per quarter"
                              : billingPeriod === "yearly"
                                ? "per year"
                                : "per month"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Total (incl. 18% GST): ₹{priceWithGST.originalPrice}
                          </div>
                        </div>
                      )}
                      {billingPeriod === "quarterly" &&
                        plan.name.toLowerCase() === "silver" && (
                          <div className="text-sm text-gray-500 mt-1">
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                              Save 5%
                            </span>
                          </div>
                        )}
                      {billingPeriod === "yearly" &&
                        plan.name.toLowerCase() !== "basic" && (
                          <div className="text-sm text-gray-500 mt-1">
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                              Save 20%
                            </span>
                          </div>
                        )}
                    </div>

                    {isCurrentPlan && (
                      <div className="mt-2">
                        <span className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                          Current Plan
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 mb-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="flex items-center justify-center flex-shrink-0 mt-0.5">
                          {feature.icon === "star" ? (
                            <svg
                              className="w-5 h-5 text-yellow-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-4 text-green-500"
                              fill="currentColor"
                              viewBox="0 0 17 17"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm leading-tight">
                            {feature.title}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-0.5 leading-tight">
                            {feature.subtitle}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button
                    className={`w-full py-2 text-sm font-semibold rounded-xl transition-all transform hover:scale-105 ${
                      isCurrentPlan
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                        : plan.name.toLowerCase() === "basic"
                          ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                          : plan.name.toLowerCase() === "silver"
                            ? "bg-purple-500 hover:bg-purple-600 text-white shadow-lg"
                            : colors.button
                    } ${isCurrentPlan ? "" : "shadow-lg hover:shadow-xl"}`}
                    disabled={isCurrentPlan || isPaymentLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isCurrentPlan && !isPaymentLoading) {
                        handleUpgrade(plan.id, plan.name);
                      }
                    }}
                  >
                    {isPaymentLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : plan.name.toLowerCase() === "basic" ? (
                      "💚 Launch Your Free Clinic"
                    ) : plan.name.toLowerCase() === "silver" ? (
                      "→ Continue"
                    ) : (
                      "→ Continue"
                    )}
                  </Button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
