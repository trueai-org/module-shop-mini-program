const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
var WxParse = require('../../lib/wxParse/wxParse.js');
var HtmlToJson = require('../../lib/wxParse/html2json.js');
const app = getApp()

Page({
  data: {
    newGoods: [],
    hotGoods: [],
    topics: [],
    brands: [],
    floorGoods: [],
    banner: [],
    channel: [],

    // todo
    widgets: [],
    carouselWidgets: [],
    categorys: [],
    htmls: [],
    simplProducts: [],
    products: []
  },
  onShareAppMessage: function () {
    return {
      title: 'NideShop',
      desc: '仿网易严选微信小程序商城',
      path: '/pages/index/index'
    }
  },

  getIndexData: function () {
    let that = this;
    // util.request(api.IndexUrl).then(function (res) {
    //   if (res.errno === 0) {
    //     that.setData({
    //       newGoods: res.data.newGoodsList,
    //       hotGoods: res.data.hotGoodsList,
    //       topics: res.data.topicList,
    //       brand: res.data.brandList,
    //       floorGoods: res.data.categoryList,
    //       banner: res.data.banner,
    //       channel: res.data.channel
    //     });
    //   }
    // });

    util.request(api.Widgets).then(function (res) {
      if (res.success === true) {
        that.setData({
          widgets: res.data.widgetInstances || []
        }, () => {
          that.data.widgets.forEach(e => {
            if (e.widgetId == 4) {
              let olds = that.data.htmls;
              let transData = HtmlToJson.html2json(e.htmlData);
              olds.push({
                id: e.id,
                widgetId: e.widgetId,
                widgetZoneId: e.widgetZoneId,
                htmlData: transData.nodes
              });
              that.setData({ htmls: olds });
              return;
            }
            util.request(api.Widgets + '/' + e.id).then(function (itemRes) {
              if (itemRes.success === true) {
                if (e.widgetId == 5
                  && itemRes.data
                  && itemRes.data.items
                  && itemRes.data.items.length > 0) {
                  let list = that.data.carouselWidgets;
                  list.push(itemRes.data);
                  that.setData({
                    carouselWidgets: list
                  });
                } else if (e.widgetId == 1) {
                  let list = that.data.categorys;
                  list.push(itemRes.data);
                  that.setData({
                    categorys: list
                  });
                }
                else if (e.widgetId == 3) {
                  let list = that.data.simplProducts;
                  list.push(itemRes.data);
                  that.setData({
                    simplProducts: list
                  });
                }
                else if (e.widgetId == 2) {
                  let list = that.data.products;
                  list.push(itemRes.data);
                  that.setData({
                    products: list
                  });
                }
              }
            });
          });
        });
      }
    });
  },
  onLoad: function (options) {
    this.getIndexData();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
})
