var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    comments: [],
    allCommentList: [],
    picCommentList: [],
    typeId: 0,
    valueId: 0,
    showType: 0,
    allCount: 0,
    hasPicCount: 0,
    allPage: 1,
    picPage: 1,
    size: 20,

    entityId: 0,
    entityTypeId: 0,
    reviewsInfo: {
      reviewsCount: 0,
      mediasCount: 0,
      ratingAverage: 0,
      positiveRatingPercent: 0,
      rating1Count: 0,
      rating2Count: 0,
      rating3Count: 0,
      rating4Count: 0,
      rating5Count: 0
    },

    pageNum: 1,
    pageSize: 10,
    total: 0,
    predicate: 'id',
    reverse: true,
    name: '',
    categoryId: '',
    pageData: []
  },
  getCommentCount: function () {
    let that = this;
    util.request(api.CommentCount, {
      valueId: that.data.valueId,
      typeId: that.data.typeId
    }).then(function (res) {
      if (res.errno === 0) {

        that.setData({
          allCount: res.data.allCount,
          hasPicCount: res.data.hasPicCount
        });
      }
    });
  },
  getCommentList: function () {
    let that = this;
    util.request(api.CommentList, {
      valueId: that.data.valueId,
      typeId: that.data.typeId,
      size: that.data.size,
      page: (that.data.showType == 0 ? that.data.allPage : that.data.picPage),
      showType: that.data.showType
    }).then(function (res) {
      if (res.errno === 0) {

        if (that.data.showType == 0) {
          that.setData({
            allCommentList: that.data.allCommentList.concat(res.data.data),
            allPage: res.data.currentPage,
            comments: that.data.allCommentList.concat(res.data.data)
          });
        } else {
          that.setData({
            picCommentList: that.data.picCommentList.concat(res.data.data),
            picPage: res.data.currentPage,
            comments: that.data.picCommentList.concat(res.data.data)
          });
        }
      }
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      entityId: options.entityId,
      entityTypeId: options.entityTypeId
    });
    this.getReviewsInfo();
    this.getList();
    
    this.getCommentCount();
    this.getCommentList();
  },
  getReviewsInfo: function () {
    let that = this;
    util.request(api.ReviewsInfo, {
      entityId: that.data.entityId,
      entityTypeId: that.data.entityTypeId
    }, 'POST').then(function (res) {
      if (res.success === true) {
        that.setData({
          reviewsInfo: res.data,
        });
      }
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
  switchTab: function () {
    this.setData({
      showType: this.data.showType == 1 ? 0 : 1
    });

    this.getCommentList();
  },
  onReachBottom: function () {
    console.log('onPullDownRefresh');
    if (this.data.showType == 0) {

      if (this.data.allCount / this.data.size < this.data.allPage) {
        return false;
      }

      this.setData({
        'allPage': this.data.allPage + 1
      });
    } else {
      if (this.data.hasPicCount / this.data.size < this.data.picPage) {
        return false;
      }

      this.setData({
        'picPage': this.data.picPage + 1
      });
    }



    this.getCommentList();
  },
  getList: function () {
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
        entityId: that.data.entityId,
        entityTypeId: that.data.entityTypeId,
      }
    };
    util.request(api.ReviewsGrid, params, "POST")
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