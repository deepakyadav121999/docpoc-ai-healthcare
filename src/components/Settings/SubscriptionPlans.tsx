// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   SubscriptionPlan,
//   formatBytes,
//   MySubscriptionResponse,
// } from "@/api/usage";
// import { Button } from "@nextui-org/react";

// interface SubscriptionPlansProps {
//   plans: SubscriptionPlan[];
//   loading?: boolean;
//   currentSubscription?: MySubscriptionResponse | null;
// }

// type BillingPeriod = "monthly" | "quarterly" | "yearly";

// const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
//   plans,
//   loading = false,
//   currentSubscription,
// }) => {
//   // Determine the current plan name from subscription or default to "basic"
//   const getCurrentPlanName = (): string => {
//     if (currentSubscription?.plan?.name) {
//       return currentSubscription.plan.name;
//     }
//     return "basic"; // Default fallback
//   };

//   // Get billing period from current subscription or default to monthly
//   const getCurrentBillingPeriod = (): BillingPeriod => {
//     if (currentSubscription?.subscription?.billingCycle) {
//       const cycle = currentSubscription.subscription.billingCycle;
//       if (cycle === "quarterly" || cycle === "yearly") {
//         return cycle as BillingPeriod;
//       }
//     }
//     return "monthly"; // Default fallback
//   };

//   const [selectedPlan, setSelectedPlan] =
//     useState<string>(getCurrentPlanName());
//   const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(
//     getCurrentBillingPeriod(),
//   );

//   // Update selected plan when currentSubscription changes
//   useEffect(() => {
//     setSelectedPlan(getCurrentPlanName());
//     setBillingPeriod(getCurrentBillingPeriod());
//   }, [currentSubscription]);

//   const getPrice = (plan: SubscriptionPlan, period: BillingPeriod): string => {
//     switch (period) {
//       case "monthly":
//         return plan.monthlyPrice;
//       case "quarterly":
//         return plan.quarterlyPrice;
//       case "yearly":
//         return plan.yearlyPrice;
//       default:
//         return plan.monthlyPrice;
//     }
//   };

//   const getPeriodLabel = (period: BillingPeriod): string => {
//     switch (period) {
//       case "monthly":
//         return "/month";
//       case "quarterly":
//         return "/quarter";
//       case "yearly":
//         return "/year";
//       default:
//         return "/month";
//     }
//   };

//   const handleUpgrade = (planId: string) => {
//     // TODO: Implement upgrade logic
//     console.log("Upgrading to plan:", planId);
//   };

