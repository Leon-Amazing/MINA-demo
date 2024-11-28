// index.js
Page({
  data: {
    list: [
      {
        name: '地址和时间水印',
        url: '/pages/watermark/watermark',
      },
    ],
  },

  onItemTap(ev) {
    const url = ev.currentTarget.dataset.url;
    wx.navigateTo({
      url,
    });
  },
});
