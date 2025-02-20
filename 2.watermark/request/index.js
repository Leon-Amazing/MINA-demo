import { showToast } from '../utils/tools';
import { getHeaderSign } from '../utils/util';
import Config from './config';
import API from './api';
const globalData = getApp().globalData;

/**
 * 发送请求
 * @params
 * method: <String> 请求方式: POST/GET
 * url: <String> 请求路径
 * data: <Object> 请求参数
 */
function request(options) {
  /**
   * 添加默认值，解决未传参时，参数不统一 start
   */
  if (options.method === 'POST') {
    if (!options.data) {
      options.data = {};
    }
    options.data = Object.assign(options.data, {
      TokenFrom: 1,
    });
  }
  /**
   * 添加默认值，解决未传参时，参数不统一 end
   */
  const { method, url, data, showLoading = false, loadingMsg = '加载中...' } = options;
  // 设置请求头
  const header = {
    'content-type': 'application/x-www-form-urlencoded',
  };
  // MD5
  header['Sign'] = getHeaderSign(url, data);
  // token
  if (wx.getStorageSync('token')) {
    header['Token'] = wx.getStorageSync('token');
  }
  // 提示
  if (showLoading) {
    wx.showLoading({
      title: loadingMsg,
    });
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: Config.domain() + url,
      data,
      header,
      method,
      success: res => {
        if (res.data.code === 401) {
          wx.clearStorage();
          globalData.isLogged = false;
          wx.reLaunch({
            url: '/pages/index/index',
          });
          return;
        }
        resolve(res.data);
        if (showLoading) {
          wx.hideLoading();
        }
      },
      fail: err => {
        if (showLoading) {
          wx.hideLoading();
        }
        showToast(err.errMsg || '请求错误~');
        reject(err);
      },
    });
  });
}

function get(url, data, showLoading, loadingMsg) {
  return request({
    method: 'GET',
    url,
    data,
    showLoading,
    loadingMsg,
  });
}

function post(url, data, showLoading, loadingMsg) {
  return request({
    method: 'POST',
    url,
    data,
    showLoading,
    loadingMsg,
  });
}

/* 上传到后台 */
function uploadFile(filePath) {
  return new Promise(resolve => {
    const Token = wx.getStorageSync('token');
    wx.uploadFile({
      url: Config.domain() + '/miniprogramapi/upload/ImageV2',
      filePath,
      name: 'file',
      header: {
        'Content-type': 'multipart/form-data',
        Token,
      },
      success(res) {
        const data = res.data;
        resolve(JSON.parse(data));
      },
      fail(err) {
        showToast(err.errMsg || '上传失败，稍后重试~');
      },
    });
  });
}

/* 获取随机数 */
function random_string(len = 32) {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
/* 获取图片后缀 */
function get_suffix(filename) {
  const pos = filename.lastIndexOf('.');
  let suffix = '';
  if (pos != -1) {
    suffix = filename.substring(pos);
  }
  return suffix;
}
/* 获取签名 */
async function getSignature(file_type = 'OTHER') {
  return await API.upload.GetSignature({
    file_type,
  });
}
/* 文件直传oss */
function uploadOss(filePath, file_type = 'OTHER') {
  return new Promise(async resolve => {
    const res = await getSignature(file_type);
    if (res.code === 0) {
      const { dir, accessid, policy, signature, host, prefix, callback } = res.data;
      const key = dir + random_string() + get_suffix(filePath);
      wx.uploadFile({
        url: `${host}/`,
        filePath: filePath,
        name: 'file',
        header: {
          'Content-Type': 'multipart/form-data',
        },
        formData: {
          key: key,
          policy: policy,
          OSSAccessKeyId: accessid,
          signature: signature,
          callback: callback,
          success_action_status: '200',
        },
        success: async _ => {
          const result = prefix + key;
          resolve(result);
        },
        fail: function (err) {
          console.log(err, 'err');
        },
      });
    }
  });
}

export default {
  request,
  get,
  post,
  uploadFile,
  uploadOss,
};
