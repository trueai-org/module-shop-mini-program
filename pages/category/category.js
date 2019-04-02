var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    // text:"这是一个页面"
    navList: [],
    goodsList: [],
    id: 0,
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1,
    size: 10,

    categories: [],
    current: {},
    pageNum: 1,
    pageSize: 5,
    total: 0,
    predicate: 'id',
    reverse: true,
    name: '',
    categoryId: '',
    pageData: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    util.request(api.SubCategories)
      .then(function (res) {
        if (res.success === true && res.data && res.data.length > 0) {
          that.setData({
            categories: res.data,
            current: res.data[0],
            categoryId: res.data[0].id
          });
          that.getGoods();
        }
      });

    // return;

    if (options.id) {
      that.setData({
        id: parseInt(options.id)
      });
    }

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

    this.getCategoryInfo();
  },
  getCategoryInfo: function () {
    let that = this;
    util.request(api.GoodsCategory, { id: this.data.id })
      .then(function (res) {

        if (res.errno == 0) {
          that.setData({
            navList: res.data.brotherCategory,
            currentCategory: res.data.currentCategory
          });

          //nav位置
          let currentIndex = 0;
          let navListCount = that.data.navList.length;
          for (let i = 0; i < navListCount; i++) {
            currentIndex += 1;
            if (that.data.navList[i].id == that.data.id) {
              break;
            }
          }
          if (currentIndex > navListCount / 2 && navListCount > 5) {
            that.setData({
              scrollLeft: currentIndex * 60
            });
          }
          that.getGoodsList();

        } else {
          //显示错误信息
        }

      });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    // console.log(1);
  },
  onHide: function () {
    // 页面隐藏
  },
  getGoodsList: function () {
    var that = this;

    util.request(api.GoodsList, { categoryId: that.data.id, page: that.data.page, size: that.data.size })
      .then(function (res) {
        that.setData({
          goodsList: res.data.goodsList,
        });
      });
  },
  onUnload: function () {
    // 页面关闭
  },
  switchCate: function (event) {
    if (this.data.id == event.currentTarget.dataset.id) {
      return false;
    }
    var that = this;
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft
      });
    }
    this.setData({
      id: event.currentTarget.dataset.id
    });

    this.getCategoryInfo();
  },
  switchCate2: function (event) {
    let id = event.currentTarget.dataset.id;
    if (this.data.current.id == id) {
      return false;
    }
    let first = this.data.categories.find(c => c.id == id);
    if (first) {
      this.setData({
        current: first,
        pageData: [],
        pageNum: 1,
        pageSize: this.data.pageSize,
        total: 0,
        predicate: 'id',
        reverse: true,
        name: '',
        categoryId: first.id,
      });
      this.getGoods();
    }
  },
  onReachBottom: function () {
    // 当界面的下方距离页面底部距离小于100像素时触发回调
    this.getGoods();
  },
  getGoods: function () {
    let that = this;
    if (this.data.total > 0 && this.data.total <= this.data.pageNum * this.data.pageSize)
      return;
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
    util.request(api.Goods, params, "POST")
      .then(function (res) {
        if (res.success === true) {
          console.log(res);
          let origin_data = that.data.pageData || [];
          let new_data = origin_data.concat(res.data.list)
          that.setData({
            pageData: new_data,
            total: parseInt(res.data.pagination.total)
          });
          if (parseInt(res.data.pagination.total) > parseInt(res.data.pagination.current) * parseInt(res.data.pagination.pageSize)) {
            that.setData({
              pageNum: (parseInt(res.data.pagination.current) + 1)
            });
          }
        }
      });
  }
})