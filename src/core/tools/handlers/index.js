import icons from '../../../assets/icons';
import {setWorkingPath} from '../../state/actions';
import FileInfo from '../../models/FileInfo';

export default {
  folder_open: {
    handles(item) {
      return item instanceof FileInfo && item.is_dir;
    },
    menu_item: {
      title: 'Open',
      icon: null,
    },
    handle(item) {
      setWorkingPath(item.path);
    },
  },
};
