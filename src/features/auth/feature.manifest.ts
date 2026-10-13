export const featureManifest = {
  name: "auth",
  dependsOn: [] as const,
  exposes: [
    "useAuth",
    "useAuthStore",
    "useMe",
    "AuthGate",
    "SessionHeader",
    "ProfileCard",
  ] as const,
} as const;

export type AuthManifest = typeof featureManifest;
