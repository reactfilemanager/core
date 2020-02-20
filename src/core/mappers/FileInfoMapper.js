import FileInfo from '../models/FileInfo';

export default {
  map(list) {
    const mapper = {
      many(files) {
        return files.map(file => this.one(file));
      },
      one(fileInfo) {
        const file = new FileInfo(
          fileInfo.name,
          fileInfo.path,
          fileInfo.is_dir,
          fileInfo.is_file,
          fileInfo.is_link,
          fileInfo.is_readable,
          fileInfo.is_writable,
          fileInfo.is_executable,
          fileInfo.perms,
          fileInfo.size,
          fileInfo.extension,
          new Date(fileInfo.last_modified * 1000),
          fileInfo.extra,
        );
        if (fileInfo.image_info) {
          file.image_info = fileInfo.image_info;
        }

        return file;
      },
    };

    return {
      dirs: mapper.many(list.dirs),
      files: mapper.many(list.files),
    };
  },
};
