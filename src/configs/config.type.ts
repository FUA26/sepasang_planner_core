export type AppConfig = {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
};

export type AuthConfig = {
  secret?: string;
  expires?: string;
  refresh_exp?: string;
};

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
};
