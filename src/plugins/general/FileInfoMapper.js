import FileInfo from './FileInfo';

export default {
  map(list) {
    const mapper = {
      many(files) {
        return files.map(file => this.one(file));
      },
      one(fileInfo) {
        return new FileInfo(
            fileInfo.name,
            fileInfo.path,
            fileInfo.is_dir,
            fileInfo.is_file,
            fileInfo.is_link,
            fileInfo.is_readable,
            fileInfo.is_writable,
            fileInfo.is_executable,
            fileInfo.size,
            fileInfo.extension,
        );
      },
    };

    return {
      dirs: mapper.many(list.dirs),
      files: mapper.many(list.files),
    };
  },
};
