String.prototype.toProperCase = function() {
  return this.replace(/\w\S*/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

Number.prototype.toHumanFileSize = function(si = false) {
  const thresh = si ? 1000 : 1024;
  let bytes = this;
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  const units = si
      ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + ' ' + units[u];
};

String.prototype.isValidURL = function() {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                                 '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                                 '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                                 '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                                 '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                                 '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(this);
};

Date.prototype.toHumanFormat = function() {
  const monthNames = [
    'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct',
    'Nov', 'Dec',
  ];

  const day = this.getDate();
  const monthIndex = this.getMonth();
  const year = this.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
};