//   if (loading) {
//     return (
//       <div className="mt-8">
//         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//           Subscription Plans
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {[1, 2].map((index) => (
//             <div key={index} className="animate-pulse">
//               <div className="rounded-lg border p-6 bg-gray-200 dark:bg-gray-700 h-96"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-8">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
//           Subscription Plans
//         </h3>

//         {/* Billing Period Toggle */}
//         <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800">
//           {(["monthly", "quarterly", "yearly"] as BillingPeriod[]).map(
//             (period) => (
//               <button
//                 key={period}
//                 onClick={() => setBillingPeriod(period)}
//                 className={`px-3 py-1 text-xs rounded-md transition-colors ${
//                   billingPeriod === period
//                     ? "bg-blue-500 text-white"
//                     : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 }`}
//               >
//                 {period.charAt(0).toUpperCase() + period.slice(1)}
//               </button>
//             ),
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {plans.map((plan) => {
//           const isSelected = selectedPlan === plan.name;
//           const isCurrentPlan = currentSubscription?.plan?.name === plan.name;
//           const price = getPrice(plan, billingPeriod);

//           return (
//             <div
//               key={plan.id}
//               className={`relative rounded-lg border-2 p-6 transition-all cursor-pointer ${
//                 isSelected
//                   ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
//                   : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
//               }`}
//               onClick={() => setSelectedPlan(plan.name)}
//             >
//               {/* Plan Header */}
//               <div className="mb-4">
//                 <div className="flex items-center justify-between">
//                   <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
//                     {plan.displayName}
//                   </h4>
//                   {isCurrentPlan && (
//                     <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
//                       Current
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                   {plan.description}
//                 </p>
//               </div>

//               {/* Price */}
//               <div className="mb-6">
//                 <div className="flex items-baseline">
//                   <span className="text-3xl font-bold text-gray-900 dark:text-white">
//                     ₹{price}
//                   </span>
//                   <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
//                     {getPeriodLabel(billingPeriod)}
//                   </span>
//                 </div>
//               </div>

//               {/* Features */}
//               <div className="space-y-3 mb-6">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600 dark:text-gray-400">
//                     Max Users:
//                   </span>
//                   <span className="font-medium text-gray-900 dark:text-white">
//                     {plan.maxUsers}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600 dark:text-gray-400">
//                     AI Tokens:
//                   </span>
//                   <span className="font-medium text-gray-900 dark:text-white">
//                     {plan.aiTokensLimit.toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600 dark:text-gray-400">
//                     WhatsApp Credits:
//                   </span>
//                   <span className="font-medium text-gray-900 dark:text-white">
//                     {plan.whatsappCreditsLimit}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600 dark:text-gray-400">
//                     Storage:
//                   </span>
//                   <span className="font-medium text-gray-900 dark:text-white">
//                     {formatBytes(plan.storageLimitBytes)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600 dark:text-gray-400">
//                     Priority Support:
//                   </span>
//                   <span className="font-medium text-gray-900 dark:text-white">
//                     {plan.features.prioritySupport ? "✓" : "✗"}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600 dark:text-gray-400">
//                     Reports:
//                   </span>
//                   <span className="font-medium text-gray-900 dark:text-white">
//                     {plan.features.reports ? "✓" : "✗"}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600 dark:text-gray-400">
//                     Analytics:
//                   </span>
//                   <span className="font-medium text-gray-900 dark:text-white">
//                     {plan.features.analytics ? "✓" : "✗"}
//                   </span>
//                 </div>
//               </div>

//               {/* Action Button */}
//               <Button
//                 className={`w-full ${
//                   isCurrentPlan
//                     ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
//                     : isSelected
//                       ? "bg-blue-500 text-white hover:bg-blue-600"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
//                 }`}
//                 disabled={isCurrentPlan}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (!isCurrentPlan) handleUpgrade(plan.id);
//                 }}
//               >
//                 {isCurrentPlan
//                   ? "Current Plan"
//                   : isSelected
//                     ? "Upgrade Now"
//                     : "Select Plan"}
//               </Button>

//               {/* Selection Radio */}
//               <div className="absolute top-4 right-4">
//                 <div
//                   className={`w-4 h-4 rounded-full border-2 ${
//                     isSelected
//                       ? "border-blue-500 bg-blue-500"
//                       : "border-gray-300 dark:border-gray-600"
//                   }`}
//                 >
//                   {isSelected && (
//                     <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default SubscriptionPlans;
// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   SubscriptionPlan,
//   formatBytes,
//   MySubscriptionResponse,
// } from "@/api/usage";
// import { Button } from "@nextui-org/react";

// interface SubscriptionPlansProps {
//   plans: SubscriptionPlan[];
//   loading?: boolean;
//   currentSubscription?: MySubscriptionResponse | null;
// }

// type BillingPeriod = "monthly" | "quarterly" | "yearly";

// const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
//   plans,
//   loading = false,
//   currentSubscription,
// }) => {
//   // Determine the current plan name from subscription or default to "basic"
//   const getCurrentPlanName = (): string => {
//     if (currentSubscription?.plan?.name) {
//       return currentSubscription.plan.name;
//     }
//     return "basic"; // Default fallback
//   };

//   // Get billing period from current subscription or default to monthly
//   const getCurrentBillingPeriod = (): BillingPeriod => {
//     if (currentSubscription?.subscription?.billingCycle) {
//       const cycle = currentSubscription.subscription.billingCycle;
//       if (cycle === "quarterly" || cycle === "yearly") {
//         return cycle as BillingPeriod;
//       }
//     }
//     return "monthly"; // Default fallback
//   };

//   const [selectedPlan, setSelectedPlan] =
//     useState<string>(getCurrentPlanName());
//   const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(
//     getCurrentBillingPeriod(),
//   );

//   // Update selected plan when currentSubscription changes
//   useEffect(() => {
//     setSelectedPlan(getCurrentPlanName());
//     setBillingPeriod(getCurrentBillingPeriod());
//   }, [currentSubscription]);

//   const getPrice = (plan: SubscriptionPlan, period: BillingPeriod): string => {
//     switch (period) {
//       case "monthly":
//         return plan.monthlyPrice;
//       case "quarterly":
//         return plan.quarterlyPrice;
//       case "yearly":
//         return plan.yearlyPrice;
//       default:
//         return plan.monthlyPrice;
//     }
//   };

//   const getPeriodLabel = (period: BillingPeriod): string => {
//     switch (period) {
//       case "monthly":
//         return "/month";
//       case "quarterly":
//         return "/quarter";
//       case "yearly":
//         return "/year";
//       default:
//         return "/month";
//     }
//   };

//   const handleUpgrade = (planId: string) => {
//     // TODO: Implement upgrade logic
//     console.log("Upgrading to plan:", planId);
//   };

//   const getPlanColor = (planName: string) => {
//     switch (planName.toLowerCase()) {
//       case "basic":
//         return {
//           bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
//           border: "border-green-200 dark:border-green-700",
//           badge: "bg-green-500 text-white",
//           button: "bg-green-500 hover:bg-green-600 text-white",
//           price: "text-green-600 dark:text-green-400",
//           accent: "text-green-600 dark:text-green-400"
//         };
//       case "silver":
//         return {
//           bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
//           border: "border-purple-200 dark:border-purple-700",
//           badge: "bg-purple-500 text-white",
//           button: "bg-purple-500 hover:bg-purple-600 text-white",
//           price: "text-purple-600 dark:text-purple-400",
//           accent: "text-purple-600 dark:text-purple-400"
//         };
//       default:
//         return {
//           bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
//           border: "border-blue-200 dark:border-blue-700",
//           badge: "bg-blue-500 text-white",
//           button: "bg-blue-500 hover:bg-blue-600 text-white",
//           price: "text-blue-600 dark:text-blue-400",
//           accent: "text-blue-600 dark:text-blue-400"
//         };
//     }
//   };

//   const getPlanBadge = (planName: string) => {
//     switch (planName.toLowerCase()) {
//       case "basic":
//         return { text: "Free Forever", icon: "∞" };
//       case "silver":
//         return { text: "Most Popular", icon: "⭐" };
//       default:
//         return { text: "Premium", icon: "👑" };
//     }
//   };

//   if (loading) {
//     return (
//       <div className="mt-8">
//         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//           Subscription Plans
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {[1, 2].map((index) => (
//             <div key={index} className="animate-pulse">
//               <div className="rounded-2xl border p-6 bg-gray-200 dark:bg-gray-700 h-96"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-8">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
//           Choose Your Plan
//         </h3>

//         {/* Billing Period Toggle */}
//         <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-gray-800 shadow-sm">
//           {(["monthly", "quarterly", "yearly"] as BillingPeriod[]).map(
//             (period) => (
//               <button
//                 key={period}
//                 onClick={() => setBillingPeriod(period)}
//                 className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
//                   billingPeriod === period
//                     ? "bg-blue-500 text-white shadow-sm"
//                     : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
//                 }`}
//               >
//                 {period.charAt(0).toUpperCase() + period.slice(1)}
//               </button>
//             ),
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {plans.map((plan) => {
//           const isSelected = selectedPlan === plan.name;
//           const isCurrentPlan = currentSubscription?.plan?.name === plan.name;
//           const price = getPrice(plan, billingPeriod);
//           const colors = getPlanColor(plan.name);
//           const badge = getPlanBadge(plan.name);

//           return (
//             <div
//               key={plan.id}
//               className={`relative rounded-2xl border-2 p-6 transition-all cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
//                 colors.bg
//               } ${
//                 isSelected
//                   ? `${colors.border} ring-2 ring-offset-2 ring-blue-500`
//                   : colors.border
//               }`}
//               onClick={() => setSelectedPlan(plan.name)}
//             >
//               {/* Top Badge */}
//               <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                 <div className={`px-4 py-1 rounded-full text-xs font-bold ${colors.badge} flex items-center gap-1`}>
//                   <span>{badge.icon}</span>
//                   <span>{badge.text}</span>
//                 </div>
//               </div>

//               {/* Plan Header */}
//               <div className="text-center mb-6 mt-4">
//                 <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//                   {plan.displayName}
//                 </h4>

//                 {/* Price */}
//                 <div className="mb-3">
//                   <div className="flex items-baseline justify-center">
//                     <span className={`text-4xl font-bold ${colors.price}`}>
//                       ₹{price}
//                     </span>
//                     <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">
//                       {getPeriodLabel(billingPeriod)}
//                     </span>
//                   </div>
//                   {billingPeriod === "quarterly" && plan.name.toLowerCase() === "silver" && (
//                     <div className="text-sm text-gray-500 mt-1">
//                       <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
//                         Save 6%
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
//                   {plan.description}
//                 </p>

//                 {isCurrentPlan && (
//                   <div className="mt-3">
//                     <span className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
//                       Current Plan
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* Features List */}
//               <div className="space-y-3 mb-6">
//                 {plan.name.toLowerCase() === "silver" && (
//                   <div className={`text-sm font-semibold ${colors.accent} mb-3 flex items-center`}>
//                     ⭐ Everything in Basic, plus:
//                   </div>
//                 )}

//                 <div className="space-y-3">
//                   {plan.name.toLowerCase() === "basic" ? (
//                     <>
//                       <div className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-900 dark:text-white">
//                             Your Personal Command Center
//                           </div>
//                           <div className="text-sm text-gray-600 dark:text-gray-400">
//                             (2 User Access)
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-900 dark:text-white">
//                             Kickstart Patient Engagement
//                           </div>
//                           <div className="text-sm text-gray-600 dark:text-gray-400">
//                             (100 Onetime WhatsApp Credits)
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-900 dark:text-white">
//                             Streamline Your Schedule
//                           </div>
//                           <div className="text-sm text-gray-600 dark:text-gray-400">
//                             (Appointment & Patient Management)
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-900 dark:text-white">
//                             Professionalize Your Billing
//                           </div>
//                           <div className="text-sm text-gray-600 dark:text-gray-400">
//                             (Instant Digital Invoices)
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-900 dark:text-white">
//                             Leverage the Future with Your Co‑pilot
//                           </div>
//                           <div className="text-sm text-gray-600 dark:text-gray-400">
//                             (Access to Doku AI Co-pilot 10000 onetime tokens)
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-900 dark:text-white">
//                             Secure Your Digital Records
//                           </div>
//                           <div className="text-sm text-gray-600 dark:text-gray-400">
//                             (25 GB of Data Storage)
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-900 dark:text-white">
//                             Improve Patient Outcomes
//                           </div>
//                           <div className="text-sm text-gray-600 dark:text-gray-400">
//                             (Automated WhatsApp Reminders)
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-900 dark:text-white">
//                             Build Your Brand Identity
//                           </div>
//                           <div className="text-sm text-gray-600 dark:text-gray-400">
//                             (Custom Branding on Documents)
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       <div className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-900 dark:text-white">
//                             Collaborate With Your Team
//                           </div>
//                           <div className="text-sm text-gray-600 dark:text-gray-400">
//                             (Up to {plan.maxUsers} User Logins)
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-900 dark:text-white">
//                             Never Worry About Space
//                           </div>
//                           <div className="text-sm text-gray-600 dark:text-gray-400">
//                             (Unlimited Storage)
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-900 dark:text-white">
//                             Supercharge Patient Communication
//                           </div>
//                           <div className="text-sm text-gray-600 dark:text-gray-400">
//                             ({plan.whatsappCreditsLimit} Monthly WhatsApp Credits)
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   {plan.name.toLowerCase() === "silver" && (
//                     <>
//                       <div className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-900 dark:text-white">
//                             Leverage the Future with Your Co-pilot
//                           </div>
//                           <div className="text-sm text-gray-600 dark:text-gray-400">
//                             (Exclusive Access to Doku AI Co-pilot upto {(plan.aiTokensLimit / 10000).toFixed(0)} Lakh token/month)
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-900 dark:text-white">
//                             Gain Deeper Insights
//                           </div>
//                           <div className="text-sm text-gray-600 dark:text-gray-400">
//                             (Advanced Digital Reports)
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-900 dark:text-white">
//                             Priority Customer Support
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>

//               {/* Action Button */}
//               <Button
//                 className={`w-full py-3 text-base font-semibold rounded-xl transition-all transform hover:scale-105 ${
//                   isCurrentPlan
//                     ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
//                     : plan.name.toLowerCase() === "basic"
//                       ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
//                       : plan.name.toLowerCase() === "silver"
//                         ? "bg-purple-500 hover:bg-purple-600 text-white shadow-lg"
//                         : colors.button
//                 } ${isCurrentPlan ? "" : "shadow-lg hover:shadow-xl"}`}
//                 disabled={isCurrentPlan}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (!isCurrentPlan) handleUpgrade(plan.id);
//                 }}
//               >
//                 {isCurrentPlan
//                   ? "Current Plan"
//                   : plan.name.toLowerCase() === "basic"
//                     ? "💚 Launch Your Free Clinic"
//                     : plan.name.toLowerCase() === "silver"
//                       ? "⚡ Coming soon..."
//                       : "Upgrade Now"}
//               </Button>

//               {/* Selection Radio */}
//               <div className="absolute top-6 right-6">
//                 <div
//                   className={`w-5 h-5 rounded-full border-2 transition-all ${
//                     isSelected
//                       ? "border-blue-500 bg-blue-500 shadow-lg"
//                       : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
//                   }`}
//                 >
//                   {isSelected && (
//                     <div className="w-3 h-3 bg-white rounded-full m-0.5"></div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default SubscriptionPlans;

// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   SubscriptionPlan,
//   formatBytes,
//   MySubscriptionResponse,
// } from "@/api/usage";
// import { Button } from "@nextui-org/react";

// interface SubscriptionPlansProps {
//   plans: SubscriptionPlan[];
//   loading?: boolean;
//   currentSubscription?: MySubscriptionResponse | null;
// }

// type BillingPeriod = "monthly" | "quarterly" | "yearly";

// const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
//   plans,
//   loading = false,
//   currentSubscription,
// }) => {
//   // Determine the current plan name from subscription or default to "basic"
//   const getCurrentPlanName = (): string => {
//     if (currentSubscription?.plan?.name) {
//       return currentSubscription.plan.name;
//     }
//     return "basic"; // Default fallback
//   };

//   // Get billing period from current subscription or default to monthly
//   const getCurrentBillingPeriod = (): BillingPeriod => {
//     if (currentSubscription?.subscription?.billingCycle) {
//       const cycle = currentSubscription.subscription.billingCycle;
//       if (cycle === "quarterly" || cycle === "yearly") {
//         return cycle as BillingPeriod;
//       }
//     }
//     return "monthly"; // Default fallback
//   };

//   const [selectedPlan, setSelectedPlan] =
//     useState<string>(getCurrentPlanName());
//   const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(
//     getCurrentBillingPeriod(),
//   );

//   // Update selected plan when currentSubscription changes
//   useEffect(() => {
//     setSelectedPlan(getCurrentPlanName());
//     setBillingPeriod(getCurrentBillingPeriod());
//   }, [currentSubscription]);

//   const getPrice = (plan: SubscriptionPlan, period: BillingPeriod): string => {
//     switch (period) {
//       case "monthly":
//         return plan.monthlyPrice;
//       case "quarterly":
//         return plan.quarterlyPrice;
//       case "yearly":
//         return plan.yearlyPrice;
//       default:
//         return plan.monthlyPrice;
//     }
//   };

//   const getPeriodLabel = (period: BillingPeriod): string => {
//     switch (period) {
//       case "monthly":
//         return "/month";
//       case "quarterly":
//         return "/quarter";
//       case "yearly":
//         return "/year";
//       default:
//         return "/month";
//     }
//   };

//   const handleUpgrade = (planId: string) => {
//     // TODO: Implement upgrade logic
//     console.log("Upgrading to plan:", planId);
//   };

//   const getPlanColor = (planName: string) => {
//     switch (planName.toLowerCase()) {
//       case "basic":
//         return {
//           bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
//           border: "border-green-200 dark:border-green-700",
//           badge: "bg-green-500 text-white",
//           button: "bg-green-500 hover:bg-green-600 text-white",
//           price: "text-green-600 dark:text-green-400",
//           accent: "text-green-600 dark:text-green-400"
//         };
//       case "silver":
//         return {
//           bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
//           border: "border-purple-200 dark:border-purple-700",
//           badge: "bg-purple-500 text-white",
//           button: "bg-purple-500 hover:bg-purple-600 text-white",
//           price: "text-purple-600 dark:text-purple-400",
//           accent: "text-purple-600 dark:text-purple-400"
//         };
//       default:
//         return {
//           bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
//           border: "border-blue-200 dark:border-blue-700",
//           badge: "bg-blue-500 text-white",
//           button: "bg-blue-500 hover:bg-blue-600 text-white",
//           price: "text-blue-600 dark:text-blue-400",
//           accent: "text-blue-600 dark:text-blue-400"
//         };
//     }
//   };

//   const getPlanBadge = (planName: string) => {
//     switch (planName.toLowerCase()) {
//       case "basic":
//         return { text: "Free Forever", icon: "∞" };
//       case "silver":
//         return { text: "Most Popular", icon: "⭐" };
//       default:
//         return { text: "Premium", icon: "👑" };
//     }
//   };

//   if (loading) {
//     return (
//       <div className="mt-8">
//         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//           Subscription Plans
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {[1, 2].map((index) => (
//             <div key={index} className="animate-pulse">
//               <div className="rounded-2xl border p-6 bg-gray-200 dark:bg-gray-700 h-96"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-8">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
//           Choose Your Plan
//         </h3>

//         {/* Billing Period Toggle */}
//         <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-gray-800 shadow-sm">
//           {(["monthly", "quarterly", "yearly"] as BillingPeriod[]).map(
//             (period) => (
//               <button
//                 key={period}
//                 onClick={() => setBillingPeriod(period)}
//                 className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
//                   billingPeriod === period
//                     ? "bg-blue-500 text-white shadow-sm"
//                     : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
//                 }`}
//               >
//                 {period.charAt(0).toUpperCase() + period.slice(1)}
//               </button>
//             ),
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {plans.map((plan) => {
//           const isSelected = selectedPlan === plan.name;
//           const isCurrentPlan = currentSubscription?.plan?.name === plan.name;
//           const price = getPrice(plan, billingPeriod);
//           const colors = getPlanColor(plan.name);
//           const badge = getPlanBadge(plan.name);

//           return (
//             <div
//               key={plan.id}
//               className={`relative rounded-xl border-2 p-3 transition-all cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
//                 colors.bg
//               } ${
//                 isSelected
//                   ? `${colors.border} ring-2 ring-offset-2 ring-blue-500`
//                   : colors.border
//               }`}
//               onClick={() => setSelectedPlan(plan.name)}
//             >
//               {/* Top Badge */}
//               <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                 <div className={`px-4 py-1 rounded-full text-xs font-bold ${colors.badge} flex items-center gap-1`}>
//                   <span>{badge.icon}</span>
//                   <span>{badge.text}</span>
//                 </div>
//               </div>

//               {/* Plan Header */}
//               <div className="text-center mb-4 mt-3">
//                 <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//                   {plan.displayName}
//                 </h4>

//                 {/* Price */}
//                 <div className="mb-2">
//                   <div className="flex items-baseline justify-center">
//                     <span className={`text-3xl font-bold ${colors.price}`}>
//                       ₹{price}
//                     </span>
//                     <span className="text-base text-gray-500 dark:text-gray-400 ml-1">
//                       {getPeriodLabel(billingPeriod)}
//                     </span>
//                   </div>
//                   {billingPeriod === "quarterly" && plan.name.toLowerCase() === "silver" && (
//                     <div className="text-sm text-gray-500 mt-1">
//                       <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
//                         Save 6%
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
//                   {plan.description}
//                 </p>

//                 {isCurrentPlan && (
//                   <div className="mt-2">
//                     <span className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
//                       Current Plan
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* Features List */}
//               <div className="space-y-1.5 mb-3">
//                 {plan.name.toLowerCase() === "silver" && (
//                   <div className={`text-xs font-semibold ${colors.accent} mb-2 flex items-center`}>
//                     ⭐ Everything in Basic, plus:
//                   </div>
//                 )}

//                 <div className="space-y-1.5">
//                   {/* Max Users */}
//                   <div className="flex items-start gap-2">
//                     <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
//                       <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-900 dark:text-white text-xs">
//                         {plan.name.toLowerCase() === "basic" ? "Personal Command Center" : "Team Collaboration"}
//                       </div>
//                       <div className="text-xs text-gray-600 dark:text-gray-400">
//                         {plan.maxUsers} User{plan.maxUsers > 1 ? 's' : ''} Access
//                       </div>
//                     </div>
//                   </div>

//                   {/* WhatsApp Credits */}
//                   <div className="flex items-start gap-2">
//                     <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
//                       <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-900 dark:text-white text-xs">
//                         WhatsApp Communication
//                       </div>
//                       <div className="text-xs text-gray-600 dark:text-gray-400">
//                         {plan.whatsappCreditsLimit.toLocaleString()} {plan.name.toLowerCase() === "basic" ? "Onetime" : "Monthly"} Credits
//                       </div>
//                     </div>
//                   </div>

//                   {/* AI Tokens */}
//                   <div className="flex items-start gap-2">
//                     <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
//                       <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-900 dark:text-white text-xs">
//                         AI Co-pilot Access
//                       </div>
//                       <div className="text-xs text-gray-600 dark:text-gray-400">
//                         {plan.aiTokensLimit.toLocaleString()} {plan.name.toLowerCase() === "basic" ? "Onetime" : "Monthly"} Tokens
//                       </div>
//                     </div>
//                   </div>

//                   {/* Storage */}
//                   <div className="flex items-start gap-2">
//                     <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
//                       <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-900 dark:text-white text-xs">
//                         Data Storage
//                       </div>
//                       <div className="text-xs text-gray-600 dark:text-gray-400">
//                         {formatBytes(plan.storageLimitBytes)}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Premium Features for Silver */}
//                   {plan.name.toLowerCase() === "silver" && (
//                     <>
//                       {plan.features.prioritySupport && (
//                         <div className="flex items-start gap-2">
//                           <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
//                             <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                             </svg>
//                           </div>
//                           <div>
//                             <div className="font-medium text-gray-900 dark:text-white text-xs">
//                               Priority Support
//                             </div>
//                             <div className="text-xs text-gray-600 dark:text-gray-400">
//                               24/7 Customer Support
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {plan.features.reports && (
//                         <div className="flex items-start gap-2">
//                           <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
//                             <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                             </svg>
//                           </div>
//                           <div>
//                             <div className="font-medium text-gray-900 dark:text-white text-xs">
//                               Advanced Reports
//                             </div>
//                             <div className="text-xs text-gray-600 dark:text-gray-400">
//                               Detailed Analytics & Insights
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {plan.features.analytics && (
//                         <div className="flex items-start gap-2">
//                           <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
//                             <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                             </svg>
//                           </div>
//                           <div>
//                             <div className="font-medium text-gray-900 dark:text-white text-xs">
//                               Business Analytics
//                             </div>
//                             <div className="text-xs text-gray-600 dark:text-gray-400">
//                               Performance Tracking & KPIs
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </div>

//               {/* Action Button */}
//               <Button
//                 className={`w-full py-2 text-sm font-semibold rounded-xl transition-all transform hover:scale-105 ${
//                   isCurrentPlan
//                     ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
//                     : plan.name.toLowerCase() === "basic"
//                       ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
//                       : plan.name.toLowerCase() === "silver"
//                         ? "bg-purple-500 hover:bg-purple-600 text-white shadow-lg"
//                         : colors.button
//                 } ${isCurrentPlan ? "" : "shadow-lg hover:shadow-xl"}`}
//                 disabled={isCurrentPlan}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (!isCurrentPlan) handleUpgrade(plan.id);
//                 }}
//               >
//                 {isCurrentPlan
//                   ? "Current Plan"
//                   : plan.name.toLowerCase() === "basic"
//                     ? "💚 Launch Your Free Clinic"
//                     : plan.name.toLowerCase() === "silver"
//                       ? "⚡ Coming soon..."
//                       : "Upgrade Now"}
//               </Button>

//               {/* Selection Radio */}
//               <div className="absolute top-6 right-6">
//                 <div
//                   className={`w-5 h-5 rounded-full border-2 transition-all ${
//                     isSelected
//                       ? "border-blue-500 bg-blue-500 shadow-lg"
//                       : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
//                   }`}
//                 >
//                   {isSelected && (
//                     <div className="w-3 h-3 bg-white rounded-full m-0.5"></div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default SubscriptionPlans;

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
          subtitle: `(Access to Doku AI Co-pilot ${plan.aiTokensLimit.toLocaleString()} onetime tokens)`,
          icon: "🤖",
        },
        {
          title: "Secure Your Digital Records",
          subtitle: `(${formatBytes(plan.storageLimitBytes)} of Data Storage)`,
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
          title: "Collaborate With Your Team",
          subtitle: `(Up to ${plan.maxUsers} User Logins)`,
          icon: "👥",
        },
        {
          title: "Never Worry About Space",
          subtitle: `(${formatBytes(plan.storageLimitBytes)} Storage)`,
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.name;
          const isCurrentPlan = currentSubscription?.plan?.name === plan.name;
          const price = getPrice(plan, billingPeriod);
          const colors = getPlanColor(plan.name);
          const badge = getPlanBadge(plan.name);
          const features = getPlanFeatures(plan);

          return (
            <div
              key={plan.id}
              className={`relative rounded-xl border-2 p-3 transition-all cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
                colors.bg
              } ${
                isSelected
                  ? `${colors.border} ring-2 ring-offset-2 ring-blue-500`
                  : colors.border
              }`}
              onClick={() => setSelectedPlan(plan.name)}
            >
              {/* Top Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div
                  className={`px-4 py-2.5 rounded-full text-xs font-bold ${colors.badge} flex items-center gap-1`}
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
                  <div className="flex items-baseline justify-center">
                    <span className={`text-3xl font-bold ${colors.price}`}>
                      ₹{price}
                    </span>
                    <span className="text-base text-gray-500 dark:text-gray-400 ml-1">
                      {getPeriodLabel(billingPeriod)}
                    </span>
                  </div>
                  {billingPeriod === "quarterly" &&
                    plan.name.toLowerCase() === "silver" && (
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                          Save 6%
                        </span>
                      </div>
                    )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">
                  {plan.description}
                </p>

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
                disabled={isCurrentPlan}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isCurrentPlan) handleUpgrade(plan.id);
                }}
              >
                {isCurrentPlan
                  ? "Current Plan"
                  : plan.name.toLowerCase() === "basic"
                    ? "💚 Launch Your Free Clinic"
                    : plan.name.toLowerCase() === "silver"
                      ? "⚡ Coming soon..."
                      : "Upgrade Now"}
              </Button>

              {/* Selection Radio */}
              <div className="absolute top-6 right-6">
                <div
                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-500 shadow-lg"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  }`}
                >
                  {isSelected && (
                    <div className="w-3 h-3 bg-white rounded-full m-0.5"></div>
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
