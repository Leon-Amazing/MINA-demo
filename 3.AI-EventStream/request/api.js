import request from './index';

function post(url) {
  return function (data, showLoading = false, loadingMsg = '加载中...') {
    return request.post(url, data, showLoading, loadingMsg);
  };
}

function get(url) {
  return function (data, showLoading = false, loadingMsg = '加载中...') {
    return request.get(url, data, showLoading, loadingMsg);
  };
}
export default {
  upload: {
    GetSignature: post('/miniprogramapi/upload/GetSignature'), // 获取直传签名
  },
};
