export const BASE_NETWORK_TYPE = 'BASE_NETWORK_TYPE';

export enum BaseNetworkType {
  n8n = 'n8n',
  waha = 'waha',
}

export namespace BaseNetworkType {
  export function fromString(content?: string): BaseNetworkType {
    switch (content?.toLowerCase()) {
      case BaseNetworkType.n8n:
        return BaseNetworkType.n8n;
      case BaseNetworkType.waha:
        return BaseNetworkType.waha;
      default:
        throw new Error('Invalid BaseNetworkType');
    }
  }

  export function baseUrl(type: BaseNetworkType): string {
    switch (type) {
      case BaseNetworkType.n8n:
        return 'https://n8n.cine.co.id';
      case BaseNetworkType.waha:
        return 'https://waha.cine.co.id';
      default:
        throw new Error('Invalid BaseNetworkType');
    }
  }

  export function accessToken(type: BaseNetworkType): string | null {
    switch (type) {
      case BaseNetworkType.n8n:
        return null;
      case BaseNetworkType.waha:
        return null;
      default:
        return null;
    }
  }
}
