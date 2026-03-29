export enum FilePathType {
  vendorLogo = 'vendor/logo',
  brandBannerHeader = 'brand/banner/header',
  brandBannerFull = 'brand/banner/full',
  brandLogo = 'brand/logo',
  brandBannerItem = 'brand/banner/item',
  productThumbnail = 'product/thumbnail',
  voucherImage = 'voucher/image',
}

export namespace FilePathType {
  export function fromString(content?: string): FilePathType {
    switch (content?.toLowerCase()) {
      case FilePathType.vendorLogo:
        return FilePathType.vendorLogo;
      case FilePathType.brandBannerHeader:
        return FilePathType.brandBannerHeader;
      case FilePathType.brandBannerFull:
        return FilePathType.brandBannerFull;
      case FilePathType.brandLogo:
        return FilePathType.brandLogo;
      case FilePathType.brandBannerItem:
        return FilePathType.brandBannerItem;
      case FilePathType.productThumbnail:
        return FilePathType.productThumbnail;
      case FilePathType.voucherImage:
        return FilePathType.voucherImage;
      default:
        throw new Error('Invalid FilePathType');
    }
  }

  export function fromFieldName(
    identifier: string,
    fieldName?: string,
  ): FilePathType {
    if (identifier == 'brand') {
      switch (fieldName) {
        case 'banner_full':
          return FilePathType.brandBannerFull;
        case 'banner_header':
          return FilePathType.brandBannerHeader;
        case 'logo':
          return FilePathType.brandLogo;
        case 'item':
          return FilePathType.brandBannerItem;
        default:
          break;
      }
    }
    if (identifier == 'vendor') {
      switch (fieldName) {
        case 'logo':
          return FilePathType.vendorLogo;
        default:
          break;
      }
    }
    if (identifier == 'voucher') {
      switch (fieldName) {
        case 'image':
          return FilePathType.voucherImage;
        default:
          break;
      }
    }
    if (identifier == 'product') {
      switch (fieldName) {
        case 'thumbnail':
          return FilePathType.productThumbnail;
        default:
          break;
      }
    }
    throw new Error('Invalid FilePathType');
  }

  export function getFullFilePath(type: FilePathType, path?: string): string {
    if (!path) {
      return type;
    }
    return `${path}/${type}`;
  }
}
