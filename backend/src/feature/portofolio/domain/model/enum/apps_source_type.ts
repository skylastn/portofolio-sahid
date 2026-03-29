export enum AppSourceType {
  web = 'web',
  android = 'android',
  ios = 'ios',
  windows = 'windows',
  mac = 'mac',
  linux = 'linux',
  github = 'github',
  other = 'other',
}

export namespace AppSourceType {
  export function fromString(content: string): AppSourceType {
    switch (content) {
      case 'web':
        return AppSourceType.web;
      case 'android':
        return AppSourceType.android;
      case 'ios':
        return AppSourceType.ios;
      case 'windows':
        return AppSourceType.windows;
      case 'mac':
        return AppSourceType.mac;
      case 'linux':
        return AppSourceType.linux;
      case 'github':
        return AppSourceType.github;
      case 'other':
        return AppSourceType.other;
      default:
        return AppSourceType.other;
    }
  }
}
