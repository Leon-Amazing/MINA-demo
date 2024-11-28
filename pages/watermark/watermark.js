// pages/watermark/watermark.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canvasWidthValue: 0,
    canvasHeightValue: 0,
    src: '',
  },

  uploadIMG() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: async res => {
        wx.showLoading({
          title: '上传中...',
          mask: true,
        });
        const address = '深圳市南山区学府路263号大新时代大厦A座';
        const currentTime = new Date().toLocaleString();
        const data = res.tempFiles[0];
        try {
          const ctx = wx.createCanvasContext('myCanvas');
          // 获取图片真实的宽度和高度
          const res = await wx.getImageInfo({
            src: data.path ? data.path : data.tempFilePath ? data.tempFilePath : '',
          });
          console.log('获取图片真实的宽度和高度=>', res);
          this.setData({
            canvasWidthValue: res.width,
            canvasHeightValue: res.height,
          });
          // 绘制图片
          ctx.drawImage(data.tempFilePath, 0, 0, res.width, res.height);
          // 添加水印
          ctx.setFontSize(20);
          ctx.fillText(address, 10, res.height - 50); // 地址水印
          ctx.fillText(currentTime, 10, res.height - 20); // 时间水印
          ctx.draw();
          const temp = await wx.canvasToTempFilePath({
            canvasId: 'myCanvas',
          });
          // **上传水印图片到服务器（真实项目中需要考虑上传后台，还是直传等）**
          // const result = await request.uploadFile(temp.tempFilePath);
          this.setData({
            src: temp.tempFilePath,
          });
          wx.hideLoading();
        } catch (error) {
          console.log('error=>', error);
        }
      },
    });
  },
});
