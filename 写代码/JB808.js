/* eslint-disable */
function RawToProtocol(fPort, bytes) {
  var EventType = {
    "Alert": "alert",
    "Fault": "fault",
    "Info": "info"
  };
  // 起始符
  var beginFlag = '7E';
  // 终止符
  var endFlag = '7E';
  // 消息转义
  var escapeFlag = '7D';
  // 0x0200 地理位置上报扩展字段
  var positionMap = [{
    name: 'unknown',
    title: '无特定位置',
    value: 0
  }, {
    name: 'circle',
    title: '圆形区域',
    value: 1
  }, {
    name: 'rectangular',
    title: '矩形区域',
    value: 2
  }, {
    name: 'polygon',
    title: '多边形区域',
    value: 3
  }, {
    name: 'road',
    title: '路段',
    value: 4
  }];
  // 加密方式
  // bit10-bit12，为加密标识符, 三位都是0 表示不加密，第10位为1 表示 RSA 算法加密，其他保留
  var EncryptMethod = {
    None: {
      cn: '未加密',
      en: 'none',
      value: 0
    },
    RSA: {
      cn: 'RSA加密',
      en: 'RSA',
      value: 1
    }
  };

  // CONCATENATED MODULE: ./src/jt808/constants/msgId.ts
  // 区分协议类型
  var MsgIdList = {
    '0x0001': {
      cn: '终端通用应答',
      en: 'Terminal universal reply',
      type: 'terminal',
      reply: ''
    },
    '0x8001': {
      cn: '平台通用应答',
      en: 'Platform Universal response',
      type: 'platform',
      reply: '0x0001'
    },
    '0x0002': {
      cn: '终端心跳',
      en: 'Terminal heart',
      type: 'terminal',
      reply: '0x8001'
    },
    '0x8003': {
      cn: '补传分包请求',
      en: 'Forwarding subcontract request',
      type: '',
      reply: ''
    },
    '0x0100': {
      cn: '终端注册',
      en: 'Terminal registration',
      type: 'terminal',
      reply: '0x8100'
    },
    '0x8100': {
      cn: '终端注册应答',
      en: 'Terminal registration reply',
      type: 'platform',
      reply: ''
    },
    '0x0003': {
      cn: '终端注销',
      en: 'Terminal logout',
      type: '',
      reply: ''
    },
    '0x0102': {
      cn: '终端鉴权',
      en: 'Terminal authentication',
      type: 'terminal',
      reply: '0x8001'
    },
    '0x8103': {
      cn: '设置终端参数',
      en: 'Setting Terminal Parameters',
      type: 'platform',
      reply: '0x0001'
    },
    '0x8104': {
      cn: '查询终端参数',
      en: 'Querying Terminal Parameters',
      type: 'platform',
      reply: '0x0104'
    },
    '0x0104': {
      cn: '查询终端参数应答',
      en: 'Query terminal parameter response',
      type: 'terminal',
      reply: ''
    },
    '0x8105': {
      cn: '终端控制',
      en: 'Terminal control',
      type: 'platform',
      reply: '0x0001'
    },
    '0x8106': {
      cn: '查询指定终端参数',
      en: 'Example Query specified terminal parameters',
      type: '',
      reply: ''
    },
    '0x8107': {
      cn: '查询终端属性',
      en: 'Querying Terminal Properties',
      type: 'platform',
      reply: '0x0107'
    },
    '0x0107': {
      cn: '查询终端属性应答',
      en: 'Query the response of the terminal properties',
      type: 'terminal',
      reply: ''
    },
    '0x8108': {
      cn: '下发终端升级包',
      en: 'Query terminal properties reply Deliver the terminal upgrade package',
      type: '',
      reply: ''
    },
    '0x0108': {
      cn: '终端升级结果通知',
      en: 'Terminal upgrade result notification',
      type: '',
      reply: ''
    },
    '0x0200': {
      cn: '位置信息汇报',
      en: 'Location information reporting',
      type: 'terminal',
      reply: '0x8001'
    },
    '0x8201': {
      cn: '位置信息查询',
      en: 'Location information query',
      type: '',
      reply: ''
    },
    '0x0201': {
      cn: '位置信息查询应答',
      en: 'Location information query response',
      type: '',
      reply: ''
    },
    '0x8202': {
      cn: '临时位置跟踪控制',
      en: 'Temporary position tracking control',
      type: '',
      reply: ''
    },
    '0x8203': {
      cn: '人工确认报警消息',
      en: 'Manually confirm the alarm message',
      type: '',
      reply: ''
    },
    '0x8300': {
      cn: '文本信息下发',
      en: 'Text message delivery',
      type: '',
      reply: ''
    },
    '0x8301': {
      cn: '事件设置',
      en: 'Event set',
      type: '',
      reply: ''
    },
    '0x0301': {
      cn: '事件报告',
      en: 'event report',
      type: '',
      reply: ''
    },
    '0x8302': {
      cn: '提问下发',
      en: 'Questions issued',
      type: '',
      reply: ''
    },
    '0x0302': {
      cn: '提问应答',
      en: 'Question answering',
      type: '',
      reply: ''
    },
    '0x8303': {
      cn: '信息点播菜单设置',
      en: 'Information on demand menu Settings',
      type: '',
      reply: ''
    },
    '0x0303': {
      cn: '信息点播/取消',
      en: 'Information on demand',
      type: '',
      reply: ''
    },
    '0x8304': {
      cn: '信息服务',
      en: 'Information service',
      type: '',
      reply: ''
    },
    '0x8400': {
      cn: '电话回拨',
      en: 'Back to the dial',
      type: '',
      reply: ''
    },
    '0x8401': {
      cn: '设置电话本',
      en: 'Set up a phone book',
      type: '',
      reply: ''
    },
    '0x8500': {
      cn: '车辆控制',
      en: 'Vehicle control',
      type: '',
      reply: ''
    },
    '0x0500': {
      cn: '车辆控制应答',
      en: 'Vehicle control response',
      type: '',
      reply: ''
    },
    '0x8600': {
      cn: '设置圆形区域',
      en: 'Set the circular area',
      type: '',
      reply: ''
    },
    '0x8601': {
      cn: '删除圆形区域',
      en: 'Delete circular area',
      type: '',
      reply: ''
    },
    '0x8602': {
      cn: '设置矩形区域',
      en: 'Set rectangle area',
      type: '',
      reply: ''
    },
    '0x8603': {
      cn: '删除矩形区域',
      en: 'Delete rectangular area',
      type: '',
      reply: ''
    },
    '0x8604': {
      cn: '设置多边形区域',
      en: 'Set polygon region',
      type: '',
      reply: ''
    },
    '0x8605': {
      cn: '删除多边形区域',
      en: 'Delete polygon area',
      type: '',
      reply: ''
    },
    '0x8606': {
      cn: '设置路线',
      en: 'Set the route',
      type: '',
      reply: ''
    },
    '0x8607': {
      cn: '删除路线',
      en: 'Delete the route',
      type: '',
      reply: ''
    },
    '0x8700': {
      cn: '行驶记录仪数据采集命令',
      en: 'Drive recorder data acquisition command',
      type: '',
      reply: ''
    },
    '0x0700': {
      cn: '行驶记录仪数据上传',
      en: 'Data upload from driving recorder',
      type: '',
      reply: ''
    },
    '0x8701': {
      cn: '行驶记录仪参数下传命令',
      en: 'Driving recorder parameters down command',
      type: '',
      reply: ''
    },
    '0x0701': {
      cn: '电子运单上报',
      en: 'Electronic waybill reporting',
      type: '',
      reply: ''
    },
    '0x0702': {
      cn: '驾驶员身份信息采集上报',
      en: 'Collect and report driver identity information',
      type: '',
      reply: ''
    },
    '0x8702': {
      cn: '上报驾驶员身份信息请求',
      en: 'Report driver identification request',
      type: '',
      reply: ''
    },
    '0x0704': {
      cn: '定位数据批量上传',
      en: 'Upload location data in batches',
      type: 'terminal',
      reply: '0x800'
    },
    '0x0705': {
      cn: 'CAN总线数据上传',
      en: 'CAN bus data upload',
      type: '',
      reply: ''
    },
    '0x0800': {
      cn: '多媒体事件信息上传',
      en: 'Upload multimedia event information',
      type: '',
      reply: ''
    },
    '0x0801': {
      cn: '多媒体数据上传',
      en: 'Multimedia Data upload',
      type: '',
      reply: ''
    },
    '0x8800': {
      cn: '多媒体数据上传应答',
      en: 'Reply to multimedia data upload',
      type: '',
      reply: ''
    },
    '0x8801': {
      cn: '摄像头立即拍摄命令',
      en: 'The camera immediately shoots the command',
      type: '',
      reply: ''
    },
    '0x0805': {
      cn: '摄像头立即拍摄命令应答',
      en: 'The camera immediately shoots the command reply',
      type: '',
      reply: ''
    },
    '0x8802': {
      cn: '存储多媒体数据检索',
      en: 'Store multimedia data retrieval',
      type: '',
      reply: ''
    },
    '0x0802': {
      cn: ' 存储多媒体数据检索应答 ',
      en: ' Store multimedia data retrieval replies',
      type: '',
      reply: ''
    },
    '0x8803': {
      cn: '存储多媒体数据上传',
      en: 'Store multimedia data upload',
      type: '',
      reply: ''
    },
    '0x8804': {
      cn: '录音开始命令',
      en: 'Recording Start Command',
      type: '',
      reply: ''
    },
    '0x8805': {
      cn: '单条存储多媒体数据检索上传命令',
      en: 'Single storage multimedia data retrieval upload command',
      type: '',
      reply: ''
    },
    '0x8900': {
      cn: '数据下行透传',
      en: 'Data is transmitted through downlink',
      type: '',
      reply: ''
    },
    '0x0900': {
      cn: '数据上行透传',
      en: 'Data is transparently transmitted upstream',
      type: '',
      reply: ''
    },
    '0x0901': {
      cn: '数据压缩上报',
      en: 'Data compression reporting',
      type: '',
      reply: ''
    },
    '0x8A00': {
      cn: ' 平台RSA公钥 ',
      en: ' Platform RSA Public Key  ',
      type: '',
      reply: ''
    },
    '0x0A00': {
      cn: ' 终端RSA公钥 ',
      en: ' Terminal RSA Public Key  ',
      type: '',
      reply: ''
    },
    '0x0004': {
      cn: ' 查询服务器时间请求 ',
      en: ' Queries server time requests',
      type: '',
      reply: ''
    },
    '0x8004': {
      cn: ' 查询服务器时间应答 ',
      en: ' Query the server time response',
      type: '',
      reply: ''
    },
    '0x0005': {
      cn: ' 终端补传分包请求 ',
      en: ' The terminal sends the subcontract request',
      type: '',
      reply: ''
    },
    '0x8204': {
      cn: ' 链路检测 ',
      en: ' Link detection',
      type: '',
      reply: ''
    },
    '0x8608': {
      cn: ' 查询区域或线路数据 ',
      en: ' Example Query area or line data',
      type: '',
      reply: ''
    },
    '0x0608': {
      cn: ' 查询区域或线路数据应答 ',
      en: ' Query area or line data reply',
      type: '',
      reply: ''
    }
  };
  // 基础信息说明表 ,长度基于WORD = 2 BYTE = 0.5 DWORD = BCD[2]
  var baseNameMap = {
    alarm: {
      name: 'alarm',
      title: '报警标志',
      len: 4,
      note: ''
    },
    status: {
      name: 'status',
      title: '车辆状态标志',
      len: 4,
      note: ''
    },
    latitude: {
      name: 'latitude',
      title: '纬度',
      len: 4,
      note: '以度为单位的纬度值乘以 10 的 6 次方，精确到百万分之一度 '
    },
    longitude: {
      name: 'longitude',
      title: '经度',
      len: 4,
      note: '以度为单位的纬度值乘以 10 的 6 次方，精确到百万分之一度 '
    },
    altitude: {
      name: 'altitude',
      title: '高程',
      len: 2,
      note: '海拔高度，单位为米（m）'
    },
    speed: {
      name: 'speed',
      title: '速度',
      len: 2,
      note: '1/10 km/h '
    },
    direction: {
      name: 'direction',
      title: '方向',
      len: 2,
      note: '0-359 ，正北为 0，顺时针 '
    },
    time: {
      name: 'time',
      title: '时间',
      len: 6,
      note: 'YY-MM-DD-hh-mm-ss（GMT+8 时间，本标准中之后涉及的时间均采用此时区）'
    }
  };
  // 扩展信息字符长度表 ID = 1 BYTE = 长度是N
  var baseExtendsMap = {
    '0x01': {
      name: 'mileage',
      title: '里程',
      len: 4,
      note: '里程，DWORD，1/10km，对应车上里程表读数'
    },
    '0x02': {
      name: 'fuel',
      title: '油量',
      len: 2,
      note: '油量 1/10L，对应车上油量表读数'
    },
    '0x03': {
      name: 'velocity',
      title: '速度',
      len: 2,
      note: '行驶记录功能获取的速度 1/10 km/h'
    },
    '0x04': {
      name: 'alarm_event_id',
      title: '报警事件ID',
      len: 2,
      note: '人工确认报警事件ID 从 1 开始计数'
    },
    // 0x05-0x10 保留
    '0x11': {
      name: 'over_speed_alarm',
      title: '超速报警附加信息',
      len: 1,
      note: '超速报警附加信息;表28'
    },
    '0x12': {
      name: 'direction_alarm',
      title: '进出区域/路线报警附加信息',
      len: 6,
      note: '进出区域/路线报警附加信息;表29'
    },
    '0x13': {
      name: 'drive_road',
      title: '行驶附加信息',
      len: 7,
      note: '路段行驶时间不足/过长报警附加信息;表30'
    },
    // 0x14-0x24 保留
    '0x25': {
      name: 'car_signal_status',
      title: '车辆信号灯状态',
      len: 4,
      note: '扩展车辆信号状态位，定义见表31'
    },
    '0x2A': {
      name: 'io_status',
      title: 'IO状态位',
      len: 2,
      note: '0位1：深度休眠状态，1位1：休眠状态，2-15 保留'
    },
    '0x2B': {
      name: 'analog',
      title: '模拟量',
      len: 4,
      note: '模拟量，bit0-15，AD0；bit16-31，AD1。'
    },
    '0x30': {
      name: 'wireless_signal_strength',
      title: '无线通信网络信号强度',
      len: 1,
      note: '无线通信网络信号强度'
    },
    '0x31': {
      name: 'gnns_satellite',
      title: '定位卫星数',
      len: 1,
      note: 'BYTE，GNSS 定位卫星数'
    },
    '0xE0': {
      name: 'self_info',
      title: '自定义信息',
      len: 1,
      note: '后续自定义信息长度'
    }
  };
  // 0x0200 所有扩展信息
  var extendsMap = baseExtendsMap;
  // 2019版本 扩展字段信息
  var JT8080x0200Extent2019Map = {
    '0x05': {
      len: 30,
      name: 'tire_pressure',
      title: '胎压'
    },
    '0x06': {
      len: 2,
      name: 'car_temperature',
      title: '车厢温度'
    },
    '0x07': {
      len: 4,
      name: 'satellite_state',
      title: '卫星状态'
    }
  };
  // CONCATENATED MODULE: ./src/jt808/constants/alarm.ts
  // 报警标志
  var AlarmSignList = [{
    name: 'emergency_alarm',
    cn: '紧急报警_触动报警开关后触发',
    en: 'The emergency alarm is triggered after the alarm switch is touched'
  }, {
    name: 'overspeed_alarm',
    cn: '超速报警,标志维持至报警条件解除',
    en: 'Over Speed alarm'
  }, {
    name: 'fatigue_driving',
    cn: '疲劳驾驶,标志维持至报警条件解除',
    en: 'fatigue driving'
  }, {
    name: 'danger_warning',
    cn: '危险预警,标志维持至报警条件解除',
    en: 'danger warning'
  }, {
    name: 'gnss_module_fault',
    cn: 'GNSS模块发生故障,标志维持至报警条件解除',
    en: 'The GNSS module is faulty'
  }, {
    name: 'gnss_ant_not_connected',
    cn: 'GNSS天线未接或被剪断,标志维持至报警条件解除',
    en: 'The GNSS antenna is not connected or cut off'
  }, {
    name: 'gnss_ant_short',
    cn: 'GNSS天线短路,标志维持至报警条件解除',
    en: 'GNSS antenna short-circuited  '
  }, {
    name: 'terminal_main_power_undervoltage',
    cn: '终端主电源欠压,标志维持至报警条件解除',
    en: 'The main power supply of the terminal is undervoltage'
  }, {
    name: 'terminal_main_power_down',
    cn: '终端主电源掉电,标志维持至报警条件解除',
    en: 'The main power supply of the terminal fails'
  }, {
    name: 'terminal_display_fault',
    cn: '终端LCD或显示器故障,标志维持至报警条件解除',
    en: 'The LCD or monitor of the terminal is faulty'
  }, {
    name: 'tts_module_fault',
    cn: 'TTS模块故障,标志维持至报警条件解除',
    en: 'The TTS module is faulty  '
  }, {
    name: 'camera_fault',
    cn: '摄像头故障,标志维持至报警条件解除',
    en: 'Camera fault'
  }, {
    name: 'road_ic_card_module_fault',
    cn: '道路运输证IC卡模块故障,标志维持至报警条件解除',
    en: 'The IC card module of the road transport certificate is faulty'
  }, {
    name: 'overspeed_warning',
    cn: '超速预警,标志维持至报警条件解除',
    en: 'Over speed warning'
  }, {
    name: 'fatigue_driving_warning',
    cn: '疲劳驾驶预警,标志维持至报警条件解除',
    en: 'Fatigue driving warning'
  }, {
    name: 'reserve1',
    cn: '保留1',
    en: 'reserve1'
  }, {
    name: 'reserve2',
    cn: '保留2',
    en: 'reserve2'
  }, {
    name: 'reserve3',
    cn: '保留3',
    en: 'reserve3'
  }, {
    name: 'day_accumulated_driving_timeout',
    cn: '当天累计驾驶超时,标志维持至报警条件解除',
    en: 'Accumulated driving overtime that day'
  }, {
    name: 'timeout_parking',
    cn: '超时停车,标志维持至报警条件解除',
    en: 'Timeout parking'
  }, {
    name: 'in_area',
    cn: '进出区域 收到应答后清零',
    en: 'In and out of the area'
  }, {
    name: 'in_route',
    cn: 'out of the area',
    en: '进出路线 收到应答后清零'
  }, {
    name: 'road_driving_time_insufficient',
    cn: '路段行驶时间不足或过长 收到应答后清零',
    en: 'Road section driving time is insufficient or too long'
  }, {
    name: 'route_deviation_alarm',
    cn: '路线偏离报警,标志维持至报警条件解除',
    en: 'Route deviation alarm'
  }, {
    name: 'vehicle_vss_fault',
    cn: '车辆VSS故障,标志维持至报警条件解除',
    en: 'VSS of the vehicle is faulty'
  }, {
    name: 'vehicle_fuel_abnormal',
    cn: '车辆油量异常,标志维持至报警条件解除',
    en: 'Abnormal vehicle fuel level'
  }, {
    name: 'vehicle_stolen',
    cn: '车辆被盗通过车辆防盗器,标志维持至报警条件解除',
    en: 'The vehicle is stolen'
  }, {
    name: 'vehicle_illegal_ignition',
    cn: '车辆非法点火',
    en: 'Illegal ignition of vehicles'
  }, {
    name: 'vehicle_illegal_displacement',
    cn: '车辆非法位移 收到应答后清零',
    en: 'Illegal displacement of vehicle'
  }, {
    name: 'collision_warning',
    cn: '碰撞预警,标志维持至报警条件解除',
    en: 'collision Warning'
  }, {
    name: 'rollover_warning',
    cn: '侧翻预警,标志维持至报警条件解除',
    en: 'rollover warning'
  }, {
    name: 'illegal_opening_door_alarm',
    cn: '非法开门报警（终端未设置区域时，不判断非法开门） 收到应答后清零',
    en: 'Illegal door opening alarm'
  }, ];

  // CONCATENATED MODULE: ./src/jt808/constants/carStatus.ts
  // 车辆状态
  var CarStatusList = [{
    name: 'acc_open',
    cn: 'ACC开关',
    en: 'The ACC switch',
    note: 'ACC 关；1： ACC 开 ',
    id: 'bit0'
  }, {
    name: 'location',
    cn: '定位状态',
    en: 'location',
    note: '0：未定位；1：定位',
    id: 'bit01'
  }, {
    name: 'latitude',
    cn: '纬度',
    en: 'latitude',
    note: '0：北纬；1：南纬',
    id: 'bit02'
  }, {
    name: 'longitude',
    cn: '经度',
    en: 'longitude',
    note: '0：东经；1：西经',
    id: 'bit03'
  }, {
    name: 'operation_state',
    cn: '运营状态',
    en: 'Operation state',
    note: '0：运营状态；1：停运状态',
    id: 'bit04'
  }, {
    name: 'lat_lng_encrypt',
    cn: '经纬度加密状态',
    en: 'Latitude and longitude are encrypted state',
    note: '0：经纬度未经保密插件加密；1：经纬度已经保密插件加密 ',
    id: 'bit05'
  }, {
    name: 'b1',
    cn: '保留1',
    en: 'backup1',
    note: '',
    id: 'bit06'
  }, {
    name: 'b2',
    cn: '保留2',
    en: 'backup2',
    note: '',
    id: 'bit07'
  }, {
    name: '',
    cn: '无',
    en: 'null'
  }, {
    name: 'mount_status',
    cn: '挂载状态',
    en: 'vehicle mount_status',
    children: [{
      name: 'empty_load',
      cn: '空车',
      en: 'empty_load',
      value: '00'
    }, {
      name: 'half_load',
      cn: '半载',
      en: 'half_load',
      value: '01'
    }, {
      name: 'retain',
      cn: '保留1',
      en: 'retain',
      value: '10'
    }, {
      name: 'full_load',
      cn: '满载',
      en: 'full load',
      value: '11'
    }, ],
    preLink: 1,
    id: 'bit[8-9]'
  }, {
    name: 'vehicle_fuel_line_disconnected',
    cn: '车辆油路状态',
    en: 'The fuel line of the vehicle is disconnected',
    note: '0：车辆油路正常；1：车辆油路断开',
    id: 'bit10'
  }, {
    name: 'vehicle_circuit_disconnection',
    cn: '车辆电路状态',
    en: 'Vehicle circuit disconnection',
    note: '0：车辆电路正常；1：车辆电路断开',
    id: 'bit11'
  }, {
    name: 'door_lock',
    cn: '车门加锁',
    en: 'The door lock',
    note: '0：车门解锁；1：车门加锁 ',
    id: 'bit12'
  }, {
    name: 'front_door_open',
    cn: '前门1状态',
    en: 'The front door open',
    note: '0：门关, 1：门开（前门 1 ）',
    id: 'bit13'
  }, {
    name: 'door_opened',
    cn: '中门2状态',
    en: 'The door opened',
    note: '0：门关；1：门开（中门2） ',
    id: 'bit14'
  }, {
    name: 'back_door_open',
    cn: '后门3状态',
    en: 'The back door open',
    note: '0：门关；1：门开（后门3）',
    id: 'bit15'
  }, {
    name: 'drivers_seat_door_open',
    cn: '驾驶席门状态',
    en: 'The driver seat door is open',
    note: '0：门关；1：门开（驾驶席门4） ',
    id: 'bit16'
  }, {
    name: 'custom_door',
    cn: '自定义门5',
    en: 'custom_door',
    note: '0：门关；1：门开（自定义门5）',
    id: 'bit17'
  }, {
    name: 'used_gps',
    cn: 'GPS卫星进行定位',
    en: 'GPS satellites are used for positioning',
    note: '0：未使用 GPS 卫星进行定位；1：使用 GPS 卫星进行定位 ',
    id: 'bit18'
  }, {
    name: 'used_beidou',
    cn: '北斗卫星进行定位',
    en: 'Beidou satellites were used for positioning',
    note: '0：未使用北斗卫星进行定位；1：使用北斗卫星进行定位 ',
    id: 'bit19'
  }, {
    name: 'used_glonass',
    cn: 'GLONASS卫星进行定位',
    en: 'GLONASS satellite was used for positioning  ',
    note: '0：未使用 GLONASS 卫星进行定位；1：使用 GLONASS 卫星进行定位',
    id: 'bit20'
  }, {
    name: 'used_galileo',
    cn: 'Galileo卫星进行定位',
    en: 'Galileo satellite is used for positioning  ',
    note: '0：未使用 Galileo 卫星进行定位；1：使用 Galileo 卫星进行定位',
    id: 'bit21'
  }, {
    name: 'b3',
    cn: '保留3',
    en: 'backup3',
    note: '',
    id: 'bit22'
  }, {
    name: 'b4',
    cn: '保留4',
    en: 'backup4',
    note: '',
    id: 'bit23'
  }, {
    name: 'b5',
    cn: '保留5',
    en: 'backup5',
    note: '',
    id: 'bit24'
  }, {
    name: 'b6',
    cn: '保留6',
    en: 'backup6',
    note: '',
    id: 'bit25'
  }, {
    name: 'b7',
    cn: '保留7',
    en: 'backup7',
    note: '',
    id: 'bit26'
  }, {
    name: 'b8',
    cn: '保留8',
    en: 'backup8',
    note: '',
    id: 'bit27'
  }, {
    name: 'b9',
    cn: '保留9',
    en: 'backup9',
    note: '',
    id: 'bit28'
  }, {
    name: 'b10',
    cn: '保留10',
    en: 'backup10',
    note: '',
    id: 'bit29'
  }, {
    name: 'b11',
    cn: '保留11',
    en: 'backup11',
    note: '',
    id: 'bit30'
  }, {
    name: 'b12',
    cn: '保留12',
    en: 'backup12',
    note: '',
    id: 'bit31'
  }, ];

  var locationMap = [{
    name: 'INT',
    title: '初始化',
    value: 0
  }, {
    name: 'SINGLE',
    title: '单点解',
    value: 1
  }, {
    name: 'DGPS',
    title: '伪距差分',
    value: 2
  }, {
    name: 'PPS',
    title: '精密定位',
    value: 3
  }, {
    name: 'FIX',
    title: '固定解',
    value: 4
  }, {
    name: 'FlOAT',
    title: '浮点解',
    value: 5
  }, {
    name: 'ESTIMATED',
    title: '航位推算',
    value: 6
  }, {
    name: 'MANUAL',
    title: '手动输入',
    value: 7
  }, {
    name: 'SIMULATED',
    title: '模拟',
    value: 8
  }, {
    name: 'UNKNOWN',
    title: '未知状态',
    value: 9
  }];
  var AlarmLevel = [{
    name: 'normal',
    title: '正常',
    value: 0
  }, {
    name: 'light',
    title: '轻度告警',
    value: 1
  }, {
    name: 'serious',
    title: '严重告警',
    value: 3
  }];
  // 中铁扩展字段注解
  var JT8080x0200extent_zt_map = {
    '0x05': {
      byte: 4,
      name: 'alarm',
      title: '报警信息',
      note: '终端报警保留位'
    },
    '0xE1': {
      len: 2,
      name: 'gga_location',
      title: 'GGA高精度定位',
      note: 'GGA高精度定位状态，即解状态 enum[0-9]'
    },
    '0xE2': {
      len: 2,
      name: 'power_ratio',
      title: '电量比',
      note: '电量百分比。取值范围0~100，步长0.01，单位%'
    },
    '0xE3': {
      len: 4,
      name: 'boot_time_stamp',
      title: '开机时间戳',
      note: '开机时间戳。INT类型的UTC时间戳（秒）'
    },
    '0xE4': {
      len: 2,
      name: 'location_type',
      title: '定位方式',
      note: '定位方式。0-卫星定位；1-蜂窝接入网络；2-WiFi接入网络'
    },
    '0xE8': {
      len: 4,
      name: 'sdk_code',
      title: '差分 SDK 状态码',
      note: '差分 SDK 状态码。16 位整数 '
    },
    '0xE9': {
      len: 0,
      name: 'retain1',
      title: '保留1',
      note: '保留位1，暂不定义'
    },
    '0xEA': {
      len: 2,
      name: 'charging',
      title: '充电状态',
      note: '充电状态。0-未充电；1-充电中 '
    },
    '0xEB': {
      len: 2,
      name: 'video_state',
      title: 'GB28181视频登录状态',
      note: 'GB28181视频登录状态。0-未登录；1-登录'
    },
    '0xEC': {
      len: 8,
      name: 'storage',
      title: '存储',
      note: '存储。步长1，单位byte'
    },
    '0xED': {
      len: 2,
      name: 'heart_rate',
      title: '心率',
      note: '心率。取值范围60~120，步长1，单位次/分'
    },
    '0xEE': {
      len: 2,
      name: 'blood_oxygen',
      title: '血氧',
      note: '血氧。取值范围0~100，步长1，单位%'
    },
    '0xEF': {
      len: 2,
      name: 'device_state',
      title: '设备状态',
      note: '设备状态。1-静止；2-怠速；3-运动；4-错误'
    },
    '0xF0': {
      len: 2,
      name: 'satellite_link',
      title: '搜星数',
      note: '搜星数。数值范围：0~100。初始值：0。步长：1。'
    },
    '0xF1': {
      len: 2,
      name: 'locate_direction',
      title: '高精度定向',
      note: '高精度定向状态。状态定义enum [0-9]'
    },
    '0xF2': {
      len: 4,
      name: 'x_gauss',
      title: '高斯坐标X轴',
      note: '数值范围：-6553600~6553600。初始值：0。步长：1。单位：米'
    },
    '0xF3': {
      len: 4,
      name: 'y_gauss',
      title: '高斯坐标X轴',
      note: '数值范围：-6553600~6553600。初始值：0。步长：1。单位：米'
    },
    '0xF4': {
      len: 4,
      name: 'device_sn',
      title: '设备标识码',
      note: '设备的唯一标识，可以是序列号、MAC地址、IMEI等具备唯一性的字符，最长不超过15个字符'
    },
    '0xF5': {
      len: 2,
      name: 'health_time',
      title: '健康数据UTC时间戳',
      note: '健康数据UTC时间戳（秒）'
    },
    '0xF6': {
      len: 2,
      name: 'hear_rate_alarm',
      title: '心率报警级别',
      note: '数值范围：0,1,3。初始值：0,单位：报警级别（0正常，1轻度，3重度）'
    },
    '0xF7': {
      len: 2,
      name: 'blood_oxygen_alarm',
      title: '血氧告警级别',
      note: '数值范围：0,1,3。初始值：0,单位：报警级别（0正常，1轻度，3重度）'
    },
    '0xF8': {
      len: 2,
      name: 'attention',
      title: '注意力',
      note: '数值范围：0-100 初始值：0。步长：1。单位：%'
    },
    '0xF9': {
      len: 2,
      name: 'attention_alarm',
      title: '注意力报警级别',
      note: '数值范围：0,1,3。初始值：0,单位：报警级别（0正常，1轻度，3重度）'
    },
    '0xFA': {
      len: 2,
      name: 'fatigue',
      title: '疲劳度',
      note: '数值范围：0-100 初始值：0。步长：1。单位：%'
    },
    '0xFB': {
      len: 2,
      name: 'fatigue_alarm',
      title: '疲劳度报警级别',
      note: '数值范围：0,1,3。初始值：0,单位：报警级别（0正常，1轻度，3重度）'
    },
    '0xFC': {
      len: 2,
      name: 'vertigo',
      title: '眩晕度',
      note: '数值范围：0-100 初始值：0。步长：1。单位：%'
    },
    '0xFD': {
      len: 2,
      name: 'vertigo_alarm',
      title: '眩晕度报警级别',
      note: '数值范围：0,1,3。初始值：0,单位：报警级别（0正常，1轻度，3重度）'
    },
    '0xFE': {
      len: 2,
      name: 'retain2',
      title: '保留2',
      note: ''
    },
    '0xFF': {
      len: 2,
      name: 'retain3',
      title: '保留3',
      note: ''
    }
  };
  var hexStringToHex = function (str) {
    var res = [];
    var pre = '';
    // 去除非十六进制字符：将字符串拆分为单个字符的数组：遍历字符数组并两两分组：
    ((str).replace(/\W/g, '').split('') || []).forEach(function (item, index) {
      if (index % 2 == 0) {
        pre = (item).toLocaleUpperCase();
      } else {
        res.push(pre + (item).toLocaleUpperCase());
        pre = '';
      }
    });
    return res;
  };
  // array buffer 转 hex string
  //   var arrayBufferToHex = function(buffer) {
  //     var hexArr = Array.prototype.map.call(new Uint8Array(buffer), function(bit) {
  //       return "00" + bit.toString(16).slice(-2);
  //     });
  //     return hexArr.join('');
  //   };
  // 16进制转十进制
  var hexToDecimal = function (hex) {
    return parseInt(/0x/i.test("" + hex) ? "" + hex : "0x" + hex, 16);
  };
  // 十进制转16进制
  var DecimalToHex = function (num) {
    return num.map(function (i) {
      var hex = (i).toString(16);
      return (hex.length % 2 == 1) ? "0" + hex : hex;
    });
  };
  // 16 进制转二进制
  var hexToBinary = function (hexStr) {
    var hex = hexStr.replace(/\W/g, '').replace(/^0x/gi, '');
    var res = ("00000000" + parseInt(hex.slice(0, 2), 16).toString(2)).substr(-8);
    if (hex.length > 2) {
      return res + hexToBinary(hexStr.slice(2 - hex.length));
    }
    return res;
  };
  // 0-255 的十进制转 2进制
  //   var DecimalToBinary = function(num) {
  //     return ("00000000" + parseInt(num, 10).toString(2)).substr(-8);
  //   };
  var DataTypeExplain = function (data) {
    if (typeof data == 'string' && /^7e(.*)7e$/i.test(data)) {
      return data;
    }
    // decimal array
    if (Array.isArray(data) && /[0-9]/g.test(data.join(''))) {
      var list = DecimalToHex(data);
      return list.join('');
    }
    // TODO base 64
    return false;
  };

  var JT808DataEscape = function (HexStringArray, encodeFlag) {
    // 发送转义
    if (encodeFlag) {
      return JT808DataEncode(HexStringArray);
    }
    return JT808DataDecode(HexStringArray);
  };
  // 数据转义后传输
  var JT808DataEncode = function (dataArr) {
    var res = ['7E'];
    var len = dataArr.length;
    dataArr.forEach(function (item, index) {
      // 对于消息体中的内容转义
      if (index > 0 && index < len) {
        if (item == beginFlag) {
          res.push(escapeFlag);
          res.push('02');
        } else if (item == escapeFlag) {
          res.push(escapeFlag);
          res.push('01');
        } else {
          res.push(item);
        }
      } else {
        res.push(item);
      }
    });
    res.push('7E')
    return res;
  };
  // 接收消息转义还原
  var JT808DataDecode = function (dataArr) {
    var res = [];
    var len = dataArr.length;
    var preCharState = false;
    if (dataArr[0] != beginFlag && dataArr[len - 1] != endFlag) {
      throw 'message format error';
    }
    // 解密转义
    for (var i = 1; len > 2 && i < len - 1; i++) {
      var item = String(dataArr[i]).toLocaleUpperCase();
      if (item == escapeFlag) {
        preCharState = true; // 标记字符匹配，待后续解析
      } else {
        if (preCharState && item == '02') {
          res.push(beginFlag);
        } else if (preCharState && item == '01') {
          res.push(escapeFlag);
        } else if (preCharState) {
          // 通用解析，非匹配格式内容维持原样
          res.push(escapeFlag);
          res.push(item);
        } else {
          res.push(item);
        }
        preCharState = false;
      }
    }
    return res;
  };

  // 输入数据的方式
  // 7e0100002e017e  ;hex String 需要分隔成 hex array
  // 7e 01 00 00 2e 01 7e ;hex string array
  // [126, 1, 0, 0, 46, 1, 126]
  // 126, 1, 0, 0, 46, 1, 126
  // 数据类型转换
  var DataTypeExplain = function (data) {
    if (typeof data == 'string' && /^7e(.*)7e$/i.test(data)) {
      return data;
      // const hex = hexStringToHex(data) || [];
      // return hex.map(function(i){ return hexToDecimal(i)});
    }
    // decimal array
    if (Array.isArray(data) && /[0-9]+/g.test(data.join(''))) {
      // 十进制砖16进制，字符串数组
      var list = DecimalToHex(data);
      return list.join('');
    }
    // hex array
    // TODO base 64
    return false;
  };
  var getBinaryOfIndex = function (value, index) {
    if (typeof value == 'number') {
      return (1 << index) & value;
    }
    return String(value).slice(index, index + 1);
  };
  var BCD8421ToDecimal = function (num, fromType) {
    if (fromType == 'hex') {
      return BCD8421ToDecimal(hexToBinary(num), 'bin');
    }
    var res = '';
    var len = num.length;
    num.split('').forEach(function (item, index) {
      res += item;
      if (index % 4 == 3 && index < len - 1) {
        res += ',';
      }
    });
    var list = res.split(',');
    return list;
  };

  // CONCATENATED MODULE: ./src/jt808/utils/utils.ts
  function chk8xor(byteArray) {
    var checksum = 0x00;
    for (var i = 0; i < byteArray.length - 1; i++)
      checksum ^= byteArray[i];
    return checksum;
  }
  /**
   * @name 对象深度拷贝
   * @param obj 过滤对象
   * @param filter 是否过滤_开头的私有属性
   * @returns
   */
  var deepClone = function (obj, isNeedFilter) {
    var filter = isNeedFilter || false;
    var objClone = Array.isArray(obj) ? [] : {};
    if (obj != undefined && typeof obj == 'object') {
      Object.keys(obj).forEach(function (key) {
        // 是否过滤私有属性，以下划线开头的属性过滤
        var isFilter = filter && /^_\w+/.test(key);
        // eslint-disable-next-line no-prototype-builtins
        if (obj[key] != undefined && !isFilter) {
          // 判断ojb子元素是否为对象，如果是，递归复制
          if (obj[key] && typeof obj[key] == 'object') {
            objClone[key] = deepClone(obj[key], filter);
          } else {
            // 如果不是，简单复制
            objClone[key] = obj[key];
          }
        }
      });
      return objClone;
    }
    return obj;
  };
  // 16
  /**
   * @name 字符串长度补齐
   * @param {*} value 原始字符串
   * @param {*} length 保留长度
   * @param {string} [fill='0'] 填充字符串
   * @param {boolean} [insertBack=false] 默认为前置补齐
   * @return {*}
   */
  var padString = function (value, length, fill, insertBack) {
    if (!fill) {
      fill = '0';
    }
    if (!insertBack) {
      insertBack = false;
    }
    var len = String(value).length;
    // 末尾填充
    if (insertBack) {
      if (len >= length) {
        return String(value).slice(0, length);
      }
      return (value + new Array(length).join(fill)).slice(0, length);
    }
    // 前置操作截取
    if (len >= length) {
      return String(value).slice(0, length);
    }
    return (new Array(length).join(fill) + value).slice(-length);
  };

  // CONCATENATED MODULE: ./src/jt808/header.ts
  // 根据协议版本和分包状态返回头部字节长度
  var getHeaderLength = function (version, isPackage) {
    if (version > 0) {
      return isPackage ? 21 : 17;
    }
    return isPackage ? 16 : 12;
  };
  //

  // 2013 版协议处理
  var JT8080x0200VersionType = function (version) {
    if (version == 'zt') {
      Object.keys(JT8080x0200extent_zt_map).forEach(function (key) {
        extendsMap[key] = JT8080x0200extent_zt_map[key];
      })
    }
    if (version == '2019') {
      Object.keys(JT8080x0200Extent2019Map).forEach(function (key) {
        extendsMap[key] = JT8080x0200Extent2019Map[key];
      })
    }
    return extendsMap;
  };

  /**
   * 1. 基本信息（有关协议的基本信息，如何解析，哪些数据代表什么）
   */
  // 报警标志 DWORD [0-3]
  var JT8080x0200BaseAlarmSign = function (val) {
    //var bins = hexToBinary(val).split(''); 2024年7月 解决报警数据逆序的问题，更换为下面var bins = hexToBinary(val).split('').reverse();
        var bins = hexToBinary(val).split('').reverse();
    var res = {
      alarm: {},
      _alarm: {}
    };
    AlarmSignList.forEach(function (item, index) {
      var val = bins[index] == '1' ? 1 : 0
      res.alarm[item.name] = val;
      res._alarm["bin" + index] = item;
      res._alarm["bin" + index].value = val;
    });
    return res;
  };
  // 车辆状态
  var JT8080x0200BaseStatus = function (val) {
    var bins = hexToBinary(val).split('');
    var res = {
      status: {},
      _status: {}
    };
    CarStatusList.forEach(function (item, index) {
      if (item.name) {
        if (item.preLink && item.preLink > 0) { // 多个占位数字
          var val_1 = bins.slice(index - item.preLink, index).join('');
          res.status[item.name] = val_1;
          var combineItem = item;
          //   combineItem.value = bins[index] || '';
          if (item.children) {
            item.children.forEach(function (el) {
              if (el.value == val_1) {
                combineItem.value = el;
              }
            });
          }
          res._status["bin" + (index - item.preLink) + "-" + index] = combineItem;
        } else {
          var val = bins[index] == '1' ? 1 : 0
          res.status[item.name] = val;
          res._status["bin" + index] = item;
          res._status["bin" + index].value = val;
        }
      }
    });
    return res;
  };
  // 基本位置信息
  var JT8080x0200Base = function (val) {
    var alarm = JT8080x0200BaseAlarmSign(val.slice(0, 4).join(''));
    var status = JT8080x0200BaseStatus(val.slice(4, 8).join(''));
    var latitude = hexToDecimal(val.slice(8, 12).join('')); //
    var longitude = hexToDecimal(val.slice(12, 16).join('')); //
    var altitude = hexToDecimal(val.slice(16, 18).join('')); //
    var speed = hexToDecimal(val.slice(18, 20).join('')) / 10; // 取一个小数点 1/10 km/h
    var direction = hexToDecimal(val.slice(20, 22).join('')); //
    var year = val.slice(22, 25).join('-');
    var date = val.slice(25, 28).join(':');
    var time = '20' + year + ' ' + date;
    var res = {
      latitude: latitude,
      longitude: longitude,
      altitude: altitude,
      speed: speed,
      direction: direction,
      time: time
    };
    res.alarm = alarm.alarm;
    res._alarm = alarm._alarm;
    res.status = status.status;
    res._status = status._status;
    return res;
  };

  // 超速报警附加信息  表 28
  var JT8080x02000x11 = function (val) {
    // 超速报警附加位置信息
    var p1 = hexToDecimal(val.slice(0, 1).join(''));
    var area = hexToDecimal(val.slice(1).join('') || 0);
    var res = {
      position: positionMap[p1],
      area_id: area || 0
    };
    return res;
  };
  // 进出区域/路线报警附加信息  表 29
  var JT8080x02000x12 = function (val) {
    // 超速报警附加位置信息
    var p1 = hexToDecimal(val.slice(0, 1).join(''));
    positionMap[0].name = '无';
    var area = hexToDecimal(val.slice(1, 5).join(''));
    var res = {
      position: positionMap[p1],
      area_id: area || 0,
      direction: hexToDecimal(val.slice(5).join(''))
    };
    return res;
  };
  // 路段行驶时间不足/过长报警附加信息  表 30
  var JT8080x02000x13 = function (val) {
    return {
      road_id: hexToDecimal(val.slice(0, 4).join('')),
      driving_time: hexToDecimal(val.slice(4, 6).join('')),
      result: hexToDecimal(val.slice(6).join(''))
    };
  };
  // io状态
  var JT8080x02000x2A = function (val) {
    var status = hexToBinary(val.join(''));
    var res = [{
      id: 'bit2~15',
      name: '保留',
      value: String(status).slice(0, -2)
    }, {
      id: 'bit1',
      name: 'bit1',
      value: (status & 2) == 2 ? 1 : 0,
      title: '休眠状态'
    }, {
      id: 'bit0',
      name: 'bit0',
      value: (status & 1) == 1 ? 1 : 0,
      title: '深度休眠状态'
    }];
    return res;
  };
  // 模拟量 bit0-15，AD0；bit16-31，AD1
  var JT8080x02000x2B = function (val) {
    var half = val.length / 2;
    var status1 = hexToBinary(val.slice(0, half).join(''));
    var status0 = hexToBinary(val.slice(half).join(''));
    var res = [{
      id: 'bit16-31',
      name: 'AD1',
      value: status1
    }, {
      id: 'bit0-15',
      name: 'AD0',
      value: status0
    }];
    return {
      AD1: res[1],
      AD0: res[0]
    };
  };
  // 车信号灯状态
  var JT8080x02000x25 = function (val) {
    var status = hexToBinary(val.join(''));
    var res = [{
      id: 'bit15~31',
      title: '保留',
      value: ''
    }, {
      id: 'bit14',
      name: 'clutch_state',
      title: '离合器状态',
      value: (status & 16384) == 16384 ? '离合器状态' : '无'
    }, {
      id: 'bit13',
      name: 'heater_works',
      title: '加热器工作',
      value: (status & 8192) == 8192 ? '加热器工作' : '无'
    }, {
      id: 'bit12',
      name: 'abs_working',
      title: 'ABS工作',
      value: (status & 4096) == 4096 ? 'ABS工作' : '无'
    }, {
      id: 'bit11',
      name: 'retarder_works',
      title: '缓速器工作',
      value: (status & 2048) == 2048 ? '缓速器工作' : '无'
    }, {
      id: 'bit10',
      name: 'neutral_signal',
      title: '空挡信号',
      value: (status & 1024) == 1024 ? '空挡信号' : '无'
    }, {
      id: 'bit9',
      name: 'air_conditioning_status',
      title: '空调状态',
      value: (status & 512) == 512 ? '空调状态' : '无'
    }, {
      id: 'bit8',
      name: 'horn_signal',
      title: '喇叭信号',
      value: (status & 256) == 256 ? '喇叭信号' : '无'
    }, {
      id: 'bit7',
      name: 'clearance_lamp',
      title: '示廓灯',
      value: (status & 128) == 128 ? '示廓灯' : '无'
    }, {
      id: 'bit6',
      name: 'fog_lamp_signal',
      title: '雾灯信号',
      value: (status & 64) == 64 ? '雾灯信号' : '无'
    }, {
      id: 'bit5',
      name: 'reverse_gear_signal',
      title: '倒档信号',
      value: (status & 32) == 32 ? '倒档信号' : '无'
    }, {
      id: 'bit4',
      name: 'brake_signal',
      title: '制动信号',
      value: (status & 16) == 16 ? '制动信号' : '无'
    }, {
      id: 'bit3',
      name: 'left_turn_signal',
      title: '左转向灯信号',
      value: (status & 8) == 8 ? '左转向灯信号' : '无'
    }, {
      id: 'bit2',
      name: 'right_turn_signal',
      title: '右转向灯信号',
      value: (status & 4) == 4 ? '右转向灯信号' : '无'
    }, {
      id: 'bit1',
      name: 'high_beam_signal',
      title: '远光灯信号',
      value: (status & 2) == 2 ? '远光灯信号' : '无'
    }, {
      id: 'bit0',
      name: 'low_beam_signal',
      title: '近光灯信号',
      value: (status & 1) == 1 ? '近光灯信号' : '无'
    }];
    return res;
  };
  // 扩展信息获取
  // 基于2013版 中铁项目扩展数据
  var JT8080x0200ExtendZT = function (id, val) {
    if (id == '0x05') {
      return JT8080x02000x05(val);
    } else if (id == '0xE1') {
      return locationMap[hexToDecimal(val.join(''))];
    } else if (id == '0xE2') { // 电量 取值范围0~100，步长0.01
      return hexToDecimal(val.join(''));
    } else if (id == '0xE3') { // 开机时间错  INT类型的UTC时间戳（秒）
      return hexToDecimal(val.join(''));
    } else if (id == '0xE4') {
      return JT8080x02000xE4(val);
    } else if (id == '0xE8' || id == '0xE9') { //E8 差分 SDK 状态码 , E9保留位
      return val.join('');
    } else if (id == '0xEA') {
      return JT8080x02000xEA(val);
    } else if (id == '0xEB') {
      return JT8080x02000xEB(val);
    } else if (id == '0xEC') {
      return JT8080x02000xEC(val);
    } else if (id == '0xED') { // 心率：取值范围60~120，步长1，单位次/分
      return hexToDecimal(val.join(''));
    } else if (id == '0xEE') {
      return JT8080x02000xEE(val);
    } else if (id == '0xEF') {
      return JT8080x02000xEF(val);
    } else if (id == '0xF0') {
      return JT8080x02000xF0(val);
    } else if (id == '0xF1') {
      return JT8080x02000xF1(val);
    } else if (id == '0xF2') {
      return JT8080x02000xF2(val);
    } else if (id == '0xF3') {
      return JT8080x02000xF3(val);
    } else if (id == '0xF4') { // 唯一标识，可以是序列号、MAC地址、IMEI等具备唯一性的字符，最长不超过15个字符
      return val.join('');
    } else if (id == '0xF5') {
      return JT8080x02000xF5(val);
    } else if (id == '0xF6') {
      return JT8080x02000xF6(val);
    } else if (id == '0xF7') {
      return JT8080x02000xF7(val);
    } else if (id == '0xF8') {
      return JT8080x02000xF8(val);
    } else if (id == '0xF9') {
      return JT8080x02000xF9(val);
    } else if (id == '0xFA') {
      return JT8080x02000xFA(val);
    } else if (id == '0xFB') {
      return JT8080x02000xFB(val);
    } else if (id == '0xFC') {
      return JT8080x02000xFC(val);
    } else if (id == '0xFD') {
      return JT8080x02000xFD(val);
      // } else if (id == '0xFE') { 保留
      // } else if (id == '0xFF') {
    } else {
      return undefined;
    }
  };
  // 告警数据
  var JT8080x02000x05 = function (val) {
    var status = hexToBinary(val.join(''));
    return [{
      id: 'bit10~31',
      title: '保留',
      value: ''
    }, {
      id: 'bit9',
      name: 'face_alarm',
      title: '人脸报警',
      value: (status & 512) == 512 ? 1 : 0
    }, {
      id: 'bit8',
      name: 'shake_alarm',
      title: '震动报警',
      value: (status & 256) == 256 ? 1 : 0
    }, {
      id: 'bit7',
      name: 'jib_alarm',
      title: '吊臂报警',
      value: (status & 128) == 128 ? 1 : 0
    }, {
      id: 'bit6',
      name: 'hight_temperature',
      title: '高温报警',
      value: (status & 64) == 64 ? 1 : 0
    }, {
      id: 'bit5',
      name: 'silence_alarm',
      title: '静默报警',
      value: (status & 32) == 32 ? 1 : 0
    }, {
      id: 'bit4',
      name: 'brake_signal',
      title: '围栏进出报警',
      value: (status & 16) == 16 ? 1 : 0
    }, {
      id: 'bit3',
      name: 'proximity_alarm',
      title: '近电报警',
      value: (status & 8) == 8 ? 1 : 0
    }, {
      id: 'bit2',
      name: 'fall_alarm',
      title: '跌落报警',
      value: (status & 4) == 4 ? 1 : 0
    }, {
      id: 'bit1',
      name: 'hats_off_alarm',
      title: '脱帽报警',
      value: (status & 2) == 2 ? 1 : 0
    }, {
      id: 'bit0',
      name: 'sos_alarm',
      title: 'SOS报警手动触发',
      value: (status & 1) == 1 ? 1 : 0
    }];
  };
  // 定位方式
  var JT8080x02000xE4 = function (val) {
    var num = hexToDecimal(val.join(''));
    var res = [{
      name: 'satellite',
      title: '卫星定位',
      value: 0
    }, {
      name: 'cellular',
      title: '蜂窝接入网络',
      value: 1
    }, {
      name: 'wifi',
      title: 'WiFi接入网络',
      value: 2
    }];
    return res[num];
  };
  // 充电状态
  var JT8080x02000xEA = function (val) {
    var status = hexToDecimal(val.join(''));
    var res = [{
      name: 'uncharging',
      title: '未充电',
      value: 0
    }, {
      name: 'charging',
      title: '充电中',
      value: 1
    }];
    return res[status];
  };
  // GB28181视频登录状态
  var JT8080x02000xEB = function (val) {
    var status = hexToDecimal(val.join(''));
    var res = [{
      name: 'not_logged',
      title: '未登录',
      value: 0
    }, {
      name: 'login',
      title: '登录中',
      value: 1
    }];
    return res[status];
  };
  // 存储状态
  var JT8080x02000xEC = function (val) {
    var num = hexToBinary(val.join(''));
    return num;
  };
  var JT8080x02000xEE = function (val) {
    var num = hexToDecimal(val.join(''));
    // 血氧。取值范围0~100，步长1，单位%
    return "" + num + "%";
  };
  var JT8080x02000xEF = function (val) {
    var num = hexToDecimal(val.join(''));
    var res = [{
      name: 'unknown',
      title: '未知',
      value: 0
    }, {
      name: 'static',
      title: '静止',
      value: 1
    }, {
      name: 'idling',
      title: '怠速',
      value: 2
    }, {
      name: 'motion',
      title: '运动',
      value: 3
    }, {
      name: 'error',
      title: '错误',
      value: 4
    }];
    return res[num];
  };
  var JT8080x02000xF0 = function (val) {
    var num = hexToDecimal(val.join(''));
    // 数值范围：0~100。初始值：0。步长：1。
    return num;
  };
  var JT8080x02000xF1 = function (val) {
    var num = hexToDecimal(val.join(''));
    return locationMap[num];
  };
  var JT8080x02000xF2 = function (val) {
    var num = hexToDecimal(val.join(''));
    // 数值范围：-6553600~6553600。初始值：0。步长：1。单位：米
    return num;
  };
  var JT8080x02000xF3 = function (val) {
    var num = hexToDecimal(val.join(''));
    // 数值范围：-6553600~6553600。初始值：0。步长：1。单位：米
    return num;
  };
  var JT8080x02000xF5 = function (val) {
    var num = hexToDecimal(val.join(''));
    return num;
  };

  var JT8080x02000xF6 = function (val) {
    var num = hexToDecimal(val.join(''));
    return AlarmLevel[num];
  };
  var JT8080x02000xF7 = function (val) {
    var num = hexToDecimal(val.join(''));
    return AlarmLevel[num];
  };
  var JT8080x02000xF8 = function (val) {
    var num = hexToDecimal(val.join(''));
    // 数值范围：0-100 初始值：0。步长：1。单位：%
    return num;
  };
  var JT8080x02000xF9 = function (val) {
    var num = hexToDecimal(val.join(''));
    return AlarmLevel[num];
  };
  var JT8080x02000xFA = function (val) {
    var num = hexToDecimal(val.join(''));
    return num;
  };
  var JT8080x02000xFB = function (val) {
    var num = hexToDecimal(val.join(''));
    return AlarmLevel[num];
  };
  var JT8080x02000xFC = function (val) {
    var num = hexToDecimal(val.join(''));
    return num;
  };
  var JT8080x02000xFD = function (val) {
    var num = hexToDecimal(val.join(''));
    return AlarmLevel[num];
  };
  // 扩展位置信息
  var JT8080x0200Extend = function (val, version) {
    var data = {};
    var _a;
    if (val.length <= 0)
      return data;
    var id = val[0];
    var hexId = "0x" + id.toLocaleUpperCase();
    var item = extendsMap[hexId] || null;
    if (!item)
      return data;
    var dataLength = val.slice(1, 2).join('');
    var len = hexToDecimal(dataLength);
    var hexData = val.slice(2, len + 2);
    var res;
    // 版本规范解析
    if (version == 'zt') {
      res = JT8080x0200ExtendZT(hexId, hexData);
    } else if (version == '2019') {
      res = JT8080x0200Extend2019(hexId, hexData);
    }
    // 通用规范解析
    if (res == undefined) {
      res = JT8080x0200ExtendInfo(hexId, hexData);
    }
    if (hexId && res != undefined) {
      data = (_a = {}, _a[hexId] = {
        id: hexId,
        name: item.name,
        title: item.title,
        _hexData: hexData.join(''),
        length: len,
        value: res
      }, _a);
    }
    var child = {};
    var next = val.slice(len + 2);
    if (next.length) {
      child = JT8080x0200Extend(next, version);
      console.log('child', child);
      if (child) {
        Object.keys(child).forEach(function (key) {
          data[key] = child[key];
        });
      }
    }
    return data;
  }
  // 扩展位置的数据读取
  var JT8080x0200ExtendInfo = function (id, val) {
    // 0x01 里程，DWORD，1/10km，对应车上里程表读数
    // 0x02 油量 1/10L，对应车上油量表读数
    // 0x03 行驶记录功能获取的速度，WORD，1/10km/h
    if (id == '0x01' || id == '0x02' || id == '0x03') {
      return hexToDecimal(val.join('')) / 10;
    } else if (id == '0x04' || id == '0x30' || id == '0x31') {
      return hexToDecimal(val.join(''));
    } else if (id == '0x11') {
      return JT8080x02000x11(val);
    } else if (id == '0x12') {
      return JT8080x02000x12(val);
    } else if (id == '0x13') {
      return JT8080x02000x13(val);
    } else if (id == '0x2A') { // io 状态
      return JT8080x02000x2A(val);
    } else if (id == '0x2B') { // 模拟量
      return JT8080x02000x2B(val);
    } else if (id == '0x25') { // 模拟量
      return JT8080x02000x25(val);
    } else if (id == '0xE0') {
      return val.join(''); // 返回原数据
    } else {
      return undefined;
    }
  };
  var JT8080x0200 = function (val, dataLength, version) {
    // 动态合成解析字段
    extendsMap = JT8080x0200VersionType(version);
    // 基础数据
    var base = JT8080x0200Base(val.slice(0, 28));
    // 扩展信息读取
    var extend = {};
    if (dataLength > 28) {
      extend = JT8080x0200Extend(val.slice(28, dataLength), version);
    }
    //
    // console.log('toto', Object.keys(extendsMap).length);
    // 导出数据
    return {
      _hex_base: val.slice(0, 28).join(''),
      _hex_extend: val.slice(28).join(''),
      base: base,
      extend: extend,
      _base: baseNameMap,
      _extend: extendsMap
    };
  }
  var getTerminalType = function (val) {
    var status = hexToBinary(val.join(''));
    return {
        passenger_vehicle: getBitNumber(status, 0),
        dangerous_goods_vehicle: getBitNumber(status, 1),
        general_freight_vehicle: getBitNumber(status, 2),
        taxi: getBitNumber(status, 3),
        hard_disk_video: getBitNumber(status, 6),
        type: getBitNumber(status, 7)
    };
  };

  // hex转json字符串,16进制ASCII
  var hextoString = function (hex) {
    var arr = hex.split('');
    var out = '';
    for (var i = 0; i < arr.length / 2; i++) {
        var tmp = "0x".concat(arr[i * 2]).concat(arr[i * 2 + 1]);
        var charValue = String.fromCharCode(parseInt(tmp, 16));
        out += charValue;
    }
    // 解决乱码问题
    return out;
  };

  // 获取某二进制字符串数据在bit[i]位置的值
  function getBitNumber(binaryStr, i) {
    return parseInt(binaryStr[binaryStr.length - 1 - i], 10);
  }

  var getGNSSModuleAttr = function (val) {
    var status = hexToBinary(val.join(''));
    return {
        gps: getBitNumber(status, 0),
        bds: getBitNumber(status, 1),
        glonass: getBitNumber(status, 2),
        galileo: getBitNumber(status, 3)
    };
  };

  var getCommModuleAttr = function (val) {
    var status = hexToBinary(val.join(''));
    return {
        gprs: getBitNumber(status, 0),
        cdma: getBitNumber(status, 1),
        td_scdma: getBitNumber(status, 2),
        wcdma: getBitNumber(status, 3),
        cdma2000: getBitNumber(status, 4),
        td_lte: getBitNumber(status, 5),
        other: getBitNumber(status, 7)
    };
  };

  var JT8080x0107 = function (val, ver) {
    var TerminalType = getTerminalType(val.slice(0, 2));
    var ManufacturerId = hextoString(val.slice(2, 7).join(''));
    var TerminalModel = hextoString(val.slice(7, 27).join(''));
    var TerminalId = hextoString(val.slice(27, 34).join(''));
    var TerminalICCID = val.slice(34, 44).join('');
    var hardwareVerLen = hexToDecimal(val.slice(44, 45).join(''));
    var TerHardwareVer = hextoString(val.slice(45, 45 + hardwareVerLen).join(''));
    var firmwareVerLen = hexToDecimal(val.slice(45 + hardwareVerLen, 46 + hardwareVerLen).join(''));
    var TerFirmwareVer = hextoString(val
        .slice(46 + hardwareVerLen, 46 + hardwareVerLen + firmwareVerLen)
        .join(''));
    var GNSSModuleAttr = getGNSSModuleAttr(val.slice(46 + hardwareVerLen + firmwareVerLen, 47 + hardwareVerLen + firmwareVerLen));
    var CommModuleAttr = getCommModuleAttr(val.slice(47 + hardwareVerLen + firmwareVerLen));
    console.log(ver, '======ver====');
    return {
        id: '0x0107',
        byte: 4,
        name: 'TerminalAttributeReply',
        title: '查询终端属性应答',
        value: {
            terminal_type: TerminalType,
            manufacturer_id: ManufacturerId,
            terminal_model: TerminalModel,
            terminal_id: TerminalId,
            terminal_iccid: TerminalICCID,
            hardware_ver_len: hardwareVerLen,
            ter_hardware_ver: TerHardwareVer,
            firmware_ver_len: firmwareVerLen,
            ter_firmware_ver: TerFirmwareVer,
            gnss_module_attr: GNSSModuleAttr,
            comm_module_attr: CommModuleAttr
        }
    };
  };

  // 各个类型数据所占的字节数
  var BYTE_LENGTH = 1;
  var WORD_LENGTH = 2;
  var DWORD_LENGTH = 4;

  var jt808_0x0104_assign = (undefined && undefined.__assign) || function () {
    jt808_0x0104_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return jt808_0x0104_assign.apply(this, arguments);
  };

  var getHexArrData = function (val, endIndex) {
    var paramValue = '';
    // 0xFFFFFFFF 为无限制
    var conValue = '0xFFFFFFFF';
    var hexValue = val.slice(0, endIndex).join('');
    if ("0x".concat(hexValue.toLocaleUpperCase()) === conValue) {
        paramValue = conValue;
    }
    else {
        paramValue = hexToDecimal(hexValue);
    }
    return {
        hex: hexValue,
        paramValue: paramValue
    };
  };

  var getStringTypeData = function (val, paramLen) { 
    return ({
      paramValue: hextoString(val.slice(0, paramLen).join('')),
      hex: val.slice(0, paramLen).join('')
    });
  };

  var paramID0x0110 = function (val) {
    var data = hexToBinary(val.slice(0, BYTE_LENGTH * 8).join(''));
    return {
      hex: val.slice(0, BYTE_LENGTH * 8).join(''),
      paramValue: {
        // 采集时间间隔(ms)
        acquisition_interval: parseInt(data.slice(data.length - 1 - 63, data.length - 32), 2),
        // CAN 通道号 1：CAN2 0：CAN1
        can_number: getBitNumber(data, 31),
        // 帧类型 1：扩展帧 0：标准帧
        frame_type: getBitNumber(data, 30),
        // 数据采集方式 1:采集区间的计算值 0:原始数据
        data_coll_type: getBitNumber(data, 29),
        // CAN 总线 ID
        can_id: parseInt(data.slice(data.length - 1 - 28, data.length), 2)
      }
    };
  };

  var paramID0x005D = function (val) {
    var data = hexToBinary(val.slice(0, WORD_LENGTH).join(''));
    return {
      hex: val.slice(0, WORD_LENGTH).join(''),
      paramValue: {
        // 碰撞时间单位4ms
        collision_time: parseInt(data.slice(data.length - 1 - 7, data.length - 0), 2) * 4,
        // 碰撞加速度，单位0.1g，设置范围在：0-79 之间，默认为10
        collision_acceleration: parseInt(data.slice(data.length - 1 - 15, data.length - 8), 2) * 0.1
      }
    };
  };

  var paramID0x0064 = function (val) {
    var data = hexToBinary(val.slice(0, DWORD_LENGTH).join(''));
    return {
      hex: val.slice(0, DWORD_LENGTH).join(''),
      paramValue: {
        // 摄像通道 1 定时拍照开关标志 1：允许 0：不允许
        camera_channe_timing_switch01: getBitNumber(data, 0),
        // 摄像通道 2 定时拍照开关标志 1：允许 0：不允许
        camera_channe_timing_switch02: getBitNumber(data, 1),
        // 摄像通道 3 定时拍照开关标志 1：允许 0：不允许
        camera_channe_timing_switch03: getBitNumber(data, 2),
        // 摄像通道 4 定时拍照开关标志 1：允许 0：不允许
        camera_channe_timing_switch04: getBitNumber(data, 3),
        // 摄像通道 5 定时拍照开关标志 1：允许 0：不允许
        camera_channe_timing_switch05: getBitNumber(data, 4),
        // 摄像通道 1 定时拍照存储标志 1：上传 0：存储
        camera_channe_timing_storage01: getBitNumber(data, 8),
        // 摄像通道 2 定时拍照存储标志 1：上传 0：存储
        camera_channe_timing_storage02: getBitNumber(data, 9),
        // 摄像通道 3 定时拍照存储标志 1：上传 0：存储
        camera_channe_timing_storage03: getBitNumber(data, 10),
        // 摄像通道 4 定时拍照存储标志 1：上传 0：存储
        camera_channe_timing_storage04: getBitNumber(data, 11),
        // 摄像通道 5 定时拍照存储标志 1：上传 0：存储
        camera_channe_timing_storage05: getBitNumber(data, 12),
        // 单位时间 0：秒，当数值小于 5 秒时，终端按 5 秒处理； 1：分
        unit_time: getBitNumber(data, 16),
        // 定时时间间隔
        timed_interval: parseInt(data.slice(data.length - 1 - 31, data.length - 17), 2)
      }
    };
  };

  var paramID0x0065 = function (val) {
    var data = hexToBinary(val.slice(0, DWORD_LENGTH).join(''));
    return {
      hex: val.slice(0, DWORD_LENGTH).join(''),
      paramValue: {
        // 摄像通道 1 定距拍照开关标志 1：允许 0：不允许
        camera_channe_distance_switch01: getBitNumber(data, 0),
        // 摄像通道 2 定距拍照开关标志 1：允许 0：不允许
        camera_channe_distance_switch02: getBitNumber(data, 1),
        // 摄像通道 3 定距拍照开关标志 1：允许 0：不允许
        camera_channe_distance_switch03: getBitNumber(data, 2),
        // 摄像通道 4 定距拍照开关标志 1：允许 0：不允许
        camera_channe_distance_switch04: getBitNumber(data, 3),
        // 摄像通道 5 定距拍照开关标志 1：允许 0：不允许
        camera_channe_distance_switch05: getBitNumber(data, 4),
        // 摄像通道 1 定距拍照存储标志 1：上传 0：存储
        camera_channe_distance_storage01: getBitNumber(data, 8),
        // 摄像通道 2 定距拍照存储标志 1：上传 0：存储
        camera_channe_distance_storage02: getBitNumber(data, 9),
        // 摄像通道 3 定距拍照存储标志 1：上传 0：存储
        camera_channe_distance_storage03: getBitNumber(data, 10),
        // 摄像通道 4 定距拍照存储标志 1：上传 0：存储
        camera_channe_distance_storage04: getBitNumber(data, 11),
        // 摄像通道 5 定距拍照存储标志 1：上传 0：存储
        camera_channe_distance_storage05: getBitNumber(data, 12),
        // 单位距离 0：米，当数值小于 100 米时，终端按 100 米处理 1：公里
        unit_distance: getBitNumber(data, 16),
        // 定距距离间隔
        distance_interval: parseInt(data.slice(data.length - 1 - 31, data.length - 17), 2)
      }
    };
  };

  var paramID0x0090 = function (val) {
    var data = hexToBinary(val.slice(0, BYTE_LENGTH).join(''));
    return {
      hex: val.slice(0, BYTE_LENGTH).join(''),
      paramValue: {
        // 0：禁用 GPS 定位， 1：启用 GPS 定位；
        gps: getBitNumber(data, 0),
        // 0：禁用 北斗 定位， 1：启用 GPS 定位；
        bds: getBitNumber(data, 1),
        // 0：禁用 GLONASS 定位， 1：启用 GPS 定位；
        glonass: getBitNumber(data, 2),
        // 0：禁用 Galileo 定位， 1：启用 GPS 定位；
        galileo: getBitNumber(data, 3)
      }
    };
  };

  var paramID0x0091 = function (val) {
    var data = hexToDecimal(val.slice(0, BYTE_LENGTH).join(''));
    var n = Math.pow(2, data);
    return {
      hex: val.slice(0, BYTE_LENGTH).join(''),
      paramValue: 4800 * n
    };
  };

  var paramID0x0092 = function (val) {
    var data = hexToDecimal(val.slice(0, BYTE_LENGTH).join(''));
    var paramValue = '';
    if (data === 0) {
      paramValue = '500ms';
    }
    else {
      paramValue = "".concat(data * 1000, "ms");
    }
    return {
      hex: val.slice(0, BYTE_LENGTH).join(''),
      paramValue: paramValue
    };
  };

  var paramID0x0094 = function (val) {
    var data = val.slice(0, BYTE_LENGTH).join('')
        .toLocaleUpperCase();
    return {
      hex: val.slice(0, BYTE_LENGTH).join(''),
      paramValue: "0x".concat(data)
    };
  };

  var terminaParamsAnalysis = function (_a) {
    var hexArr = _a.hexArr, startHex = _a.startHex, id = _a.id, paramLen = _a.paramLen;
    switch (id) {
        // DWORD 类型数据
        case '0x0001':
        case '0x0002':
        case '0x0003':
        case '0x0004':
        case '0x0005':
        case '0x0006':
        case '0x0007':
        case '0x0018':
        case '0x0019':
        case '0x001B':
        case '0x001C':
        case '0x0020':
        case '0x0021':
        case '0x0022':
        case '0x0027':
        case '0x0028':
        case '0x0029':
        case '0x002C':
        case '0x002D':
        case '0x002E':
        case '0x002F':
        case '0x0030':
        case '0x0045':
        case '0x0046':
        case '0x0047':
        case '0x0050':
        case '0x0051':
        case '0x0052':
        case '0x0053':
        case '0x0054':
        case '0x0055':
        case '0x0056':
        case '0x0057':
        case '0x0058':
        case '0x0059':
        case '0x005A':
        case '0x0070':
        case '0x0071':
        case '0x0072':
        case '0x0073':
        case '0x0074':
        case '0x0080':
        case '0x0093':
        case '0x0095':
        case '0x0100':
        case '0x0102':
          return jt808_0x0104_assign(jt808_0x0104_assign({}, getHexArrData(hexArr.slice(startHex, startHex + DWORD_LENGTH), DWORD_LENGTH)), { length: DWORD_LENGTH });
        // WORD 类型数据
        case '0x0031':
        case '0x005B':
        case '0x005C':
        case '0x005E':
        case '0x0081':
        case '0x0082':
        case '0x0101':
        case '0x0103':
          return jt808_0x0104_assign(jt808_0x0104_assign({}, getHexArrData(hexArr.slice(startHex, startHex + WORD_LENGTH), WORD_LENGTH)), { length: WORD_LENGTH });
        // BYTE 类型数据
        case '0x0084':
          return jt808_0x0104_assign(jt808_0x0104_assign({}, getHexArrData(hexArr.slice(startHex, startHex + BYTE_LENGTH), BYTE_LENGTH)), { length: BYTE_LENGTH });
        // 保留位
        case '0x0008':
        case '0x0009':
        case '0x000A':
        case '0x000B':
        case '0x000C':
        case '0x000D':
        case '0x000E':
        case '0x000F':
        case '0x001E':
        case '0x001F':
        case '0x0023':
        case '0x0024':
        case '0x0025':
        case '0x0026':
        case '0x002A':
        case '0x002B':
        case '0x0032':
        case '0x0033':
        case '0x0034':
        case '0x0035':
        case '0x0036':
        case '0x0037':
        case '0x0038':
        case '0x0039':
        case '0x003A':
        case '0x003B':
        case '0x003C':
        case '0x003D':
        case '0x003E':
        case '0x003F':
        case '0x004A':
        case '0x004B':
        case '0x004C':
        case '0x004D':
        case '0x004E':
        case '0x004F':
        case '0x005F':
        case '0x0060':
        case '0x0061':
        case '0x0062':
        case '0x0063':
        case '0x0066':
        case '0x0067':
        case '0x0068':
        case '0x0069':
        case '0x006A':
        case '0x006B':
        case '0x006C':
        case '0x006D':
        case '0x006E':
        case '0x006F':
        case '0x0075':
        case '0x0076':
        case '0x0077':
        case '0x0078':
        case '0x0079':
        case '0x007A':
        case '0x007B':
        case '0x007C':
        case '0x007D':
        case '0x007E':
        case '0x007F':
          return {
            paramValue: hexArr.slice(startHex, startHex + paramLen).join(''),
            length: paramLen
          };
        // STRING 类型数据
        case '0x0010':
        case '0x0011':
        case '0x0012':
        case '0x0013':
        case '0x0014':
        case '0x0015':
        case '0x0016':
        case '0x0017':
        case '0x001A':
        case '0x0040':
        case '0x0041':
        case '0x0042':
        case '0x0043':
        case '0x0044':
        case '0x0048':
        case '0x0049':
        case '0x0083':
          return jt808_0x0104_assign(jt808_0x0104_assign({}, getStringTypeData(hexArr.slice(startHex, startHex + paramLen), paramLen)), { length: paramLen });
        case '0x0110':
          return jt808_0x0104_assign(jt808_0x0104_assign({}, paramID0x0110(hexArr.slice(startHex, startHex + BYTE_LENGTH * 8))), { length: BYTE_LENGTH * 8 });
        case '0x005D':
          return jt808_0x0104_assign(jt808_0x0104_assign({}, paramID0x005D(hexArr.slice(startHex, startHex + WORD_LENGTH))), { length: WORD_LENGTH });
        case '0x0064':
          return jt808_0x0104_assign(jt808_0x0104_assign({}, paramID0x0064(hexArr.slice(startHex, startHex + DWORD_LENGTH))), { length: DWORD_LENGTH });
        case '0x0065':
          return jt808_0x0104_assign(jt808_0x0104_assign({}, paramID0x0065(hexArr.slice(startHex, startHex + DWORD_LENGTH))), { length: DWORD_LENGTH });
        case '0x0090':
          return jt808_0x0104_assign(jt808_0x0104_assign({}, paramID0x0090(hexArr.slice(startHex, startHex + BYTE_LENGTH))), { length: BYTE_LENGTH });
        case '0x0091':
          return jt808_0x0104_assign(jt808_0x0104_assign({}, paramID0x0091(hexArr.slice(startHex, startHex + BYTE_LENGTH))), { length: BYTE_LENGTH });
        case '0x0092':
          return jt808_0x0104_assign(jt808_0x0104_assign({}, paramID0x0092(hexArr.slice(startHex, startHex + BYTE_LENGTH))), { length: BYTE_LENGTH });
        case '0x0094':
          return jt808_0x0104_assign(jt808_0x0104_assign({}, paramID0x0094(hexArr.slice(startHex, startHex + BYTE_LENGTH))), { length: BYTE_LENGTH });
        // 用于其他 CAN 总线 ID 单独采集设置
        case '0x0111':
        case '0x0112':
        case '0x0113':
        case '0x0114':
        case '0x0115':
        case '0x0116':
        case '0x0117':
        case '0x0118':
        case '0x0119':
        case '0x011A':
        case '0x011B':
        case '0x011C':
        case '0x011D':
        case '0x011E':
        case '0x011F':
          return {
            paramValue: hexArr.slice(startHex, startHex + BYTE_LENGTH * 8).join(''),
            length: BYTE_LENGTH * 8
          };
        default:
          console.log('message id is unknown');
          break;
    }
  };

  var getParamsItems = function (hexArr, replyNumber) {
    // 解析的第几个参数项
    var num = 0;
    var params = {};
    // 解析到的位置
    var index = 0;
    while (num < replyNumber) {
      var paramId = "0x".concat(hexArr.slice(index + 2, index + 4).join('')
        .toLocaleUpperCase());
      var paramLen = hexToDecimal(hexArr.slice(index + 4, index + 5).join(''));
      var data = terminaParamsAnalysis({
        hexArr: hexArr,
        startHex: index + 5,
        id: paramId,
        paramLen: paramLen
      });
      // 如果没有数据，则不作处理
      if (data) {
        if (data.length) {
          index = index + data.length + 5;
        } else {
          index = index + paramLen + 5;
        }
        params[paramId] = data.paramValue;
      }
      num += 1;
    }
    return params;
  };

  function JT8080x0104(val) {
    // 流水号
    var ReplyMsgNum = hexToDecimal(val.slice(0, 2).join(''));
    // 参数个数
    var ReplyNumber = hexToDecimal(val.slice(2, 3).join(''));
    var paramsData = val.slice(3);
    return {
      id: '0x0104',
      byte: 4,
      name: 'QueryTerminalReply',
      title: '查询终端参数应答',
      value: {
        ReplyMsgNum: ReplyMsgNum,
        ReplyNumber: ReplyNumber,
        Params: getParamsItems(paramsData, ReplyNumber)
      }
    };
  }

  /**
   * 消息体属性的解析数据
   * @param val  1WORD hex
   * @returns JT808HeaderMessageBodyProperty
   */
  var getMessageBodyProperty = function (hexString) {
    var value = +(hexString);
    var Version = ((value >> 14) & 0x01) == 1 ? 1 : 0;
    var IsPackage = ((value >> 13) & 0x001) == 1 ? 1 : 0;
    var val = (value & 0x400) >> 10;
    var Encrypt;
    if (val == 1) {
      Encrypt = EncryptMethod.RSA.value;
    } else {
      Encrypt = EncryptMethod.None.value
    }
    var DataLength = value & 0x3ff;
    return {
      _bin: hexToBinary(hexString),
      _hex: hexString,
      _encrypt: Encrypt ? EncryptMethod.RSA : EncryptMethod.None,
      Version: Version,
      IsPackage: IsPackage,
      Encrypt: Encrypt,
      DataLength: DataLength
    };
  };

  // 获取msgId 的说明信息
  function getMsgIdIntroduce(msgId) {
    var info = MsgIdList['' + msgId] || null;
    if (info)
      return info;
    return null;
  }
  // jt808 消息头内容
  var JT808HeaderAnalysis = function (data) {
    // data[0]; 为开始符号7e
    var res = {};
    // 1.消息类型 WORD
    res.MsgId = "0x" + data[0] + data[1];
    var MessageBodyProperty = getMessageBodyProperty("0x" + data[2] + data[3]);
    // 2.协议版本号+是否分包
    res.ProtocolVersion = MessageBodyProperty.Version;
    res.MessageBodyProperty = MessageBodyProperty;
    var headerLength = getHeaderLength(MessageBodyProperty.Version, MessageBodyProperty.IsPackage);
    // 3. 终端手机号为
    if (MessageBodyProperty.Version) {
      // 2019 版本 有协议版本号，终端手机号  20位
      var version19 = data.slice(4, 15).join('');
      // const phone = hexToDecimal();
      res.ProtocolVersionNumber = hexToDecimal("" + version19.slice(0, 1));
      res.TerminalPhoneNo = padString(version19.slice(1), 20);
      res.MsgNum = hexToDecimal(data.slice(15, 17).join('')); // word 0 开始
    } else {
      // 2013 版本 终端手机号 12位
      res.TerminalPhoneNo = padString(data.slice(4, 10).join(''), 12); // BCD 6
      res.MsgNum = hexToDecimal(data.slice(10, 12).join('')); // word 0 开始
    }
    // 4.判断有无分包
    if (MessageBodyProperty.IsPackage) {
      // 5.读取消息包总数
      res.PackageCount = hexToDecimal(data.slice(headerLength - 4, headerLength - 2).join(''));
      // 6.读取消息包序号
      res.PackageIndex = hexToDecimal(data.slice(headerLength - 2, headerLength).join(''));
    }
    return res;
  };
  // jt808 body内容
  var JT808MessageBodyAnalysis = function (hexArray, header) {
    var msgId = header.MsgId;
    // 判断消息id是否正确
    var info = getMsgIdIntroduce(msgId);
    if (!info) {
      console.error('msgId is undefined');
      return false;
    }

    var bodyData = {};
    var ver = header.ProtocolVersion ? '2019' : 'zt';
    // 解析数据
    if (msgId == '0x0200') {
      bodyData = JT8080x0200(hexArray, header.MessageBodyProperty.DataLength, ver);
    } else if (msgId == '0x0704') {
      bodyData = {
        id: msgId
      }; // JT8080x0704(hexArray);
    } else if (msgId == '0x0107') {
      bodyData = JT8080x0107(hexArray, ver);
    }  else if (msgId == '0x0104') {
      bodyData = JT8080x0104(hexArray);
    } else {
      console.log('message id is unknown');
    }
    bodyData._msg_id = msgId;
    bodyData._msg_name = info.cn;
    return bodyData;
  }
  // jt808 数据解析入口
  var protocol_JT808Protocol = function (inputArr) {
    // 十进制转16进制，字符串数组
    var hexBytes = DataTypeExplain(inputArr);
    if (!hexBytes || !/^7E(.*)7E$/i.test(hexBytes)) {
      console.log('协议结构错误，应该是已7E开头和结尾数据');
      return;
    }
    // 接收数据进行decode转义还原
    // hexStringToHex将字符串两两分组，返回字符数组"a1b2c3d4" => ["A1", "B2", "C3", "D4"]
    var hexArr = JT808DataEscape(hexStringToHex(hexBytes), false);
    // console.log('--->', hexArr);
    // 1. 头部数据解析
    var Header = JT808HeaderAnalysis(hexArr);
    var headerLen = getHeaderLength(Header.ProtocolVersion, Header.MessageBodyProperty.IsPackage);
    var Body = [];
    var checkCodeStartIndex = headerLen + Header.MessageBodyProperty.DataLength;
    // 2.数据体
    if (Header.MessageBodyProperty.DataLength > 0) {
      // 数据体处理
      var bodyData = hexArr.slice(headerLen, checkCodeStartIndex);
      // 解析
      var content = JT808MessageBodyAnalysis(bodyData, Header);
      Body = content;
      Body._hex = bodyData.join('');
    }
    // 3. 校验码
    var CheckCode = hexToDecimal(hexArr.slice(checkCodeStartIndex, checkCodeStartIndex + 1).join(''));
    var JT808Protocol = {
      Header: Header,
      Body: Body,
      CheckCode: CheckCode,
      Description: ''
    };
    return JT808Protocol;
  }
  // 上报解析（属性+事件）

  // CONCATENATED MODULE: ./src/jt808/iot/report.ts
  /**
   * iot 属性上报
   */
  var propertiesReport = function (json) {
    return {
      method: 'report',
      clientToken: new Date(),
      params: json
    };
  };
  /**
   * iot 事件上报
   */
  var eventReport = function (eventId, data, type) {
    return {
      method: 'event_post',
      clientToken: new Date(),
      version: '1.0',
      eventId: eventId,
      type: type || EventType.Alert,
      timestamp: new Date().getTime(),
      params: data
    };
  };
  // import { baseExtendsMap } from '../interface/jt808-0x0200';
  // import { JT8080x0200extent_zt_map } from '../interface/jt808-0x0200-zt';


  /**
   * 中铁jt808_0x0200 消息上报解析
   */
  var zt0x0200ReportData = function (data) {
    var proto = zt0x0200Prototype(data);
    var events = zt0x0200Event(data);
    var list = [proto];
    return list.concat(events);
    // return events;
  };
  // 扩展字段中属性挑选出来作为 属性上报
  var zt0x0200Prototype = function (data) {
    var base = data.Body.base;
    var extend = data.Body.extend;
    // 扩展字段

    var extendsForPrototype = ['mileage', 'fuel', 'velocity', 'alarm_event_id', 'analog'];
    var extendValueMap = zt0x0200ExtendPrototype(extend, extendsForPrototype);
    var params = extendValueMap;

    params.latitude = base.latitude,
      params.longitude = base.longitude,
      params.altitude = base.altitude,
      params.direction = base.direction,
      params.speed = base.speed,
      params.report_time = base.time;
      params.status = base.status;
    return propertiesReport(params);
  };
  // 需要将这些扩展字段纳入属性上报
  // 获取
  var zt0x0200ExtendPrototype = function (extend, map) {
    // 需要归属到属性的字段
    var res = {};
    Object.keys(extend).forEach(function (key) {
      var item = extend[key];
      if (map.indexOf(item.name) >= 0) {
        res[item.name] = item.value;
      }
    });
    return res;
  };
  // 事件信息列表
  var zt0x0200Event = function (data) {
    var base = data.Body.base;
    var extend = data.Body.extend;
    var eventList = [
      zt0x0200EventAlarmSingle(base),
      zt0x0200EventAlarmLocation(base, extend),
      // zt0x0200EventStatus(base),
      zt0x0200EventOverSpeed(extend),
      zt0x0200EventInout(extend),
      zt0x0200EventDriveRoad(extend),
      zt0x0200EventCarSingleStatus(extend),
      zt0x0200EventIOStatus(extend),
    ];
    return eventList.filter(function (item) {
      return item != false;
    });
  };
  // 自定义报警添加经纬度
    var zt0x0200EventAlarmLocation = function (base) {
          var params = {};
          params.latitude = base.latitude;
          params.longitude = base.longitude;
          params.altitude = base.altitude;
          params.reserve2 = base.alarm.reserve2
          params.reserve3 = base.alarm.reserve3
          return eventReport('custom_alarm', params, EventType.Info);
      };
  // 车辆报警标志
  var zt0x0200EventAlarmSingle = function (base) {
    return eventReport('alarm_single', base.alarm, EventType.Info);
  };
  // 车辆状态告警
  // var zt0x0200EventStatus = function (base) {
  //   return eventReport('status', base.status, EventType.Info);
  // };
  // 超速告警事件
  var zt0x0200EventOverSpeed = function (extend) {
    if (!extend['0x11']) {
      return false;
    }
    return eventReport('over_speed_alarm', extend['0x11'], EventType.Info);
  };
  // 进出区域/路线报警
  var zt0x0200EventInout = function (extend) {
    if (!extend['0x12']) {
      return false;
    }
    return eventReport('direction_alarm', extend['0x12'], EventType.Info);
  };
  // 路段行驶时间不足/过长
  var zt0x0200EventDriveRoad = function (extend) {
    if (!extend['0x13']) {
      return false;
    }
    return eventReport('drive_road', extend['0x13'], EventType.Info);
  };
  // 扩展车辆信号状态位
  var zt0x0200EventCarSingleStatus = function (extend) {
    if (!extend['0x25']) {
      return false;
    }
    return eventReport('car_signal_status', extend['0x25'], EventType.Info);
  };
  // IO状态位置
  var zt0x0200EventIOStatus = function (extend) {
    if (!extend['0x2A']) {
      return false;
    }
    return eventReport('io_status', extend['0x2A'], EventType.Info);
  };
  // JT808 2013版 0x0107消息id 解析上报
  function JT20130x0107ReportData(data) {
    var params = {
        device_attribute: JSON.stringify(data.Body.value)
    };
    return [propertiesReport(params)];
}

  function JT20130x0104ReportData(data) {
    var params = {
        device_parameter: JSON.stringify(data.Body.value.Params)
    };
    return [propertiesReport(params)];
  }
  /**
   * 中铁解析数据拆解上报
   */
  var ztReportData = function (data) {
    if (data.Header.MsgId == '0x0200') {
      return zt0x0200ReportData(data);
    } else if (data.Header.MsgId == '0x0704') {
      return {
        id: '0x0704',
        data: data
      };
    } else if (data.Header.MsgId == '0x0104') {
      return JT20130x0104ReportData(data);
    }  else if (data.Header.MsgId == '0x0107') {
      return JT20130x0107ReportData(data);
    } else {
      return {};
    }
  };
  var data = protocol_JT808Protocol(bytes);
  return ztReportData(data);
}
// 测试数据
const byte = [126, 2, 0, 0, 38, 18, 52, 86, 120, 144, 18, 0, 125, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 186, 127, 14, 7, 228, 241, 28, 0, 40, 0, 60, 0, 0, 24, 16, 21, 16, 16, 16, 1, 4, 0, 0, 0, 100, 2, 2, 0, 125, 1, 19, 126];
var jt808_res = RawToProtocol('1', byte);
console.log('--->', jt808_res);