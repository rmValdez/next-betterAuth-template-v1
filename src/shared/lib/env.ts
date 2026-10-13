import { z } from "zod";

/**
 * Environment Configuration
 *
 * Checks that required settings in your .env or .env.local file are set up correctly.
 * If anything is missing or misconfigured, clear, non-technical instructions
 * are displayed in the terminal to guide you.
 *
 * Usage: import { env } from "@/shared/lib/env";
 */
const envSchema = z.object({
  // ── Backend API ──────────────────────────────────────────────────────────
  /** Web address of your backend server (e.g. http://localhost:4009/api/v1) */
  NEXT_PUBLIC_API_URL: z
    .string({
      error: "Missing backend address (NEXT_PUBLIC_API_URL). Please check your .env.local file.",
    })
    .url({
      message:
        "NEXT_PUBLIC_API_URL must be a valid web address starting with http:// or https:// (example: http://localhost:4009/api/v1).",
    }),

  // ── Optional Auth Server ──────────────────────────────────────────────────
  /** Optional custom auth server address. If omitted, automatically uses the backend origin. */
  NEXT_PUBLIC_AUTH_URL: z
    .string()
    .url({
      message:
        "NEXT_PUBLIC_AUTH_URL must be a valid web address starting with http:// or https:// (example: http://localhost:4009).",
    })
    .optional(),

  // ── Website URL ───────────────────────────────────────────────────────────
  /** Website address (optional when running on your computer) */
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url({
      message:
        "NEXT_PUBLIC_SITE_URL must be a valid web address starting with http:// or https:// (example: http://localhost:4010).",
    })
    .optional(),

  // ── Running Mode ──────────────────────────────────────────────────────────
  /** Current operating mode: development, staging, or production */
  NEXT_PUBLIC_APP_ENV: z
    .enum(["development", "staging", "production"], {
      error:
        "NEXT_PUBLIC_APP_ENV must be set to 'development', 'staging', or 'production'.",
    })
    .default("development"),
});

/**
 * Validates configuration settings and provides friendly guidance if anything is missing.
 */
function createEnv() {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  });

  if (!result.success) {
    console.error("\n=======================================================");
    console.error("CONFIGURATION SETUP NOTICE");
    console.error("=======================================================");
    console.error("Some setup settings in your configuration are missing or need attention:\n");

    result.error.issues.forEach((issue, index) => {
      const field = issue.path.join(".");
      console.error("  " + (index + 1) + ". [" + field + "]: " + issue.message);
    });

    console.error("\nHow to fix this:");
    console.error("  1. Look for the file named '.env.example' in the project root folder.");
    console.error("  2. Copy and paste it, then rename the copy to '.env.local'.");
    console.error("  3. Make sure NEXT_PUBLIC_API_URL is filled in (example: http://localhost:4009/api/v1).");
    console.error("  4. Start the application again using: pnpm dev");
    console.error("=======================================================\n");

    throw new Error(
      "Configuration settings need attention. Please check the friendly setup steps printed in the terminal above."
    );
  }

  return result.data;
}

export const env = createEnv();

export type Env = z.infer<typeof envSchema>;
