// ============================================================================
// 1. UI ATOM ELEMENTS
// ============================================================================
export * from "./ui/Card";
export * from "./ui/BackButton";
export * from "./ui/ClearFormButton";
export * from "./ui/Grid";
export * from "./ui/PageHeader";
export * from "./ui/StatusPill";
export * from "./Skeleton";

// Temporarily bypassed atom blocks to keep the build safe during migration
// export * from "./ui/Snackbar";
// export * from "./ui/NotificationProvider";
// export * from "./ui/FormField";

// ============================================================================
// 2. BUSINESS FEATURES LAYER
// ============================================================================
// Feature-specific UI lives in its own feature module (e.g. @/features/auth),
// composed by pages in the app layer.
