// showToast
export function showToast(title, icon = 'none', duration = 2500, mask = false) {
  wx.showToast({
    title: title || '',
    icon,
    duration,
    mask,
  });
}

// showModal
export function showModal({ title = '提示', content = '确定内容', showCancel = true, confirmText = '确定', cancelText = '取消' }) {
  return new Promise(resolve => {
    wx.showModal({
      title,
      content,
      showCancel,
      confirmText,
      cancelText,
      success: res => {
        if (res.confirm) {
          resolve(true);
        } else if (res.cancel) {
          resolve(false);
        }
      },
    });
  });
}
