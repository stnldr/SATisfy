import { supabase } from "@/integrations/supabase/client";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number | null;
  plan_type: 'free' | 'basic' | 'premium' | 'pro';
  features: string[];
  max_questions_per_day: number | null;
  unlimited_practice: boolean;
  advanced_analytics: boolean;
  priority_support: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | 'incomplete_expired' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  plan?: SubscriptionPlan;
}


export async function getAllPlans(): Promise<SubscriptionPlan[]> {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .order("price_monthly");

  if (error) {
    console.error("Error fetching subscription plans:", error);
    throw error;
  }

  return data.map((plan) => ({
    id: plan.id,
    name: plan.name,
    description: plan.description,
    price_monthly: plan.price_monthly,
    price_yearly: plan.price_yearly,
    plan_type: plan.plan_type,
    features: plan.features || [],
    max_questions_per_day: plan.max_questions_per_day,
    unlimited_practice: plan.unlimited_practice,
    advanced_analytics: plan.advanced_analytics,
    priority_support: plan.priority_support,
  }));
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const { data, error } = await supabase
    .from("user_subscriptions")
    .select(`
      *,
      plan:subscription_plans(*)
    `)
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .gte("current_period_end", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // No subscription found
    console.error("Error fetching user subscription:", error);
    throw error;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    plan_id: data.plan_id,
    status: data.status,
    current_period_start: data.current_period_start,
    current_period_end: data.current_period_end,
    cancel_at_period_end: data.cancel_at_period_end,
    canceled_at: data.canceled_at,
    stripe_customer_id: data.stripe_customer_id || null,
    stripe_subscription_id: data.stripe_subscription_id || null,
    plan: data.plan ? {
      id: data.plan.id,
      name: data.plan.name,
      description: data.plan.description,
      price_monthly: data.plan.price_monthly,
      price_yearly: data.plan.price_yearly,
      plan_type: data.plan.plan_type,
      features: data.plan.features || [],
      max_questions_per_day: data.plan.max_questions_per_day,
      unlimited_practice: data.plan.unlimited_practice,
      advanced_analytics: data.plan.advanced_analytics,
      priority_support: data.plan.priority_support,
    } : undefined,
  };
}

export async function createSubscription(
  userId: string,
  planId: string,
  billingPeriod: 'monthly' | 'yearly' = 'monthly'
): Promise<UserSubscription> {
  // Get plan details
  const { data: plan, error: planError } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("id", planId)
    .single();

  if (planError || !plan) {
    throw new Error("Plan not found");
  }

  // Calculate period end (30 days for monthly, 365 for yearly)
  const periodDays = billingPeriod === 'yearly' ? 365 : 30;
  const periodEnd = new Date();
  periodEnd.setDate(periodEnd.getDate() + periodDays);

  // Create subscription directly in database
  const { data, error } = await supabase
    .from("user_subscriptions")
    .upsert({
      user_id: userId,
      plan_id: planId,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: periodEnd.toISOString(),
      cancel_at_period_end: false,
    }, {
      onConflict: 'user_id',
    })
    .select(`
      *,
      plan:subscription_plans(*)
    `)
    .single();

  if (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }

  // Record in history
  await supabase
    .from("subscription_history")
    .insert({
      user_id: userId,
      plan_id: planId,
      status: 'active',
      action: 'created',
    });

  return {
    id: data.id,
    user_id: data.user_id,
    plan_id: data.plan_id,
    status: data.status,
    current_period_start: data.current_period_start,
    current_period_end: data.current_period_end,
    cancel_at_period_end: data.cancel_at_period_end,
    canceled_at: data.canceled_at,
    stripe_customer_id: data.stripe_customer_id || null,
    stripe_subscription_id: data.stripe_subscription_id || null,
    plan: data.plan ? {
      id: data.plan.id,
      name: data.plan.name,
      description: data.plan.description,
      price_monthly: data.plan.price_monthly,
      price_yearly: data.plan.price_yearly,
      plan_type: data.plan.plan_type,
      features: data.plan.features || [],
      max_questions_per_day: data.plan.max_questions_per_day,
      unlimited_practice: data.plan.unlimited_practice,
      advanced_analytics: data.plan.advanced_analytics,
      priority_support: data.plan.priority_support,
    } : undefined,
  };
}

export async function cancelSubscription(userId: string): Promise<void> {
  const { error } = await supabase
    .from("user_subscriptions")
    .update({
      cancel_at_period_end: true,
      canceled_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .in("status", ["active", "trialing"]);

  if (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
}

export async function checkFeatureAccess(
  userId: string,
  feature: 'unlimited_questions' | 'advanced_analytics' | 'priority_support' | 'all_lessons' | 'all_flashcards'
): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('has_subscription_access', {
      user_uuid: userId,
      feature_name: feature,
    });

  if (error) {
    console.error("Error checking feature access:", error);
    return false;
  }

  return data ?? false;
}

export async function getTodaysQuestionCount(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { count, error } = await supabase
    .from("user_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", today.toISOString());

  if (error) {
    console.error("Error counting today's questions:", error);
    return 0;
  }

  return count ?? 0;
}





