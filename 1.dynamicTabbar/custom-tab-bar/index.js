import tabs from './tabs';
const globalData = getApp().globalData;

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    selected: 0,
    color: '#c6c6c6',
    selectedColor: '#3e5e64',
    list: [],
  },

  /**
   * 生命周期方法
   */
  async attached() {
    // 监听 globalData 变化
    if (globalData) {
      const that = this;
      Object.defineProperty(globalData, 'userType', {
        enumerable: true, //控制属性是否可以枚举，能否通过(for ...in, Object.keys方法)循环访问属性，默认值为false
        configurable: true, //控制能否通过delete删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性，默认值为false
        // writable: true, //控制属性是否可以被修改，默认值是false，不能同时和getter和setter方法同时使用
        set: function (value) {
          this._userType = value;
          that.updateTabList();
        },
        get: function () {
          return this._userType;
        },
      });
    }
    this.updateTabList();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(ev) {
      const path = ev.currentTarget.dataset.path;
      wx.switchTab({
        url: path,
      });
    },
    updateTabList() {
      const userType = globalData.userType;
      // console.log(userType, 'userType');
      if (userType == 1) {
        this.setData({
          list: tabs.tab1,
        });
      } else {
        this.setData({
          list: tabs.tab2,
        });
      }
    },
  },
});
