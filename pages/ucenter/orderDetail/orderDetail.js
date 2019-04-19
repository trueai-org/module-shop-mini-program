var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    order: {
      address: {}
    },
    showTimer: false,
    timerStr: `${0}天 ${0}小时 ${0}分钟 ${0}秒`,

    visibleDelete: false,
    visibleCancel: false,
    visibleShipped: false,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    // this.getOrderDetail();
  },
  getOrderDetail() {
    let that = this;
    wx.showLoading({
      title: '加载中...'
    });
    util.request(api.Orders + '/' + that.data.orderId).then(function (res) {
      wx.hideLoading();
      if (res.success === true) {
        that.setData({
          order: res.data
        });
        that.payTimer();
      }
    });
  },
  payTimer() {
    if (!this.data.order || !this.data.order.orderStatus)
      return;
    let ss = this.data.order.orderStatus;

    let dateStr = this.data.order.createdOn; //2017-01-01 11:00:00 -> 2017/01/01 11:00:00

    let addSec = 1800; // +30min 剩余支付时间
    //支付后，买家7天内确认收货（可延长确认收货时间），如果到时间未确认收货，则自动确认收货，并自动好评
    if (ss == 30 ||
      ss == 40 ||
      ss == 50) {
      addSec = 3600 * 24 * 7; // +7天
      if (this.data.order.paymentOn) {
        dateStr = this.data.order.paymentOn;
      }
    }
    dateStr = dateStr.replace(/-/g, '/');
    // console.log(dateStr);

    if (ss && ss != 10 && ss != 60 && ss != 70) {
      let that = this;
      let now = parseInt(Date.parse(new Date()) / 1000);
      let endOn = parseInt(Date.parse(new Date(dateStr)) / 1000) + addSec;
      let total = parseInt(endOn - now);
      if (total > 0) {
        that.setData({
          showTimer: true
        })
        setInterval(() => {
          if (total > 0) {
            total -= 1;
            let day = parseInt(total / (3600 * 24));
            let hour = parseInt(total % (3600 * 24) / 3600);
            let min = parseInt((total % 3600) / 60);
            let sec = parseInt((total % 60));
            let str = `${day}天 ${hour}小时 ${min}分钟 ${sec}秒`;
            that.setData({
              timerStr: str,
            });
          } else {
            that.setData({
              showTimer: false
            })
          }
        }, 1000);
      }
    }
  },
  payOrder() {
    let that = this;
    util.request(api.PayPrepayId, {
      orderId: that.data.orderId || 15
    }).then(function (res) {
      if (res.errno === 0) {
        const payParam = res.data;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            console.log(res)
          },
          'fail': function (res) {
            console.log(res)
          }
        });
      }
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getOrderDetail();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  showDeleteModal(e) {
    this.setData({
      visibleDelete: true
    })
  },
  hideModal(e) {
    this.setData({
      visibleDelete: false
    })
  },
  deleteOrder() {
    wx.showLoading({
      title: '删除中...'
    });
    let that = this;
    util.request(api.Orders + '/' + that.data.orderId, {}, 'DELETE').then(function (res) {
      wx.hideLoading();
      if (res.success === true) {
        // wx.navigateBack({
        //   delta: 1
        // });
        wx.redirectTo({
          url: '../order/order',
        });
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        });
      }
    });
  },
  showCancelModal(e) {
    this.setData({
      visibleCancel: true
    })
  },
  hideCancelModal(e) {
    this.setData({
      visibleCancel: false
    })
  },
  showShippedModal(e) {
    this.setData({
      visibleShipped: true
    })
  },
  hideShippedModal(e) {
    this.setData({
      visibleShipped: false
    })
  },
  cancelOrder() {
    wx.showLoading({
      title: '取消中...'
    });
    let that = this;
    util.request(api.Orders + '/' + that.data.orderId + '/cancel', {}, 'PUT').then(function (res) {
      wx.hideLoading();
      if (res.success === true) {
        // wx.navigateBack({
        //   delta: 1
        // });
        wx.redirectTo({
          url: '../order/order',
        });
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        });
      }
    });
  },
  shippedOrder() {
    wx.showLoading({
      title: '确认中...'
    });
    let that = this;
    util.request(api.Orders + '/' + that.data.orderId + '/cinfirm-receipt', {}, 'PUT').then(function (res) {
      wx.hideLoading();
      if (res.success === true) {
        wx.redirectTo({
          url: '../order/order?type=3',
        });
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        });
      }
    });
  },
  redirectToReview(e) {
    wx.navigateTo({
      url: `/pages/review/review?entityId=${e.target.dataset.id}&entityTypeId=3&sourceId=${this.data.orderId}&sourceType=0`
    });
  }
})