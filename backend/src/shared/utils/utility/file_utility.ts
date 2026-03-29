import { extname, join } from 'path';
import { FilePathType } from '../../core/model/enum/file_path_type';
import * as fs from 'fs/promises';
import { FormatHelper } from './format_helper';
export class FileUtility {
  static uploadDiskPath = './public/uploads';
  static uploadPublicPath = '/uploads';
  static images = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
  static video = ['mp4', 'avi', 'mov', 'mkv'];
  static audio = ['mp3', 'wav', 'ogg'];
  static limitImageSize = 10 * 1024 * 1024; // 10MB
  static limitVideoSize = 500 * 1024 * 1024; // 500MB
  static limitAudioSize = 20 * 1024 * 1024; // 20MB

  static getPublicFilePath(
    filename: string,
    type: FilePathType,
    path?: string,
  ): string {
    return `${FileUtility.uploadPublicPath}/${FilePathType.getFullFilePath(type, path)}/${filename}`;
  }

  static toRegex(
    list: string[],
    opts?: { prefix?: string; suffix?: string; flags?: string },
  ): RegExp {
    const prefix = opts?.prefix ?? '';
    const suffix = opts?.suffix ?? '';
    const flags = opts?.flags ?? 'i';

    return new RegExp(`${prefix}(${list.join('|')})${suffix}`, flags);
  }

  static imageExtRegex = FileUtility.toRegex(FileUtility.images, {
    prefix: '\\.',
    suffix: '$',
  });

  static imageMimeRegex = FileUtility.toRegex(FileUtility.images, {
    prefix: '^image\\/',
    suffix: '$',
  });

  static videoExtRegex = FileUtility.toRegex(FileUtility.video, {
    prefix: '\\.',
    suffix: '$',
  });

  static videoMimeRegex = FileUtility.toRegex(['mp4', 'avi', 'mov', 'mkv'], {
    prefix: '^video\\/',
  });

  static audioExtRegex = FileUtility.toRegex(FileUtility.audio, {
    prefix: '\\.',
    suffix: '$',
  });

  static audioMimeRegex = FileUtility.toRegex(['mp3', 'wav', 'ogg'], {
    prefix: '^audio\\/',
  });

  static isImage(filename: string): boolean {
    return this.images.includes(
      FileUtility.getFileExtension(filename).toLowerCase(),
    );
  }

  static isVideo(filename: string): boolean {
    return this.video.includes(
      FileUtility.getFileExtension(filename).toLowerCase(),
    );
  }

  static isAudio(filename: string): boolean {
    return this.audio.includes(
      FileUtility.getFileExtension(filename).toLowerCase(),
    );
  }

  static getFileExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.') + 1);
  }

  static getFileNameWithoutExtension(filename: string): string {
    return filename.substring(0, filename.lastIndexOf('.'));
  }

  static generateFileName(filename: string): string {
    const ext = extname(filename).toLowerCase();
    const base = FormatHelper.sanitizeBaseName(filename) || 'file';
    const stamp = FormatHelper.formatDate(new Date());
    return `${base}_${stamp}${ext}`;
  }

  static async removeFile(filePath: string) {
    const split = filePath.split('/');
    const isPublic = split[0] == 'public';
    const isZero = split[0] == '';
    if (isPublic) {
      filePath = split.slice(1).join('/');
    }
    if (isZero) {
      filePath = split.slice(1).join('/');
    }
    const oldFileDiskPath = join(process.cwd(), 'public', filePath);
    await fs.unlink(oldFileDiskPath).catch((reason) => {
      console.log(reason);
    });
  }
}
