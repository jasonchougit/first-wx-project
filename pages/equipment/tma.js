// tma.js
var app = getApp();
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
    idcList: [],
    rackList: [],
    envList: [],
    roleList: [],
    modalTitle: '',
    curServerItem: {},
    curIdcId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //var that = this;
    var serialNumber = options.serial_number || '';
    var ipAddr = options.ipAddr || '';
    this.setData({
      serialNumber: serialNumber,
      ipAddr: ipAddr,
    });
    this.getServerInfo(serialNumber);
    //console.log(idcList[0].id);
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
    console.log(serialNumber);
    var that = this;
    wx.request({
      url: 'https://pmweb.haohandata.com:8181/pmweb/api/equipment/detail',
      data: {
        equipmentId: serialNumber
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log("res");
        console.log(res);
        var serverItem = {};
        serverItem.idcName = res.data.idcName || '';
        serverItem.idcId = res.data.idcId || '';
        serverItem.rack = res.data.rack || '';
        serverItem.envName = res.data.envName || '';
        var statusName = res.data.equipmentStatus || '';
        serverItem.status = that.getStatusName(statusName);
        serverItem.role = res.data.role || '';
        that.setData({
          curServerItem: serverItem,
          curIdcId: serverItem.idcId
        });
        that.refreshAttrList(serverItem);
        console.log("curServerItem");
        console.log(that.data.curServerItem);
      },
      fail: function () {
        console.log('error');
      }
    })
    //return wx.getStorageSync("serverInfo") || {};
  },

  refreshAttrList: function (serverItem) {
    var that = this;
    var attrList = [{
      key: '机房',
      logo: '/img/idc.png',
      index: 'idcName',
      List: 'idcList'
    }, {
      key: '机架',
      logo: '/img/rack.png',
      index: 'rack',
      List: 'rackList'
    }, {
      key: '部署链路',
      logo: '/img/signal.png',
      index: 'envName',
      List: 'envList'
    }, {
      key: '设备状态',
      logo: '/img/status.png',
      index: 'status',
      List: 'statusList'
    }, {
      key: '服务器角色',
      logo: '/img/role.png',
      index: 'role',
      List: 'roleList'
    }];
    attrList.map(function (d) {
      if (d.index === 'envName') {
        var envname = serverItem[d.index];
        var envNameList = that.data.curServerItem.envName;
        if (envNameList.length > 0) {
          envname = '';
          if (envNameList.length < 3) {
            for (var i = 0; i < envNameList.length; i++) {
              envname += envNameList[i] + ' '
            }
          } else {
            envname = envNameList[0] + envNameList[1] + '等';
          }
        }
        d.value = envname;
      } else {
        d.value = serverItem[d.index];
      }
    });

    that.setData({
      attrList: attrList
    });
  },

  clickToEdit: function (e) {
    var that = this;
    var curProjectid = app.globalData.currentProjectId;
    console.log("project_id" + curProjectid);
    var listName = e.currentTarget.dataset.item.List;
    var listKey = e.currentTarget.dataset.item.key;
    var projectOption = {
      curProjectid: curProjectid,
      listName: listName,
      listKey: listKey
    };
    switch (listName) {
      case "idcList":
        that.getIdcList(projectOption);
        break;
      case "rackList":
        that.getRackList(projectOption);
        break;
      case "envList":
        that.getEnvList(projectOption);
        break;
      case "statusList":
        that.getStatusList(projectOption);
        break;
      case "roleList":
        that.getRoleList(projectOption);
        break;
      default:
        console.log("error");
    }
  },

  /**
   * 根据project_id获取idc机房列表
   */
  getIdcList: function (projectOption) {
    var that = this;
    var curProjectid = projectOption.curProjectid;
    var serverItem = that.data.curServerItem;
    var curIdcId = '';
    wx.request({
      url: 'https://pmweb.haohandata.com:8181/pmweb/api/idc/equipment',
      data: {
        //project_id: curProjectid
        project_id: 22
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log("idcList");
        console.log(res.data);
        var idcList = [];
        res.data.forEach(function (d) {
          var idclist = {};
          //console.log(d.idcName);
          if (d.idcName && d.idcId) {
            idclist.id = d.idcId;
            curIdcId = d.idcId;
            idclist.name = d.idcName;
            idcList.push(idclist);
          }
        });
        idcList.map(function (d) {
          d.checked = serverItem.idcName === d.name ? true : false;
        });
        console.log("idcList");
        console.log(idcList);
        that.setData({
          idcList: idcList,
          curIdcId: curIdcId
        });
        that.setOption(projectOption);
      }
    });
  },

  /**
   * 根据所选机房idc_id获取机架列表
   */
  getRackList: function (projectOption) {
    var that = this;
    var serverItem = that.data.curServerItem;
    var curIdcId = that.data.curIdcId;
    wx.request({
      url: 'https://pmweb.haohandata.com:8181/pmweb/api/rack/idc',
      data: {
        //idc_id: curIdcId
        idc_id: 23
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log("rackList");
        console.log(res.data);
        var rackList = [];
        res.data.forEach(function (d) {
          var racklist = {};
          if (d.id && d.name) {
            racklist.id = d.id;
            racklist.name = d.name;
            rackList.push(racklist);
          }
        });
        rackList.map(function (d) {
          d.checked = serverItem.rack === d.name ? true : false;
        });
        console.log("rackList");
        console.log(rackList);
        that.setData({
          rackList: rackList
        });
        that.setOption(projectOption);
      }
    });
  },

  /**
   * 获取部署链路列表(多选)
   */
  getEnvList: function (projectOption) {
    var that = this;
    var serverItem = that.data.curServerItem;
    wx.request({
      url: 'https://pmweb.haohandata.com:8181/pmweb/api/equipmentdeploylinktype',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log("envList");
        console.log(res.data);
        var envList = [];
        res.data.forEach(function (d) {
          var envlist = {};
          if (d.id && d.name) {
            envlist.id = d.id;
            envlist.name = d.name;
            envList.push(envlist);
          }
        });
        envList.map(function (d) {
          var len = serverItem.envName.length;
          var c = 0;
          for (var i = 0; i < len; i++) {
            if (d.name === serverItem.envName[i]) {
              c = 1;
            }
          }
          if (c > 0) {
            d.checked = true;
          } else {
            d.checked = false;
          }
        });
        console.log("envList");
        console.log(envList);
        that.setData({
          envList: envList
        });
        that.setOption(projectOption);
      }
    });
  },

  /**
   * 获取设备状态列表
   */
  getStatusList: function (projectOption) {
    var that = this;
    var serverItem = that.data.curServerItem;
    wx.request({
      url: 'https://pmweb.haohandata.com:8181/pmweb/api/equipmentstatus',
      header: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      success: function (res) {
        console.log("statusList");
        console.log(res.data);
        var statusList = [];
        res.data.forEach(function (d) {
          var statuslist = {};
          if (d.id && d.name) {
            statuslist.id = d.id;
            statuslist.name = d.name;
            statusList.push(statuslist);
          }
        });
        statusList.map(function (d) {
          d.checked = serverItem.status === d.name ? true : false;
        });
        console.log("statusList");
        console.log(statusList);
        that.setData({
          statusList: statusList
        });
        that.setOption(projectOption);
      }
    });
  },

  /**
   * 获取服务器角色列表
   */
  getRoleList: function (projectOption) {
    var that = this;
    var serverItem = that.data.curServerItem;
    wx.request({
      url: 'https://pmweb.haohandata.com:8181/pmweb/api/serverroletype',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log("roleList");
        console.log(res.data);
        var roleList = [];
        res.data.forEach(function (d) {
          var rolelist = {};
          if (d.id && d.name) {
            rolelist.id = d.id;
            rolelist.name = d.name;
            roleList.push(rolelist);
          }
        });
        roleList.map(function (d) {
          d.checked = serverItem.role === d.name ? true : false;
        });
        console.log("roleList");
        console.log(roleList);
        that.setData({
          roleList: roleList
        });
        that.setOption(projectOption);
      }
    });
  },

  setOption: function (item) {
    var that = this;
    var listName = item.listName;
    var listKey = item.listKey;

    if (listName === 'envList') {
      that.setData({
        modalTitle: '选择' + listKey,
        modalHidden: false,
        radioHidden: true,
        checkboxHidden: false,
        modalList: that.data[listName]
      })
    } else {
      that.setData({
        modalTitle: '选择' + listKey,
        modalHidden: false,
        radioHidden: false,
        checkboxHidden: true,
        modalList: that.data[listName]
      })
    }
  },

  getStatusName: function (statusname) {
    var StatusList = {
      1: '在用',
      2: '待用',
      3: '未用',
      4: '下线',
      5: '代理'
    };
    return StatusList[statusname];
  },

  confirm: function () {
    //demo中只能设置服务器状态字段
    var that = this;
    var envOption = [];
    that.data.statusList.forEach(function (d) {
      if (d.checked) {
        that.data.curServerItem.status = d.name;
      }
    });
    that.data.idcList.forEach(function (d) {
      if (d.checked) {
        that.data.curServerItem.idcName = d.name;
      }
    });
    that.data.rackList.forEach(function (d) {
      if (d.checked) {
        that.data.curServerItem.rack = d.name;
      }
    });
    console.log("that.data.envList");
    console.log(that.data.envList);
    that.data.envList.forEach(function (d) {
      if (d.checked) {
        envOption.push(d.name);
      }
    });
    console.log("envOption");
    console.log(envOption);
    
    that.data.curServerItem.envName = envOption;
    that.data.roleList.forEach(function (d) {
      if (d.checked) {
        that.data.curServerItem.role = d.name;
      }
    });
    wx.setStorageSync("serverInfo", that.data.curServerItem);
    that.refreshAttrList(that.data.curServerItem);
    that.setData({
      modalHidden: true
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
    var that = this;
    that.data.statusList.map(function (d) {
      d.checked = e.detail.value == d.id ? true : false;
    })
    that.data.idcList.map(function (d) {
      d.checked = e.detail.value == d.id ? true : false;
    })
    that.data.rackList.map(function (d) {
      d.checked = e.detail.value == d.id ? true : false;
    })
    that.data.roleList.map(function (d) {
      d.checked = e.detail.value == d.id ? true : false;
    })
  },
  /**
   * 多选框选择操作
   */
  checkboxgroupBindchange: function (e) {
    var that = this;
    var temp1 = e.detail.value
    console.log("temp1");
    console.log(temp1)
    //var temp2 = ''
    if (temp1.length > 0) {
      that.data.envList.map(function (d) {
        var a = 0;
        for (var i = 0; i < temp1.length; i++) {
          if (d.id == temp1[i]) {
            a = 1;
          }
        }
        if (a > 0) {
          d.checked = true;
        } else {
          d.checked = false;
        }
      })
      console.log("that.data.envList");
      console.log(that.data.envList);
    } else {
      that.data.envList.map(function (d) {
        d.checked = false;
      });
    }
  }

})