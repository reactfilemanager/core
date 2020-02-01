import icons from '../../../../assets/icons';

export default {
  details: {
    shouldShow(item) {
      return true; //can download everything
    },
    menu_item: {
      icon: icons.info,
      title: 'Details',
    },
    handle(item) {
      console.log('Open Info Panel', item);
    },
  },
  download: {
    shouldShow(item) {
      return true; //can download everything
    },
    menu_item: {
      icon: icons.download,
      title: 'Download',
    },
    handle(item) {
      console.log('Download', item);
    },
  },
};