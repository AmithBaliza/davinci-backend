import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface Environment {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL?: string;
}

const requiredEnvVars = ["DATABASE_URL"];

const validateEnvironment = (): Environment => {
  const missingVars: string[] = [];

  // Check required environment variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }

  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "3000", 10),
    DATABASE_URL: process.env.DATABASE_URL!,
    REDIS_URL: process.env.REDIS_URL,
  };
};

export const env = validateEnvironment();

export default env;
