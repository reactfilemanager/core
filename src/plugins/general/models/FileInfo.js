export default class FileInfo {
  name;
  path;
  is_dir;
  is_file;
  is_link;
  is_readable;
  is_writable;
  is_executable;
  size;
  extension;
  selected = false;

  constructor(
      name, path, is_dir, is_file, is_link, is_readable, is_writable,
      is_executable, size, extension) {
    this.name = name;
    this.path = path;
    this.is_dir = is_dir;
    this.is_file = is_file;
    this.is_link = is_link;
    this.is_readable = is_readable;
    this.is_writable = is_writable;
    this.is_executable = is_executable;
    this.size = size;
    this.extension = extension;
  }

}