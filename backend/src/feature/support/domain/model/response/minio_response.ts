export class MinioResponse {
  key: string;
  url: string;

  constructor(key: string, url: string) {
    this.key = key;
    this.url = url;
  }

  get toMap(): Record<string, any> {
    return {
      key: this.key,
      url: this.url,
    };
  }

  static fromMap(content: any): MinioResponse {
    return new MinioResponse(content.key, content.url);
  }
}
