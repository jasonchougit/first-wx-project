// env.js
var wxCharts = require('../../utils/wxcharts-min.js')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalBandWidth:0,
    bandWidthUnit:'bps',
    allIndexes:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var envId = options.id;
    var envName = this.getEnvNameById(envId);
    // wx.setNavigationBarTitle()
    wx.setNavigationBarTitle({
      title: envName,
    })
    this.getShownData();
    this.getAllIndexes();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var windowWidth = 320;
    try{
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    }catch(e){
      console.error("get system info sync error!")
    }
    console.log(this.data);
    this.data.allIndexes.forEach(function(item){
      console.log(item);
      var ringChart = new wxCharts({
        animation: true,
        canvasId: item.canvasId,
        width:120,
        height:120,
        type: 'ring',
        title:{
          name:item.okNum+'/'+item.errNum,
          fontSize:13,
          offsetX:2
        },
        extra: {
          ringWidth: 10,
          pie: {
            offsetAngle: -45
          }
        },
        series: [{
          name: '正常',
          data: item.okNum,
          stroke: false
        }, {
          name: '故障',
          data: item.errNum,
          stroke: false
        }],
        disablePieStroke: true,
        dataLabel: false,
        legend: false,
      });
      ringChart.addEventListener('renderComplete', () => {
        console.log('renderComplete');
      });
      setTimeout(() => {
        ringChart.stopAnimation();
      }, 500);
    })
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  redirectToServer: function(){
    wx.redirectTo({
      url: '/pages/equipment/server?serial_number=abc',
    })
  },

  getEnvNameById: function(id){
    var envMap = {
      0: '省网出口',
      1:'缓存出口',
      2: 'IDC出口',
      3: '省内出口',
      4: '城域网出口'
    }
    return envMap[id];
  },

  touchHandler: function (e) {
    console.log(ringChart.getCurrentDataIndex(e));
  },

  getShownData: function(){
    var that = this;
    var bandWidth = util.transformUnit(10000000);
    console.log(bandWidth);
    that.setData({
      totalBandWidth:bandWidth.val,
      bandWidthUnit:bandWidth.unit
    })
  },
  getAllIndexes: function(){
    var that = this;
    that.setData({
      allIndexes:[{
        id:0,
        canvasId:'linkRing',
        name:'链路数',
        okNum: 10,
        errNum: 2
      },{
          id: 1,
          canvasId: 'tmaRing',
          name: '探针数',
          okNum: 4,
          errNum: 1
      },{
          id: 2,
          canvasId: 'serverRing',
          name: '采集服务器数',
          okNum: 200,
          errNum: 10
      }]
    })
  }
})