type EnvConfig = Record<string, unknown>;

function getString(config: EnvConfig, key: string, fallback?: string): string {
  const value = config[key];

  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  throw new Error(`Environment variable ${key} is required.`);
}

function getNumber(config: EnvConfig, key: string, fallback?: number): number {
  const rawValue = config[key];

  if (rawValue === undefined || rawValue === null || rawValue === '') {
    if (fallback !== undefined) {
      return fallback;
    }

    throw new Error(`Environment variable ${key} is required.`);
  }

  const parsedValue = Number(rawValue);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`Environment variable ${key} must be a valid number.`);
  }

  return parsedValue;
}

function getOptionalString(config: EnvConfig, key: string): string | undefined {
  const value = config[key];

  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  return undefined;
}

function getOptionalStringArray(config: EnvConfig, key: string): string[] | undefined {
  const value = getOptionalString(config, key);

  if (!value) {
    return undefined;
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function validateEnvironment(config: EnvConfig) {
  return {
    PORT: getNumber(config, 'PORT', 3000),
    MONGODB_URI: getString(config, 'MONGODB_URI', 'mock://local'),
    MONGODB_DB_NAME: getString(config, 'MONGODB_DB_NAME', 'backend_app'),
    MONGODB_DNS_SERVERS: getOptionalString(config, 'MONGODB_DNS_SERVERS'),
    SWAGGER_PATH: getString(config, 'SWAGGER_PATH', 'docs'),
    JWT_ACCESS_TOKEN_SECRET: getString(
      config,
      'JWT_ACCESS_TOKEN_SECRET',
      'change-me-access-token-secret',
    ),
    JWT_REFRESH_TOKEN_SECRET: getString(
      config,
      'JWT_REFRESH_TOKEN_SECRET',
      'change-me-refresh-token-secret',
    ),
    JWT_VERIFICATION_TOKEN_SECRET: getString(
      config,
      'JWT_VERIFICATION_TOKEN_SECRET',
      'change-me-verification-token-secret',
    ),
    ML_TEAM_API_URL: getOptionalString(config, 'ML_TEAM_API_URL'),
    CORS_ORIGINS: getOptionalStringArray(config, 'CORS_ORIGINS'),
  };
}
