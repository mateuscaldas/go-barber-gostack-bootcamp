import IStorageProvider from '../models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storage.push(file);
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const findFileIndex = this.storage.findIndex(
      storageFile => storageFile === file
    );

    this.storage.splice(findFileIndex, 1);
  }
}
