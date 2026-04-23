import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAllPlans,
  getUserSubscription,
  createSubscription,
  cancelSubscription,
  checkFeatureAccess,
  getTodaysQuestionCount,
  type SubscriptionPlan,
  type UserSubscription,
} from "@/lib/supabase/subscriptions";

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: getAllPlans,
  });
}

export function useUserSubscription() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["userSubscription", user?.id],
    queryFn: () => getUserSubscription(user!.id),
    enabled: !!user,
  });
}

export function useCreateSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, billingPeriod }: { planId: string; billingPeriod?: 'monthly' | 'yearly' }) => {
      if (!user) throw new Error("User not authenticated");
      return createSubscription(user.id, planId, billingPeriod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSubscription", user?.id] });
    },
  });
}

export function useCancelSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      return cancelSubscription(user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSubscription", user?.id] });
    },
  });
}

export function useFeatureAccess(feature: 'unlimited_questions' | 'advanced_analytics' | 'priority_support' | 'all_lessons' | 'all_flashcards') {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["featureAccess", user?.id, feature],
    queryFn: () => checkFeatureAccess(user!.id, feature),
    enabled: !!user,
  });
}

export function useTodaysQuestionCount() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["todaysQuestionCount", user?.id],
    queryFn: () => getTodaysQuestionCount(user!.id),
    enabled: !!user,
  });
}





