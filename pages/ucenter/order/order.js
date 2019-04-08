var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    orderList: [],

    pageNum: 1,
    pageSize: 10,
    total: 0,
    predicate: 'id',
    reverse: true,
    name: '',
    categoryId: '',
    pageData: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    // this.getOrderList();

    this.getGrid();
  },
  getOrderList() {
    let that = this;
    // util.request(api.OrderList).then(function (res) {
    //   if (res.errno === 0) {
    //     console.log(res.data);
    //     that.setData({
    //       orderList: res.data.data
    //     });
    //   }
    // });
  },
  payOrder() {
    wx.redirectTo({
      url: '/pages/pay/pay',
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onReachBottom: function () {
    // 当界面的下方距离页面底部距离小于100像素时触发回调
    if (this.data.total > 0 && this.data.pageNum * this.data.pageSize < this.data.total) {
      this.setData({
        pageNum: this.data.pageNum + 1
      }, () => {
        this.getGrid();
      });
    }
  },
  getGrid: function () {
    let that = this;
    var params = {
      pagination: {
        current: that.data.pageNum,
        pageSize: that.data.pageSize
      },
      sort: {
        predicate: that.data.predicate,
        reverse: that.data.reverse,
      },
      search: {
        name: that.data.name,
        categoryId: that.data.categoryId,
      }
    };
    util.request(api.OrderGrid, params, "POST")
      .then(function (res) {
        if (res.success === true) {
          let origin_data = that.data.pageData || [];
          let new_data = origin_data.concat(res.data.list)
          that.setData({
            pageData: new_data,
            total: parseInt(res.data.pagination.total)
          });
        }
      });
  }
})