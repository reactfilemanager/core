import FileInfoMapper from '../mappers/FileInfoMapper';

export default {
  list: {
    mapper: FileInfoMapper.map,
    conf: (path) => {
      return {
        action: 'list',
        path,
      };
    },
  },
  new_dir(path, dirname) {
    return {
      action: 'new_dir',
      path,
      dirname,
    };
  },
  new_file(path, filename, content) {
    return {
      action: 'new_file',
      path,
      filename,
      content,
    };
  },
  copy(path, source, destination) {
    console.log(path, source, destination);
    return {
      action: 'copy',
      path,
      source,
      destination,
    };
  },
  move(path, source, destination) {
    return {
      action: 'move',
      path,
      source,
      destination,
    };
  },
  update(path, target, content) {
    return {
      action: 'update',
      path,
      target,
      content,
    };
  },
  rename(path, from, to) {
    return {
      action: 'rename',
      path,
      from,
      to,
    };
  },
  delete(path, target) {
    return {
      action: 'delete',
      path,
      target,
    };
  },
  upload(path, file) {
    return {
      action: 'upload',
      path,
      file,
    };
  },
  remote_download(path, url) {
    return {
      action: 'remote_download',
      path,
      url,
    };
  },
};
