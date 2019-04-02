var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    navList: [],
    categoryList: [],
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    goodsCount: 0,
    scrollHeight: 0,

    categories: [],
    current: {}
  },
  onLoad: function (options) {
    let that = this;
    util.request(api.Catalogs)
      .then(function (res) {
        if (res.success === true && res.data && res.data.length > 0) {
          that.setData({
            categories: res.data,
            current: res.data[0]
          });
        }
      });
    // this.getCatalog();
  },
  getCatalog: function () {
    //CatalogList
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.CatalogList).then(function (res) {
      that.setData({
        navList: res.data.categoryList,
        currentCategory: res.data.currentCategory
      });
      wx.hideLoading();
    });
    util.request(api.GoodsCount).then(function (res) {
      that.setData({
        goodsCount: res.data.goodsCount
      });
    });

  },
  getCurrentCategory: function (id) {
    let that = this;
    util.request(api.CatalogCurrent, { id: id })
      .then(function (res) {
        that.setData({
          currentCategory: res.data.currentCategory
        });
      });
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
  getList: function () {
    var that = this;
    util.request(api.ApiRootUrl + 'api/catalog/' + that.data.currentCategory.cat_id)
      .then(function (res) {
        that.setData({
          categoryList: res.data,
        });
      });
  },
  switchCate: function (event) {
    var that = this;
    var currentTarget = event.currentTarget;
    if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
      return false;
    }
    this.getCurrentCategory(event.currentTarget.dataset.id);
  },
  switchCate2: function (event) {
    let id = event.currentTarget.dataset.id;
    if (this.data.current.id == id) {
      return false;
    }
    let first = this.data.categories.find(c => c.id == id);
    this.setData({ current: first });
  }
})