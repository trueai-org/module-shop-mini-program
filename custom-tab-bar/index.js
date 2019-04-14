// var app = getApp();

Component({
  data: {
    selected: 0,
    selectedClass:'text-new-red',
    selectedNoneClass:'text-new-grey',
    fillCalss:'',// fill // TODO 切换闪烁
    list: [
      {
        pagePath: "/pages/index/index",
        text: "首页"
      },
      {
        pagePath: "/pages/catalog/catalog",
        text: "分类"
      },
      {
        pagePath: "/pages/cart/cart",
        text: "购物车"
      },
      {
        pagePath: "/pages/ucenter/index/index",
        text: "我的"
      }
    ],
  },
  attached() {

  },
  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index
      if (parseInt(index) >= 0) {
        const item = this.data.list[index];
        this.setData({
          selected: index
        })

        // app.globalData.switchTabIndex = index;
        // let xx = wx.getStorageSync('tab');
        // wx.setStorage({
        //   key: 'tab',
        //   data: index
        // })
        wx.switchTab({ url: item.pagePath })
      }
    }
  }
})