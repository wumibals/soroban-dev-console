export const THROTTLE_POLICIES = {
  APPEALS: {
    limit: 5,
    windowSeconds: 300,
  },

  SUPPORT: {
    limit: 10,
    windowSeconds: 300,
  },

  VERIFICATION: {
    limit: 20,
    windowSeconds: 60,
  },

  BUDGET_ACTIONS: {
    limit: 3,
    windowSeconds: 300,
  },
};

export type ThrottlePolicyName = keyof typeof THROTTLE_POLICIES;
