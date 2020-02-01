import icons from '../../../../assets/icons';
import {setWorkingPath} from '../../state/actions';

export default {
  folder_open: {
    handles(item) {
      return item.is_dir;
    },
    menu_item: {
      title: 'Open',
      icon: null,
    },
    handle(item, state, dispatch) {
      dispatch(setWorkingPath(item.path));
    },
  },
};