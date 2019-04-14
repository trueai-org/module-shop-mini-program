App({
  onLaunch: function () {
    try {
      let userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.globalData.userInfo = JSON.parse(userInfo);
      }
      this.globalData.token = wx.getStorageSync('token');

      wx.getSystemInfo({
        success: e => {
          this.globalData.StatusBar = e.statusBarHeight;
          let custom = wx.getMenuButtonBoundingClientRect();
          this.globalData.Custom = custom;
          this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        }
      })
    } catch (e) {
      console.log(e);
    }
  },

  defaultAvatar: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png',
  globalData: {
    switchTabIndex: 0,
    userInfo: {
      name: '点击登录',
      avatar: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    },
    token: '',
  }
})