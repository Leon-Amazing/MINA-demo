import Config from '../request/config';
import md5 from './md5';
import Base64 from './base64';

export function getHeaderSign(url, postparam) {
  var sign = '';
  var arr = new Array();
  for (let i in postparam) {
    arr.push(i);
  }
  arr = arr.sort();
  var poststrarr = new Array();
  for (let i of arr) {
    var str = postparam[i];
    if (typeof str != 'undefined' && str != null) {
      str = str.toString();
    } else {
      str = '';
    }
    poststrarr.push(i + '=' + (str.length > 1000 ? str.substr(0, 1000) : str));
  }
  var poststr = poststrarr.join('&');
  var md5str = '/' + url + '~' + poststr + '~' + Config.MDSalt; // ApiConfig.TOKEN + "~" + ApiConfig.RID;
  md5str = md5str.toUpperCase();
  sign = md5(md5str).toString().toUpperCase();
  return sign;
}

/* 格式时间 */
export function formatTime(time, templete = '{0}年{1}月{2}日 {3}时{4}分{5}秒') {
  if (!time) {
    return '';
  }
  const timeArr = time.match(/\d+/g);
  return templete.replace(/\{(\d+)\}/g, (...[, $1]) => {
    const time = timeArr[$1] || '00';
    return time.length < 2 ? '0' + time : time;
  });
}

export function ToBase64(str) {
  if (typeof str == 'undefined' || str == null || str == '') {
    return '';
  }
  return Base64.encode(str);
}

/* 获取文件名 */
export function getFileName(url) {
  let fileName = url.substring(url.lastIndexOf('/') + 1);
  fileName = fileName.substring(0, fileName.lastIndexOf('.'));
  return fileName;
}
