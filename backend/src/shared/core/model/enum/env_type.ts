export enum EnvType {
  local = 'local',
  development = 'development',
  production = 'production',
}

export namespace EnvType {
  export function fromString(content?: string): EnvType {
    switch (content?.toLowerCase()) {
      case EnvType.local:
        return EnvType.local;
      case EnvType.development:
        return EnvType.development;
      case EnvType.production:
        return EnvType.production;
      default:
        return EnvType.production;
    }
  }
}
