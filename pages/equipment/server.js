// server.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serialNumber: '',
    ipAddr: '',
    attrList: [],
    modalHidden: true,
    statusList: [],
    modalTitle: '',
    curServerItem: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var serialNumber = options.serial_number || '';
    var serverItem = this.getServerInfo(serialNumber);

    var attrList = this.refreshAttrList(serverItem);
    var statusList = [{
      id: 1,
      name: '在用'
    }, {
      id: 2,
      name: '待用'
    }, {
      id: 3,
      name: '下线'
    }];
    statusList.map(function (d) {
      d.checked = serverItem.status === d.name ? true : false;
    })
    this.setData({
      serialNumber: serialNumber,
      ipAddr: serverItem.ipAddr,
      attrList: attrList,
      statusList: statusList,
      curServerItem: serverItem
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  /**
   * 根据服务器序列号获取服务器信息
   */
  getServerInfo: function (serialNumber) {
    return wx.getStorageSync("serverInfo") || {};
  },

  refreshAttrList: function (serverItem) {
    var attrList = [{
      key: '机房',
      logo: '/img/idc.png',
      index: 'idcName'
    }, {
      key: '机架',
      logo: '/img/rack.png',
      index: 'rack'
    }, {
      key: '部署链路',
      logo: '/img/signal.png',
      index: 'envName'
    }, {
      key: '设备状态',
      logo: '/img/status.png',
      index: 'status'
    }, {
      key: '服务器角色',
      logo: '/img/role.png',
      index: 'role'
    }];
    attrList.map(function (d) {
      d.value = serverItem[d.index];
    });
    return attrList;
  },

  clickToEdit: function (e) {
    console.log(e);
    this.setData({
      modalTitle: '选择' + e.currentTarget.dataset.item.key,
      modalHidden: false
    })
  },

  confirm: function () {
    //demo中只能设置服务器状态字段
    var that = this;
    that.data.statusList.forEach(function (d) {
      if (d.checked) {
        that.data.curServerItem.status = d.name;
      }
    });
    wx.setStorageSync("serverInfo", that.data.curServerItem);
    var attrList = that.refreshAttrList(that.data.curServerItem);
    that.setData({
      modalHidden: true,
      attrList: attrList
    });
  },
  /**
   * 模态框取消按钮操作
   */
  cancel: function () {
    this.setData({
      modalHidden: true
    })
  },
  /**
   * 单选框选择操作
   */
  radioChange: function (e) {
    this.data.statusList.map(function (d) {
      d.checked = e.detail.value == d.id ? true : false;
    })
  }

})

