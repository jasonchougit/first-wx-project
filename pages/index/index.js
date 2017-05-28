//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '让运维变得简单',
    userInfo: {},
    animationData:{}
  },
  //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  onShow: function(){
    var animation = wx.createAnimation({
      duration:1000,
      transformOrigin:"50% 50% 0",
      timingFunction:"ease-in"
    });
    this.animation = animation;
    animation.scale(1.5,1.5).step();
    this.setData({
      animationData:animation.export()
    })
  },
  clickEnter:function(){
    // wx.redirectTo({
    //   url: '../dashboard/dashboard',
    // })
  }
})
