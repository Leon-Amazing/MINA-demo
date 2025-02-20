/**
 * envVersion： qa | tp | live
 */
const envVersion = 'qa';

/* 请求地址 */
const domainDef = {
  live: 'https://xxx.live.com',
  tp: 'https://xxx.tp.com',
  qa: 'https://xxx.qa.com',
};

/* 图片地址 */
const domainDefImg = {
  live: '',
  tp: '',
  qa: '',
};

export default {
  domain: () => {
    return domainDef[envVersion];
  },
  domainImg: () => {
    return domainDefImg[envVersion];
  },
  MDSalt: 'xxxxxxxxxxxxxx',
};
