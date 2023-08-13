import request from "@/utils/request"
import { getRequest, postRequest, putRequest, deleteRequest, postRequestToDownloadZip } from "@/utils/index.js"
// import { get } from "http"

// The dictionary interface
export function getDict(params) {
    return getRequest('/getDict', params, false)
}
// Permission and condition to query equipment information
export function getDevInfo(params) {
    return postRequest("/device/getByCondition", params)
}

// Permission and condition to query equipment information
export function getDevice(params) {
    return postRequest("/device/getDevInfo", params)
}


// Get policyName
export function getPolicyName() {
    return getRequest("/vsm/vsr/getPolicyName")
}
// Gets the tenant routing domain
// export function getRentUser() {
//     return getRequest("/vsm/vsr/getRentUser")
// }

// Access rate
export function getDevRate() {
    return getRequest("/vsm/vsr/getDevRate")
}

// Send physical port to send
export function getPhyPortMqtt(params) {
    return getRequest("/vsm/vsr/getPhyPortMqtt", params)
}

// Gets the physical port name
export function getPhyPort(params) {
    return getRequest("/vsm/vsr/getPhyPort", params)
}

// Gets the physical port list
export function getPhyPortList(params) {
    // console.log(params)
    return getRequest("/vsm/vsr/getPhyPortList", params)
}

// Gets the physical port type
export function vsrgetPortType() {
    return getRequest("/vsm/vsr/getPortType")
}

// Gets duplex status
export function vsrgetDupStu() {
    return getRequest("/vsm/vsr/getDupStu")
}

// Modify the physical port
export function editPhyPort(params) {
    return request.post("/vsm/vsr/editPhyPort", params)
}

// Get the DHCP service
export function getDhcpList(params) {
    return getRequest("/vsm/vsr/getDhcpList", params)
}

// The new DHCP
export function addDhcp(params) {
    return request.post("/vsm/vsr/addDhcp", params)
}

// Edit the DHCP
export function editDhcp(params) {
    return request.post("/vsm/vsr/editDhcp", params)
}

// Batch delete DHCP service
export function delBatchDhcpSer(params) {
    return request.post("/vsm/vsr/delBatchDhcpSer", params)
}

// Get the static DHCP service
export function getStaticDhList(params) {
    return getRequest("/vsm/vsr/getStaticDhList", params)
}

// New static DHCP service
export function addStaticDhcp(params) {
    return request.post("/vsm/vsr/addStaticDhcp", params)
}

// Added static DHCP service to Edit static DHCP service
export function editStaticDhcp(params) {
    return request.post("/vsm/vsr/editStaticDhcp", params)
}

// Batch delete static DHCP services
export function delBatchStaticDh(params) {
    return request.post("/vsm/vsr/delBatchStaticDh", params)
}

// The login
export function Login(params) {
    return postRequest("/login", params)
}

// Get user information
export function userInfo(params) {
    return getRequest('/user/info', params)
}

// Access to the menu
export function getMenuList(params) {
    return getRequest('/permission/getMenuList', params)
}

export function Logout(params) {
    return getRequest("/vsm/logout", params)
}

// Device menu display
export function getRoute(params) {
    return getRequest('/vsr/route/getRoute', params)
}

// VSR device logical port module
// Logical port IPv4 net terminal uniqueness check
// export function isMaskRepeat(params) {
//     return request.post('/vsm/vsr/isMaskRepeat', params)
// }

// Logical port Ipv6 network terminal uniqueness check
// export function isIPVSRepeat(params) {
//     return request.post('/vsm/vsr/isIPVSRepeat', params)
// }

// Logical port Ipv6 network terminal uniqueness check


// New interface for logical port
// Whether the logical port is bound by the VPN
export function checkEditIps(params) {
    return getRequest('/logical/checkEditIps', params, false)
}

// Logical port IPv4 net terminal uniqueness check
export function isMaskRepeat(params) {
    return getRequest('/logical/ipv4Exist', params, false)
}

// Check if the logical port ipv4 and the gateway are in the same network segment
export function checkGateway(params) {
    return getRequest('/logical/checkGateway', params, false)
}

// Check if the logical port ipv4 and the connection pool IP are in the same network segment
export function checkPoolIp(params) {
    return getRequest('/logical/checkPoolIp', params, false)
}

// Check if bridged exists
export function bridgedExist(params) {
    return getRequest('/logical/bridgedExist', params, false)
}


// Logical port Ipv6 network terminal uniqueness check
export function isIPVSRepeat(params) {
    return getRequest('/logical/ipv6Exist', params, false)
}

// Check if the logical port is VRF modifiable
export function isVrfBandDing(params) {
    return postRequest('/logical/isVrfBandDing', params, false)
}

// Paging gets the logical port
export function logicalPortGet(params) {
    return getRequest("/logical/getByCondition", params)
}

export function logicalPortGetByTts(params) {
    return getRequest("/logical/getByConditionByTts", params)
}

export function getByVPNStatusByTts(params) {
    return getRequest("/logical/getByVPNStatusByTts", params)
}

export function getLogicalPortByTts(params) {
    return getRequest("/logical/getLogicalPortByTts", params)
}

export function getByVPNStatusOptions(params) {
    return getRequest("/logical/getByVPNStatusOptions", params)
}

// Add logical port
export function logicalPortAdd(params) {
    return postRequest('/logical/addLogical', params)
}

// init Default Port
export function initDefaultPort(params) {
    return getRequest('/logical/initPort', params)
}

export function checkSubscription(params) {
    return getRequest('/logical/checkSubscription', params)
}

// Get the VPN address configured on the interface
export function getVpnForLogicPort(params) {
    return getRequest('/logical/getVpnForLogicPort', params)
}

// Edit logical port
export function logicalPortEdit(params) {
    return putRequest('/logical/updateLogical', params)
}
// Gets the new logical port drop-down option
export function logicalPortGetSelect(params) {
    return getRequest('/logical/options', params)
}

// Remove logical port
export function logicalPortDel(params) {
    return postRequest('/logical/delLogical', params)
}

// Gets the properties associated with logical port advanced Settings
export function logicalPortExtra(params) {
    return getRequest('/logical/extra/options', params)
}

// Gets the properties associated with logical port advanced Settings
export function getLogicPort(params) {
    return getRequest('/logical/getLogicPort', params)
}

// Used for pingtest
export function getLogicPortIP(params) {
    return getRequest('/logical/getLogicPortIP', params)
}

// Gets the properties associated with logical port advanced Settings
export function getLogicPortForRole(params) {
    return getRequest('/logical/getLogicPortForRole', params)
}

// Gets the properties associated with logical port advanced Settings
export function getLogicLanPort(params) {
    return getRequest('/logical/getLogicLanPort', params)
}

// Edit logical port advanced Settings
export function logicalPortExtraSet(params) {
    return putRequest('/logical/extra', params)
}

// Gets logical port advanced Settings information
export function logicalPortExtraGet(params) {
    return getRequest('/logical', params)
}

// Logical port name uniqueness check
export function logicalPortName(params) {
    return getRequest('/logical/nameExist', params, false)
}

// Gets the VXLAN list
export function getVxLanList(params) {
    return getRequest("/vsm/vsr/getVxLanList", params)
}

// Add New VxLan
export function addVxLan(params) {
    return request.post('/vsm/vsr/addVxLan', params)
}

// Edit vxlan
export function editVxLan(params) {
    return request.post("/vsm/vsr/editVxLan", params)
}

// Batch delete vXLAN
export function delBatchVxLan(params) {
    return request.post("/vsm/vsr/delBatchVxLan", params)
}

// Get acl options
export function getAclItem(params) {
    return getRequest("/vsm/vsr/getAclItem", params)
}

// Access to qos options
export function getQos(params) {
    return getRequest("/vsm/vsr/getQos", params)
}

// Access to qos list
export function getQosList(params) {
    return getRequest("/vsm/dev/getQosList", params)
}

// Query flow group, action, DSCP information, jump to the newly added Qos interface
export function toAddQos(params) {
    return getRequest("/vsm/dev/toAddQos", params)
}

// Whether qos can be edited
export function canEditQos(params) {
    return request.post("/vsm/dev/canEditQos", params)
}

// Add new qos
export function addQos(params) {
    return request.post("/vsm/dev/addQos", params)
}

// Edit QOS
export function editQos(params) {
    return request.post("/vsm/dev/editQos", params)
}

// Deletes the selected QOS
export function delQoss(params) {
    return request.post("/vsm/dev/delQoss", params)
}

// Copy the selected QOS
export function copyQoss(params) {
    return request.post("/vsm/dev/copyQoss", params)
}

// QOS name uniqueness check
export function isQosNamExit(params) {
    return getRequest('/vsm/dev/isQosNamExit', params)
}

// Gets the VXLAN advanced Settings
export function getVxlanSetting(params) {
    return getRequest("/vsm/vsr/getVxlanSetting", params)
}

// Set advanced Settings
export function vxlanSetting(params) {
    return request.post("/vsm/vsr/vxlanSetting", params)
}

// Gets the vsrVpn list
export function getVsrVpnList(params) {
    return getRequest("/vsm/vsr/getVsrVpnList", params)
}

// Get the Vpn name repeated
// export function getVpnName(params) {
//     return getRequest("/vsm/vsr/getVpnName", params)
// }

// Get servers for all VPNS
export function getVpnAllServer(params) {
    return getRequest("/vsm/vsr/getVpnAllServer", params)
}

// Get all of the tenant's equipment
// export function getRentAllMachine(params) {
//     return request.post("/vsm/vsr/getRentAllMachine", params)
// }

// Get the VPN role
export function getVpnRole() {
    return getRequest("/vsm/vsr/getVpnRole")
}

// New VPN Advanced Settings
export function addVsrVpnSuper(params) {
    return request.post("/vsm/vsr/addVsrVpnSuper", params)
}

// Gets the VPN Advanced Settings
export function getVpnSuper(params) {
    return getRequest("/vsm/vsr/getVpnSuper", params)
}

// Whether the TUNNEL IP of VPN is the same
export function isVpnChannelIp(params) {
    return request.post("/vsm/vsr/isVpnChannelIp", params)
}

// Add new vsrVpn
// export function addVsrVpn(params) {
//     return request.post("/vsm/vsr/addVsrVpn", params)
// }

// Edit vsrVPN
// export function editVsrVpn(params) {
//     return request.post("/vsm/vsr/editVsrVpn", params)
// }

// The device VPN tunnel IP repeated check
export function isRepeatVpnTunIp(params) {
    return request.post("/vsm/vsr/isRepeatVpnTunIp", params)
}

// Gets the VSR1000 device and default device for the tenant
// export function getRentAllServerMachine(params) {
//     return request.post("/vsm/vsr/getRentAllServerMachine", params)
// }

// Delete VsrVpn in batch
export function delBatchVsrVpn(params) {
    return request.post("/vsm/vsr/delBatchVsrVpn", params)
}

// Gets the outgoing interface of the static route
// export function getLogicOutPortList(params) {
//     return request.post("/vsm/vsr/getLogicOutPortList", params)
// }

// Gets the tenant routing domain bound to the logical port or GRE
// Gets the tenant routing domain bound to the logical port or GRE
// export function getStaticRentUser(params) {
//     return getRequest("/vsm/vsr//getStaticRentUser", params)
// }

// Get static list
// export function getStaticList(params) {
//     return getRequest("/vsm/vsr/getStaticList", params)
// }

// Add New Static
// export function addStatic(params) {
//     return request.post("/vsm/vsr/addStatic", params)
// }

// Edit Static
// export function editStatic(params) {
//     return request.post("/vsm/vsr/editStatic", params)
// }

// Delete vsrStatic
// export function delBatchSta(params) {
//     return request.post("/vsm/vsr/delBatchSta", params)
// }

// Query the DEVICE IP
// export function findByRepeatIp(params) {
//     return getRequest('/device/findByRepeatIp', params)
// }

// Get the Policy list
// export function getPolicyList(){
//     return getRequest("/vsm/vsr/getPolicyList")
// }

// Getting the ACL list
// export function getAclList(params) {
//     return getRequest("/vsm/vsr/getAclList", params)
// }

// Get action options
// export function getActItem(params) {
//     return getRequest("/vsm/vsr/getActItem", params)
// }

// Get application options
// export function getAppNames(params) {
//     return getRequest("/vsm/vsr/getAppNames", params)
// }

// The new ACL
// export function addAcl(params) {
//     return request.post("/vsm/vsr/addAcl", params)
// }

// Delete/Remove the ACL
// export function delBatchAcl(params) {
//     return request.post("/vsm/vsr/delBatchAcl", params)
// }

// Get ACL details
// export function getAclDetail(params) {
//     return getRequest("/vsm/vsr/getAclDetail", params)
// }

// Edit the ACL
// export function editAcl(params) {
//     return request.post("/vsm/vsr/editAcl", params)
// }

// Verify that acl names are unique
// export function getACLName(params) {
//     return getRequest("/vsm/vsr/getACLName", params)
// }

// Get CGNAT
export function getCgnatList(params) {
    return getRequest("/vsm/vsr/getCgnatList", params)
}

// Add New cgant
export function addCgnat(params) {
    return request.post("/vsm/vsr/addCgnat", params)
}

// Edit CGNAT
export function editCgnat(params) {
    return request.post("/vsm/vsr/editCgnat", params)
}

// View the CGNAT side table
export function getCgnatAddrDetail(params) {
    return getRequest("/vsm/vsr/getCgnatAddrDetail", params)
}

// Delete CGNAT in batches
export function delBatchCgnat(params) {
    return request.post("/vsm/vsr/delBatchCgnat", params)
}

// Get protocol options
export function getProtoclItems(params) {
    return getRequest("/vsm/vsr/getProtoclItem", params)
}

// Gets a list of stream groups
export function getStreamList(params) {
    return getRequest("/vsm/dev/getStreamList", params)
}

// Whether a stream group can be edited
export function canEditSg(params) {
    return request.post("/vsm/dev/canEditSg", params)
}

// The new flow group
export function addStream(params) {
    return request.post("/vsm/dev/addStream", params)
}

// Deletes the selected stream group
export function delStreams(params) {
    return request.post("/vsm/dev/delStreams", params)
}

// Copies the selected stream group
export function copyStreams(params) {
    return request.post("/vsm/dev/copyStreams", params)
}

// Edit flow group
export function editStream(params) {
    return request.post("/vsm/dev/editStream", params)
}

// Stream group name uniqueness check
export function isSgNamExit(params) {
    return getRequest('/vsm/dev/isSgNamExit', params, false)
}

// Get the application type
export function toAddStream(params) {
    return getRequest("/vsm/dev/toAddStream", params, false)
}

// Device VSR-Lite module
// DHCP service Settings
export function setDhcp(params) {
    return request.post('/dhcp/addOrEditService', params)
}

// Get DCHCP service details
export function getDhcp(params) {
    return getRequest('/dhcp/getServiceByDeviceId', params)
}

//获取DCHCP列表
// Getting the DCHCP list
//Getting the DCHCP list
export function getDhcpServerList(params) {
    return getRequest('/dhcp/getByCondition', params)
}

//relan口设置
// RELAN port Settings
//RELAN port Settings
export function addRELan(params) {
    return request.post('/relan/add', params)
}
//获取relan的详情
// Get the RELAN details
//Get the RELAN details
export function getRELanDetails(params) {
    return getRequest('/relan/getRELanById', params)
}

//lan口设置
// LAN port Settings
//LAN port Settings
export function addLan(params) {
    return request.post('/lan/addOrEdit', params)
}
//获取lan的详情
// Get the LAN details
//Get the LAN details
export function getLanDetails(params) {
    return getRequest('/lan/getLanById', params)
}

//lite vpn名称唯一性校验
// Lite VPN name uniqueness check
//Lite VPN name uniqueness check
export function findIsOnlyName(params) {
    return getRequest('/vpn/findIsOnlyName', params, false)
}

//获取SiteVpn
export function siteVpnOptions(params) {
    return getRequest('/vpnSite/siteVpnOptions', params, false)
}

// vsr-100获取租户的所有设备
// Vsr-100 gets all of the tenant's devices
// Vsr-100 gets all of the tenant's devices
export function getRentListMachine(params) {
    return getRequest('/vpn/vsr/getVsrLiteVpnServer', params, false)
}
//编辑vpn
// Edit the VPN
//edit vpn
export function setVpn(params) {
    return request.post('/vpn/vse/addOrEdit', params)
}
//批量删除Vpn
// Delete Vpn in batch
//Delete Vpn in batch
export function delVpn(params) {
    return request.post('/vpn/del', params)
}
//获取vpn列表
// Getting the VPN list
//Getting the VPN list
export function getVpn(params) {
    return getRequest('/vpn/getByCondition', params)
}
//获取vpnSite列表
// Getting the VPN list
//Getting the VPN list
export function getVpnSite(params) {
    return getRequest('/vpnSite/getByCondition', params)
}
//编辑vpn
// Edit the VPN
//edit vpn
export function saveVpnSite(params) {
    return request.post('/vpnSite/vse/addOrEdit', params)
}

//获取应用下拉选项
// Gets the new application drop-down option
//Gets the new application drop-down option
export function getVpnSelect(params) {
    return getRequest('/vpnSite/options', params)
}

//Site vpn名称唯一性校验
export function checkSiteName(params) {
    return getRequest('/vpnSite/findIsOnlyName', params)
}



//批量删除Vpn
// Delete Vpn in batch
//Delete Vpn in batch
export function delSiteVpn(params) {
    return getRequest('/vpnSite/del', params)
}

//获取static列表
// Get static list
//Getting the VPN list
export function getLStatic(params) {
    return getRequest('/static/vse/getByCondition', params)
}
//删除static列表
// Remove static list
//Remove static list
export function delLStatic(params) {
    return request.post('/static/vse/del', params)
}
//新增编辑static列表
// New edit static list
//New edit static list
export function setLStatic(params) {
    return request.post('/static/vse/addOrEdit', params)
}
//获取lanAcl列表
// Gets the lanAcl list
//Getting lan-acl list
export function getLanAcl(params) {
    return getRequest('/acl/getLanAclByCondition', params)
}
//编辑lanAcl
// Edit lanAcl
//edit lanAcl
export function setLanAcl(params) {
    return request.post('/acl/addOrEditLanAcl', params)
}
//删除lanAcl
// Delete lanAcl
//delete lanAcl
export function delLanAcl(params) {
    return request.post('/acl/del/lan', params)
}
//查找lan-acl序列号
// Find the LAN-ACL sequence number
//Find the LAN-ACL sequence number
export function findLanAclOderNum(params) {
    return getRequest('/acl/findLanAclOderNum', params, false)
}
//vpn-acl
//获取vpnAcl列表
// Gets the vpnAcl list
//Gets the vpnAcl list
export function getVpnAcl(params) {
    return getRequest('/acl/getVpnAclByCondition', params)
}
//vpnAcl
// New edit vpnAcl
//New edit vpnAcl
export function setVpnAcl(params) {
    return request.post('/acl/addOrEditVpnAcl', params)
}
//vpnAcl
// Delete vpnAcl
//delete vpnAcl
export function delVpnAcl(params) {
    return request.post('/acl/del/vpn', params)
}
// Download configuration file
//Download configuration file
export function configDownload(params) {
    return request.post('/devConfig/configDownload', params)
}
// Tenant routing domain
// Tenant routing domain name uniqueness check
export function vrfName(params) {
    return request.post('/tenant/vrf/isNameExist', params, { headers: { 'showLoading': false } })
}
// Gets a list of tenant routing domains
export function rentRF(params) {
    return request.post('/tenant/vrf/searchInfo', params)
}
// 新增编辑租户路由域
// Added edit tenant routing domain
// Added edit tenant routing domain
export function rentRFSet(params) {
    return request.post('/tenant/vrf', params)
}
// 删除租户路由域
// Delete the tenant routing domain
// Delete the tenant routing domain
export function rentRFdel(params) {
    return getRequest('/tenant/vrf/del', params)
}
//基础设备名称重复校验
// The base device name is checked repeatedly
//The base device name is checked repeatedly
export function isNamExit(params) {
    return request.post('/device/canNameUse', params, { headers: { 'showLoading': false } })
}
//获取设备可选租户列表
// Gets a list of optional tenants for the device
//Gets a list of optional tenants for the device
export function deviceSelect(params) {
    return getRequest('/tenant/select', params, false)
}
//获取设备序列号和名称下拉菜单
// Gets the device serial number and name drop-down menu
//Get device serial number and name drop-down menu
export function getDevSerialName(params) {
    return getRequest('/device/getDevSerialName', params, false)
}

//获取设备下拉菜单
// Gets the device  drop-down menu
//Get device  drop-down menu
export function getDevSelect(params) {
    return getRequest('/device/getDevSelect', params, false)
}

//编辑设备
// Edit equipment
//Edit equipment
export function deviceSet(params) {
    return request.post('/device/devEdit', params)
}
//vsr同步vsa
// VSR synchronous vsa
//VSR synchronous vsa
export function syncVsa() {
    return postRequest('/vsa/sync')
}

export function downloadEdgeISO(params) {
    return postRequestToDownloadZip('/vsa/edgeiso', params)
}

//设备克隆
// Equipment cloning
//Equipment cloning
//清空设备名和所属租户
// Empty the equipment name and the owned tenant
//Empty the equipment name and the owned tenant
export function clearUpNameAndRelation(params) {
    return request.post('/device/clearUpNameAndRelation', params)
}
//配置清空
// Configuration to empty
//Configuration to empty
export function clearUpConfiguration(params) {
    return postRequest('/devConfig/clearUpConfiguration', params)
}
//查询当前设备是否有配置信息
// Query the current device for configuration information
//Query the current device for configuration information
export function verifyTheDevHaveConf(params) {
    return request.post('/device/verifyTheDevHaveConf', params)
}
//已有配置设备列表用于克隆
// A list of configured devices is available for cloning
//A list of configured devices is available for cloning
export function haveConfigurationDevices(params) {
    return request.post('/device/haveConfigurationDevices', params)
}
//设备克隆
// Equipment cloning
//Equipment cloning
export function devClone(params) {
    return request.post('/device/devClone', params)
}

//应用
// application
//apply
//获取应用所属租户
// Get the tenant to which the application belongs
//Get the tenant to which the application belongs
export function tenantSelect(params) {
    return getRequest('/tenant/select', params, false)
}
//获取应用下拉选项
// Gets the application drop-down option
//Gets the application drop-down option
export function appsSelect(params) {
    return getRequest('/apps', params, false)
}
//基础应用名称重复校验
// The base application repeats the name check
//The base application repeats the name check
export function appNamExit(params) {
    return postRequest('/apps/canNameUse', params, { headers: { 'showLoading': false } })
}


export function isPriorityExist(params) {
    return postRequest('/apps/isPriorityExist', params, { headers: { 'showLoading': false } })
}
//分页展示应用信息
// Paging displays application information
//Paging displays application information
export function apply(params) {
    return request.post('/apps', params)
}
//新增编辑应用
// New Editing app
//New Editing app
export function applySet(params) {
    return request.post('/apps/saveOrFlush', params)
}

//检查应用是否添加成功
// New Editing app
//New Editing app
export function checkAppSave(params) {
    return postRequest('/apps/checkSave', params)
}

//复制所有指定的应用
// Copies all specified applications
//Copies all specified applications
export function applyCopy(params) {
    return postRequest('/apps/copyApp', params)
}
//删除所有指定应用
// Deletes all specified applications
//Deletes all specified applications
export function applyDel(params) {
    return request.post('/apps/haveBeenQuoted', params)
}
//删除所有指定应用
// Check before modification
//Check before modification
export function applycheck(params) {
    return request.post('/apps/checkBeenQuoted', params)
}
//获取应用配置
export function applyGet(params) {
    return getRequest('/apps/getApp', params)
}
//设置时区
// Set the time zone
//Set the time zone
export function dateSet(params) {
    return getRequest('/setting/setTimezone', params)
}
//获取当前时区
// Get the current time zone
//Get the current time zone
export function dateGet(params) {
    return getRequest('/setting/getTimezoneTime', params)
}
//设置本机升级时间
// Set the native upgrade time
//Set the native upgrade time
export function upDate(params) {
    return getRequest('/setting/setUpgrade', params)
}
//用户管理
// User management
//user control
export function getUserList(params) {
    return getRequest('/user/getByCondition', params, false)
}
export function addControlUser(params) {
    return postRequest('/user/add', params, false)
}
export function editControlUser(params) {
    return postRequest('/user/edit', params)
}
export function delControlUser(params) {
    return postRequest('/user/delById', params)
}
// export function getUserPermission(params) {
//     return getRequest('/role/getAllList', params)
// }
export function getUserPermission(params) {
    return getRequest('/user/getRoleInfoByTenantId', params, false)
}
//分页获取超级管理员
// Paging gets the super administrator
//Paging gets the super administrator
export function userGet(params) {
    return getRequest('/vsm/systemSet/vsnUser/getByCondition', params)
}
//添加超级管理员
// Add super administrator
//Add super administrator
export function userAdd(params) {
    return request.post('/vsm/systemSet/vsnUser/add', params)
}
//修改超级管理员
// Modify super administrator
//Modify super administrator
export function userEdit(params) {
    return request.post('/vsm/systemSet/vsnUser/edit', params)
}
//删除超级管理员
// Delete super administrator
//Delete super administrator
export function userDel(params) {
    return request.post('/vsm/systemSet/vsnUser/delete', params)
}
//用户管理-租户管理员
// User management - Tenant administrator
//User management - Tenant administrator
//添加租户管理员
// Add tenant administrator
//Add tenant administrator
export function vsmRentAdd(params) {
    return request.post('/vsm/systemSet/vsmRent/add', params)
}
//获取租户管理员权限信息
// Gets tenant administrator rights information
//Gets tenant administrator rights information
export function vsmRentGetPer(params) {
    return getRequest('/vsm/systemSet/vsmRent/getPer', params)
}
//删除租户管理员
// Delete tenant administrator
//Delete tenant administrator
export function vsmRentDel(params) {
    return request.post('/vsm/systemSet/vsmRent/delete', params)
}
//修改租户管理员
// Modify tenant administrator
//Modify tenant administrator
export function vsmRentEdit(params) {
    return request.post('/vsm/systemSet/vsmRent/edit', params)
}
//分页获取租户管理员
// Paging gets the tenant administrator
//Paging gets the tenant administrator
export function vsmRentGet(params) {
    return getRequest('/vsm/systemSet/getRentManagerList', params)
}
//获取租户管理员所属租户列表
// Gets the tenant administrator's tenant list
//Gets the tenant administrator's tenant list
export function vsmRentShu(params) {
    return getRequest('/vsm/systemSet/vsmRent/getRent', params)
}
//租户管理
// Tenant management
//Tenant management
//租户名称是否重复
// Whether the tenant name is duplicate
//Whether the tenant name is duplicate
export function rentName(params) {
    return request.post('/tenant/isNameExist', params, { headers: { 'showLoading': false } })
}
//分页获取设置租户管理列表
// Paging gets the set tenant management list
//Paging gets the set tenant management list
export function rentGet(params) {
    return postRequest('/tenant/findByCondition', params)
}
//租户删除
// The tenant to delete
//The tenant to delete
export function rentDel(params) {
    return getRequest('/tenant/delTenant', params)
}
//新增编辑租户
// New Editor tenant
//New Editor tenant
export function Setrent(params) {
    return postRequest('/tenant', params)
}
//获取vsc列表
// Gets the VSC list
//Gets the VSC list
export function vscGet() {
    return getRequest('/setting/vsc')
}
//身份认证
// The identity authentication
//identity authentication
export function syncVsm(params) {
    return postRequest('/vsm/sync', params)
}
//邮件
// mail
//email
//分页获取邮件列表
// Paging to get the mailing list
//Paging to get the mailing list
export function getMail(params) {
    return getRequest('/monitor/mail/getByCondition', params)
}
//获取可用分组数据
// Gets the available packet data
//Gets the available packet data
export function getMailGroup(params) {
    return getRequest('/monitor/mail/select/group', params)
}
//新增编辑通知组
// New edit notification group
//New edit notification group
export function multiAddGroup(params) {
    return request.post('/monitor/mail/multiAddGroup', params)
}
//获取可用设备或链路数据
// Gets available device or link data
//Gets available device or link data
export function getMailSelectType(params) {
    return getRequest("/monitor/mail/select/type", params, false)
}
//新增通知设置
// New notification Settings
//New notification Settings
export function monitorMail(params) {
    return postRequest('/monitor/mail', params)
}
//通知名称唯一性校验
// Advise name uniqueness check
//Advise name uniqueness check
export function mailCheck(params) {
    return request.post('/monitor/mail/check', params, { headers: { 'showLoading': false } })
}
//删除通知设置
// Delete notification Settings
//Delete notification Settings
export function mailDel(params) {
    return deleteRequest('/monitor/mail', params)
}
//通知组是否可删
// Notifies whether the group can be deleted
//Notifies whether the group can be deleted
export function mailCanDel(params) {
    return postRequest('/monitor/mail/calDel', params)
}
//删除通知组
// Delete notification group
//Delete notification group
export function delMailGroup(params) {
    return deleteRequest('/monitor/mail/delGroup', params)
}
// 监控
// monitoring
//  monitoring
//删除收藏夹单个表
// Delete favorites single table
//Delete favorites single table
export function removeFavoriteChart(params) {
    return deleteRequest('/monitor/device/removeFavoriteChart', params)
}
// 监控设备的设备分组选择
// Device grouping selection for monitoring devices
// Device grouping selection for monitoring devices
export function favoriteDeviceGroupCheck(params) {
    return getRequest('/monitor/device/favoriteDeviceGroupCheck', params, false)
}
// 监控设备的设备分组展示组内设备及关注的图表信息
// Monitor equipment group displays equipment and concern chart information within the group
// Monitor equipment group displays equipment and concern chart information within the group
export function favoriteDeviceGroupChart(params) {
    return getRequest('/monitor/device/favoriteDeviceGroupChart', params)
}
// 获取收藏夹内全部设备的链路流量、延迟丢包图表信息
// Get the link flow and packet delay diagram information of all devices in the favorites
// Get the link flow and packet delay diagram information of all devices in the favorites
export function favoriteTunnelGroupChart(params) {
    return getRequest('/monitor/device/favoriteTunnelGroupChart', params)
}
// 监控设备的链路分组选择
// Monitor link packet selection for equipment
// Monitor link packet selection for equipment
export function favoriteTunnelGroupCheck(params) {
    return getRequest('/monitor/device/favoriteTunnelGroupCheck', params, false)
}
// 删除收藏夹
// Delete favorites
// Delete favorites
export function favoriteDel(params) {
    return deleteRequest('/favorite/favorite', params)
}
//获取当前收藏夹下的设备及图表数量
// Gets the number of devices and charts under the current favorites
//Gets the number of devices and charts under the current favorites
export function favoriteCount(params) {
    return getRequest("/favorite/favorite/count", params)
}

//获取日志列表
// Get log list
//Get log list
export function getlog(params) {
    return getRequest('/monitor/log', params)
}
//下载日志exacl
// Download log Exacl
//Download log Exacl
// export function downloadLog(params) {
//     return getRequest('/monitor/log/download', params)
// }
//清空系统日志
// Clear the system log
//Clear the system log
export function delLogNote(params) {
    return deleteRequest('/monitor/log', params)
}
//wescoket加mqtt
// Add the MQTT wescoket
//wescoket add mqtt
export function test(params) {
    return request.post('/mqtt/callback/sendMsgToMq', params)
}
// 获取vsr和vsr.cloud连接总数
// Gets the total number of VSR and VSR.cloud connections
// Gets the total number of VSR and VSR.cloud connections
export function getLinkNum(params) {
    return getRequest('/index/deviceConnectionCount', params);
}

// 获取VPN连接总数
// Gets the total number of VSR and VSR.cloud connections
// Gets the total number of VSR and VSR.cloud connections
export function getVpnsNum(params) {
    return getRequest('/index/getVpns', params);
}

// 首页设备运行状态
// The running state of the device on the homepage
// The running state of the device on the homepage
export function getDevState(params) {
    return getRequest('/index/deviceRunningStatus', params, false);
}
// 获取首页CPU和内存排行
// Get home CPU and memory ranking
// Get home CPU and memory ranking
export function getCpuMemoryRank(params) {
    return getRequest('/index/deviceCpuMemoryRanking', params, false);
}

// 获取首页CPU和内存排行
// Get home CPU and memory ranking
// Get home CPU and memory ranking
export function deviceRankingInit(params) {
    return getRequest('/index/deviceRankingInit', params, false);
}

// 获取首页CPU和内存排行
// Get home CPU and memory ranking
// Get home CPU and memory ranking
export function deviceSortBy(params) {
    return getRequest('/index/deviceSortBy', params, false);
}

// 获取首页设备流量消耗和链路状态排行数据
// Get home device traffic consumption and link status ranking data
// Get home device traffic consumption and link status ranking data
export function getFlowLinkRank(params) {
    return getRequest("/index/deviceFlowLossRanking", params, false);
}
// 获取总体速率监控
// Get overall rate monitoring
// Get overall rate monitoring
export function getWatch(params) {
    return getRequest("/index/deviceFlowChart", params);
}
// 查询租户信息
// Query tenant information
// Query tenant information
export function getSelectTenant(params) {
    return getRequest("/index/selectTenant", params);
}
// 告警管理/事件定义
// Alarm management/event definition
// Alarm management/event definition
// 获取事件定义数据列表
// Gets a list of event definition data
// Gets a list of event definition data
export function getEvents(params) {
    return getRequest("/mon/getEvents", params);
}
// 删除一行列表数据
// Delete the row list data
// Delete the row list data
export function deleteRow(params) {
    return deleteRequest("/mon/events/del", params);
}
// // 编辑一行列表数据
// Edit the row list data
// // Edit the row list data
// export function editRow(params) {
//     return request.post('/mon/events/doEdit', params)
// }
// // 新增一行列表数据
// Add row list data
// // Add row list data
// export function addRow(params) {
//     return request.post('/mon/addEvent', params)
// }
// 新增一行列表数据
// Add row list data
// Add row list data
export function addRow(params) {
    return request.post('/mon/addOrEditEvent', params)
}
// 获取告警信息数据列表
// Gets a list of alarm information data
// Gets a list of alarm information data
export function getAlarmInfos(params) {
    return postRequest("/mon/getInfos", params);
}
// 将未处理标记为已解决
// Mark unprocessed as resolved
// Mark unprocessed as resolved
export function changeSlove(params) {
    return request.post('/mon/infos/changeSolve', params);
}
// 获取各类告警信息
// Get all kinds of alarm information
// Get all kinds of alarm information
export function getTypeInfoNum(params) {
    return getRequest("/mon/getTypeInfoNum", params);
}
// 权限查找模糊搜索
// Permission lookup fuzzy search
// Permission lookup fuzzy search
export function getRestaurants(params) {
    return getRequest("/mon/infos/getAllWarnDev", params);
}
export function getFindStaticOutInter(params) {
    return getRequest("/vpn/findStaticOutInter", params)
}
// 获取定义事件类型
// Gets the defined event type
// Gets the defined event type
export function getEventType(params) {
    return getRequest('/mon/getEventType', params)
}
//添加或编辑设备组
// Add or edit device groups
//Add or edit device groups
export function editEventDevSerNums(params) {
    return postRequest('/mon/editEventDevSerNums', params)
}
//告警名称唯一性校验
// Alarm name uniqueness check
//Alarm name uniqueness check
export function checkWarningEventName(params) {
    return getRequest('/mon/checkWarningEventName', params, false)
}
//校验当前添加告警
// Verify that an alarm is currently added
//Verify that an alarm is currently added
export function checkWarningEventRepeat(params) {
    return getRequest('/mon/checkWarningEventRepeat', params)
}

/*
    Rate_limit traffic management and config services START
*/

export function getTrafficProfiles(params) {
    return getRequest('/trafficProfiles/getByCondition', params)
}

export function saveOrFlushTrafficProfile(params) {
    return request.post('/trafficProfiles/saveOrFlush', params)
}

export function deleteTrafficProfile(id) {
    return request.delete('/trafficProfiles/del?id='+id)
}

export function checkNameInUseTrafficProfile(params) {
    return postRequest('/trafficProfiles/canNameUse', params)
}

export function getTrafficLimiters(params) {
    return getRequest('/trafficLimiter/getByCondition', params)
}

export function saveOrFlushTrafficLimiters(params) {
    return request.post('/trafficLimiter/saveOrFlush', params)
}

export function deleteTrafficLimiter(id) {
    return request.delete('/trafficLimiter/del?id='+id)
}

export function checkNameInUseTrafficLimiters(params) {
    return postRequest('/trafficLimiter/canNameUse', params)
}

export function checkPriorityUseTrafficLimiters(params) {
    return postRequest('/trafficLimiter/canPriorityUse', params)
}

export function selectOptionsTrafficLimiters(params) {
    return getRequest('/trafficLimiter/selectOptions', params)
}
/*
    Rate_limit traffic management and config services END
*/


/* 新接口*/
/* The new interface*/

// 基础模块
// Basic module
// basic module
//设备同步，设备分配租户
// Equipment synchronization, equipment allocation tenants
//Equipment synchronization, equipment allocation tenants
export function connectTenant(params) {
    return postRequest('/device/connect/tenant', params)
}
//设备管理
// Equipment management
// equipment management
export function getDeviceList(params) {
    return getRequest("/device/getByCondition", params)
}
//设备复位
// Device reset
//Device reset
export function deviceReset(params) {
    return request.post("/device/reset", params)
}
//设备强制同步
// Device forced synchronization
//Device forced synchronization
export function deviceForceSync(params) {
    return request.post("/device/forceSync", params)
}
//获取指定租户指定类型的有效连接的云账号
// Gets the cloud account for a valid connection of the specified tenant's specified type
//Gets the cloud account for a valid connection of the specified tenant's specified type
export function cloudAccountAccount(params) {
    return getRequest("/cloud/account/account",params)
}
//云设备注册
// Cloud Device Registration
//Cloud Device Registration
export function cloudRegister(params) {
    return getRequest("/cloud/register",params)

}

//设置模块
// Set up the module
//set moudel



/*设备总览*/
/*Equipment overview*/
//获取设备基础信息
// Get basic information about the device
//Get basic information about the device
export function deviceBaseInfo(params) {
    return getRequest("/monitor/device/deviceBaseInfo", params, false)
}

//设备状态
export function onlineStateChart(params) {
    return getRequest("/monitor/device/onlineStateChart", params, false)
}

//cpu负载图
// CPU load figure
//CPU load figure
export function deviceCpuLoadTimeChart(params) {
    return getRequest("/monitor/device/deviceCpuLoadTimeChart", params, false)
}
//内存负载图
// Memory load diagram
//Memory load diagram
export function deviceMemoryLoadTimeChart(params) {
    return getRequest("/monitor/device/deviceMemoryLoadTimeChart", params, false)
}
//设备实时总流量图
// Real-time total flow chart of equipment
//Real-time total flow chart of equipment
export function deviceNetworkFlowTotallyChart(params) {
    return getRequest("/monitor/device/deviceNetworkFlowTotallyChart", params)
}
//获取指定端口在指定时间内的总流量变化
// Gets the total traffic change for a specified port over a specified time
//Gets the total traffic change for a specified port over a specified time
export function devicePortNetworkFlowChart(params) {
    return getRequest("/monitor/device/devicePortNetworkFlowChart", params)
}

/*链路情况*/
/*The link is*/
//获取当前设备全部链路，提供模糊查询
// Gets all links to the current device, providing fuzzy queries
//Gets all links to the current device, providing fuzzy queries
export function deviceTunnelNameCheck(params) {
    return getRequest("/monitor/device/deviceTunnelNameCheck", params)
}
//获取指定设备链路流量信息，包含各隧道流量和丢包
// Gets the specified device link flow information, including the tunnel flow and packet loss
//Gets the specified device link flow information, including the tunnel flow and packet loss
export function deviceTunnelNetworkFlowChart(params) {
    return getRequest("/monitor/device/deviceTunnelNetworkFlowChart", params)
}

//获取指定设备链路流量信息，包含各隧道流量和丢包
// Gets the specified device link flow information, including the tunnel flow and packet loss
//Gets the specified device link flow information, including the tunnel flow and packet loss
export function clientVpnUpAndDownChart(params) {
    return getRequest("/monitor/device/clientVpnUpAndDownChart", params)
}

/*收藏夹*/
/*favorite */
//获取全部收藏夹
// Get all favorites
//Get all favorites
export function getFavorite(params) {
    return getRequest("/favorite/favorite", params)
}
//获取用户对指定图表在不同收藏夹的关注状态
// Gets the user's attention to the specified chart in different favorites
//Gets the user's attention to the specified chart in different favorites
export function getCheckFavorite(params) {
    return getRequest('/monitor/device/checkFavorite', params)
}
//新增收藏夹
// New favorites
//New favorites
export function addFavorite(params) {
    return request.post('/favorite/favorite', params)
}
//修改收藏夹
// Modify favorites
//Modify favorites
export function changeFavorite(params) {
    return request.put('/favorite/favorite', params)
}
//添加到收藏夹
// Add to favorites
//add to favorites
export function addFavoriteContent(params) {
    return getRequest('/monitor/device/changeChartFavorite', params)
}



/*物理端口*/
/*The physical port*/
//获取物理端口列表
// Gets the physical port list
//Gets the physical port list
export function getPortByCondition(params) {
    return getRequest("/port/getByCondition", params)
}

/*物理端口*/
/*The physical port*/
//获取物理端口列表
// Gets the physical port list
//Gets the physical port list
export function getPortList(params) {
    return getRequest("/port/getPortList", params)
}



//更新物理端口
// Update physical port
//Update physical port
export function updatePort(params) {
    return putRequest("/port", params)
}

//更新物理端口 LTE
// Update physical port
//Update physical port
export function updatePortLte(params) {
    return putRequest("/port/updatePortLte", params)
}

//更新物理端口 WIFI
// Update physical port
//Update physical port
export function updatePortWifi(params) {
    return putRequest("/port/updatePortWifi", params)
}

// 获取物理接口
export function getPhysicalPort(params) {
    return getRequest("/port/getPhysicalPort", params)
}

/*GRE*/
//分页获取GRE
// Paging fetch GRE
//Paging fetch GRE
export function getGre(params) {
    return getRequest("/gre/getByCondition", params)
}
//GRE名字是否重复
// Whether the GRE name is repeated
//Whether the GRE name is repeated
export function greIsNameExist(params) {
    return request.post("/gre/isNameExist", params, { headers: { 'showLoading': false } })
}
//ipv4与ipv6的检验
// Ipv4 and ipv6 verification
//Ipv4 and ipv6 verification
export function greCheck(params) {
    return request.post("/gre/check", params, { headers: { 'showLoading': false } })
}
//新增GRE
// The new GRE
//add GRE
export function addGre(params) {
    return postRequest("/gre/add", params)
}
//编辑GRE
// Edit the GRE
//edit GRE
export function editGre(params) {
    return postRequest("/gre/edit", params)
}
//批量删除GRE
// Delete GRE in bulk
//Delete GRE in bulk
export function delGres(params) {
    return request.post("/gre/delGre", params)
}
//新增GRE高级设置
// New GRE Advanced Settings
//New GRE Advanced Settings
export function addGreSuper(params) {
    return request.post("/gre/extra", params)
}
//获取GRE高级设置acl、qos下拉列表
// Gets GRE advanced Settings ACL, qos drop - down list
//Gets GRE advanced Settings ACL, qos drop - down list
export function greExtraOptions(params) {
    return getRequest("/gre/extra/options", params, false)
}
//获取gre租户路由域
// Gets the GRE tenant routing domain
//Gets the GRE tenant routing domain
export function greOptions(params) {
    return getRequest("/gre/options", params)
}


/*static*/
//获取静态路由的出接口
// Gets the outgoing interface of the static route
//Gets the outgoing interface of the static route
export function getLogicOutPortList(params) {
    return request.post("/static/vsr/getStaticOutPortList", params, false)
}

//获取被逻辑端口或者GRE绑定的租户路由域
// Gets the tenant routing domain bound to the logical port or GRE
//Gets the tenant routing domain bound to the logical port or GRE
export function getStaticRentUser(params) {
    return request.post("/static/vsr/getStaticRentAreaList", params, false)
}
//获取static列表
// Get static list
//Get static list
export function getStaticList(params) {
    return getRequest("/static/vsr/getByCondition", params)
}
//新增Static
// New Static
//New Static
export function addStatic(params) {
    return request.post("/static/vsr/add", params)
}
//编辑Static
// Edit the Static
//edit Static
export function editStatic(params) {
    return request.post("/static/vsr/edit", params)
}
//删除vsrStatic
// Delete vsrStatic
//delete vsrStatic
export function delBatchSta(params) {
    return request.post("/static/vsr/del", params)
}

//检查是否已设置指定name
export function nameExistStatic(params) {
    return getRequest("/static/vsr/nameExist", params)
}

//查询本设备ip
// Query the DEVICE IP
//Query the DEVICE IP
export function findByRepeatIp(params) {
    return getRequest('/device/findByRepeatIp', params, false)
}
// //static ipv6简写全写转换
// Static ipv6 - Full write conversion
// //static Ipv6 short for full write conversion
// export function deviceGetFullOrAbbIpv6(params){
//     return postRequest("/device/getFullOrAbbIpv6",params)
// }
//ip地址重复性校验
// IP address repeatability check
//IP address repeatability check
export function checkRepeatIp(params) {
    return request.post("static/vsr/checkRepeatIp", params, { headers: { 'showLoading': false } })
}
//下一跳地址重复性校验
// Next hop address repeatability check
//Next hop address repeatability check
export function checkRepeatNextIp(params) {
    return request.post("static/vsr/checkRepeatNextIp", params, { headers: { 'showLoading': false } })
}
//ipv6 简写转全写
// Ipv6 shorthand for complete translation
//ipv6 So let me write it all out
export function deviceSimpleIPV6ToFullIPV6(params) {
    return postRequest("/device/simpleIPV6ToFullIPV6", params, false)
}
//ipv6 全写转简写
// Ipv6 is full translation
//ipv6 Let me write it all
export function deviceFullIPV6ToSimpleIPV6(params) {
    return postRequest("/device/fullIPV6ToSimpleIPV6", params, false)
}
//ipv6 地址校验
// Ipv6 address verification
//ipv6 address check
export function staticCheckDestIp(params) {
    return postRequest('/static/vsr/checkDestIp', params, false)
}

/*vpn*/
//分页获取vpn列表
// Paging to get the VPN list
//Paging to get the VPN list
export function vpnGetByCondition(params) {
    return getRequest("/vpn/vsr/getByCondition", params)
}
/*vpn*/
//分页获取vpn列表
// Paging to get the VPN list
//Paging to get the VPN list
export function vpnGetByRole(params) {
    return getRequest("/vpn/vsr/getByRole", params)
}


// 检查该设备逻辑端口是否已绑定vlanId和物理端口
// Check that the device logical port is bound to the vlanId and physical port
// Check that the device logical port is bound to the vlanId and physical port
export function vlanIdAndPortIdExist(params) {
    return getRequest('/logical/vlanIdAndPortIdExist', params, false)
}
//获取逻辑端口选项
// Gets the logical port option
//Gets the logical port option
export function getLoginPort(params) {
    return request.post("/vpn/vsr/getLoginPort", params, { headers: { 'showLoading': false } })
}
//获取租户的所有设备
// Get all of the tenant's equipment
//Get all of the tenant's equipment
export function getRentAllMachine(params) {
    return request.post("/vpn/vsr/getRentAllMachine", params, { headers: { 'showLoading': false } })
}
//获取该租户的VSR1000的设备和default的设备
// Gets the VSR1000 device and default device for the tenant
//Gets the VSR1000 device and default device for the tenant
export function getRentAllServerMachine(params) {
    return request.post("/vpn/vsr/getRentAllServerMachine", params, { headers: { 'showLoading': false } })
}
//vpn的隧道ip是否重复
// Whether the VPN tunnel IP is repeated
//Whether the VPN tunnel IP is repeated
export function getVpnChannelIp(params) {
    return request.post("/vpn/vsr/getVpnChannelIp", params, { headers: { 'showLoading': false } })
}
//获取所有vpn的名称重复
// Get duplicate names for all VPNS
//Get duplicate names for all VPNS
export function getVpnName(params) {
    return getRequest("/vpn/vsr/getVpnName", params, false)
}
//新增或编辑vpn
// Add or edit VPN
//Add or edit VPN
export function addVsrVpn(params) {
    return postRequest("/vpn/vsr/add", params, { headers: { 'showLoading': false } })
}
//批量删除VPN
// Delete VPN in batch
//Delete VPN in batch
export function delVsrVpn(params) {
    return request.post("/vpn/vsr/del", params)
}
//edit VPN
export function editVsrVpn(params) {
    return request.post("/vpn/vsr/edit", params)
}
//新增VPN高级设置
// New VPN Advanced Settings
//New VPN Advanced Settings
export function addVpnSuperSetting(params) {
    return request.post("/vpn/vsr/addVpnSuperSetting", params)
}
//vpn获取acl、qos下拉菜单
// VPN access ACL, qos drop - down menu
//VPN access ACL, qos drop - down menu
export function vpnExtraOptions(params) {
    return getRequest("/vpn/vsr/extra/options", params, false)
}
//获取租户路由域
// Gets the tenant routing domain
//Gets the tenant routing domain
export function getRentVrfList(params) {
    return request.post("/com/getRentVrfList", params, { headers: { 'showLoading': false } })
}
/*qos*/
//分页获取QOS
// Paging QOS acquisition
//Paging QOS acquisition
export function getQosByCondition(params) {
    return postRequest("/qos", params)
}
//新增编辑QOS信息
// Added edit QOS information
//Added edit QOS information
export function qosSaveOrFlush(params) {
    return request.post("/qos/saveOrFlush", params)
}

//qos名字是否重复
// Whether the qos name is repeated
//Whether the qos name is repeated
export function qosIsNameExist(params) {
    return request.post("/qos/canNameUse", params, { headers: { 'showLoading': false } })
}

//查询某设备的流组主键和名称及已编辑或新增
// Query the stream group primary key and name of a device and edit or add
//Query the stream group primary key and name of a device and edit or add
export function qosToAddOrEdit(params) {
    return getRequest("/qos", params, false)
}

/*qos*/
//获取QOS
// Paging QOS acquisition
//Paging QOS acquisition
export function getQosById(params) {
    return postRequest("/qos/getQos", params)
}


//qos是否被引用，若是删除动作，没有引用的会被删除
// Whether qos is referenced or not, and if the delete action is taken, those that are not referenced will be deleted
//Whether qos is referenced or not, and if the delete action is taken, those that are not referenced will be deleted
export function qosAreBeenQuoted(params) {
    return postRequest("/qos/areBeenQuoted", params)
}
//复制所选OQS
// Copy the selected OQS
//Copy the selected OQS
export function qosCopQos(params) {
    return postRequest("/qos/copQos", params)
}
//获取qos详情
// Obtaining qos details
//Obtaining qos details
export function comGetQosDetails(params) {
    return getRequest("/vpn/vsr/getQosDetails", params)
}

/*流组*/
/*Flow group*/
//分页获取流组
// Paging gets stream groups
//Paging gets stream groups
export function streamGetByCondition(params) {
    return postRequest("/streamGroup", params)
}
//新增编辑流组
// New edit stream group
//New edit stream group
export function streamSaveOrFlush(params) {
    return request.post("/streamGroup/saveOrFlush", params)
}
//流组名字是否重复
// Whether the stream group name is repeated
//Whether the stream group name is repeated
export function streamIsNameExist(params) {
    return request.post("/streamGroup/canNameUse", params, { headers: { 'showLoading': false } })
}
//查询某租户的所有应用的主键和名称，以编辑或新增
// Query the primary keys and names of all applications for a tenant to edit or add
//Query the primary keys and names of all applications for a tenant to edit or add
export function streamToAddOrEdit(params) {
    return getRequest("/streamGroup", params, false)
}
//流组是否被引用,若是删除动作，没引用的就删掉
// If the stream group is referenced, if the delete action is taken, the unreferenced group is deleted
//If the stream group is referenced, if the delete action is taken, the unreferenced group is deleted
export function streamAreBeenQuoted(params) {
    return request.post("/streamGroup/isBeenQuoted", params)
}
//复制所选流组
// Copies the selected stream group
//Copies the selected stream group
export function streamCopyStreamGroup(params) {
    return getRequest("/streamGroup/copyStreamGroup", params)
}
/*ACL*/
//获取ACL列表
// Getting the ACL list
//Getting the ACL list
export function getAclList(params) {
    return postRequest("/bigAcl", params)
}
// //获取动作选项
// Get action options
// //Get action options
// export function getActItem(params) {
//     return getRequest("/vsm/vsr/getActItem", params)
// }
//获取应用选项
// Get application options
//Get application options
export function getAppNames(params) {
    return getRequest("/bigAcl", params, false)
}
//新增ACL
// The new ACL
//The new ACL
export function addAcl(params) {
    return request.post("/bigAcl/addOrFlush", params)
}
//删除ACL
// Remove the ACL
//delete ACL
export function delBatchAcl(params) {
    return request.post("/acl/vsr/delAcl", params)
}
//获取ACL详情
// Get ACL details
//Get ACL details
export function getAclDetail(params) {
    return getRequest("/vpn/vsr/getAclDetails", params, false)
}
//编辑ACL
// Edit the ACL
//edit ACL
export function editAcl(params) {
    return request.post("/acl/vsr/editAcl", params)
}
//校验acl名字唯一性
// Verify that acl names are unique
//Verify that acl names are unique
export function getACLName(params) {
    return request.post("/bigAcl/canNameUse", params, { headers: { 'showLoading': false } })
}
//判断acl编辑与删除是否可行
// Determine if ACL editing and deleting are feasible
//Determine if ACL editing and deleting are feasible
export function aclVsrCheck(params) {
    return request.post("/bigAcl/areBeenQuoted", params, false)
}
//acl ipv6简写转全写
// The abbreviation for ACL ipv6 is transposed to full
//acl Ipv6 shorthand for complete translation
export function aclVsrSimpleIPV6ToFullIPV6(params) {
    return request.post("/acl/vsr/simpleIPV6ToFullIPV6", params, { headers: { 'showLoading': false } })
}


//租户服务设置
// Tenant service Settings
//Tenant service Settings
//条件分页查询租户信息
// Conditional paging queries tenant information
//Conditional paging queries tenant information
export function tenantServiceFindByCondition(params) {
    return request.post("/tenantService/findByCondition", params)
}
//获取租户列表
// Get the tenant list
//Get the tenant list
export function tenantServiceGetRentLists(params) {
    return getRequest("/tenantService/getRentList", params, false)
}
//新增获取租户列表
// New get tenant list
//New get tenant list
export function tenantServiceGetRentList(params) {
    return getRequest("/tenantService/getAddRentList", params, false)
}
//获取租户新增设备列表
// Gets a list of new tenant devices
//Gets a list of new tenant devices
export function tenantServiceGetTenantDeviceList(params) {
    return request.post("/tenantService/getTenantDeviceList", params)
}
//获取设备下的逻辑端口列表
// Gets the list of logical ports under the device
//Gets the list of logical ports under the device
export function tenantServiceGetDeviceLogicalList(params) {
    return request.post("/tenantService/getDeviceLogicalList", params, false)
}
//租户服务设置删除
// Tenant service Settings are deleted
//Tenant service Settings are deleted
export function tenantServiceDel(params) {
    return getRequest("/tenantService/del", params)
}
//租户服务新增
// New tenant services
//New tenant services
export function tenantServiceAdd(params) {
    return request.post("/tenantService/add", params)
}
//租户服务设置编辑
// Edit tenant service Settings
//Edit tenant service Settings
export function tenantServiceEdit(params) {
    return request.post("/tenantService/edit", params)
}
//获取逻辑端口详情
// Gets logical port details
//Gets logical port details
export function tenantServiceGetLogicaDetails(params) {
    return getRequest("/tenantService/getLogicaDetails", params)
}
//获取租户路由域
// Gets the tenant routing domain
//Gets the tenant routing domain
export function tenantServiceGetTenantVrfList(params) {
    return request.post("/tenantService/getTenantVrfList", params, false)
}

//获取新增 Client VPN 可用关联选项
export function tenantServiceGetOptions(params) {
    return getRequest("/tenantService/options", params, false)
}
//新增 Client VPN
export function saveClientVpn(params) {
    return request.post("/tenantService/saveClientVpn", params, false)
}

//删除 Client VPN
export function delClientVpn(params) {
    return request.post("/tenantService/delClientVpn", params, false)
}

//新增 Client VPN
export function getClinetVpn(params) {
    return getRequest("/tenantService/getByCondition", params, false)
}

//获取 Client VPN
export function clientVpnOptions(params) {
    return getRequest("/tenantService/clientVpnOptions", params, false)
}

//证书下载
// Certificate to download
//Certificate to download
export function caRoot() {
    return getRequest("/ca/root")
}

// 设置/角色权限
// Set/role permissions
// Set/role permissions
// 获取角色权限列表
// Gets a list of role permissions
// Gets a list of role permissions
export function getRolelists(params) {
    return getRequest("/role/getByCondition", params)
}
// 删除某一角色
// Delete a role
// Delete a role
export function delRole(params) {
    return deleteRequest(`/role/delByIds/${params}`)
}
// 新增角色获取权限按钮
// Add a role get permission button
// Add a role get permission button
export function getRoleButton(params) {
    return getRequest("/permission/getButtonList", params)
}
// 新增角色及其关联的菜单
// New roles and their associated menus
// New roles and their associated menus
export function addRole(params) {
    return postRequest("/role", params)
}
// 编辑角色及其关联的菜单
// Edit roles and their associated menus
// Edit roles and their associated menus
export function editRole(params) {
    return putRequest("/role", params)
}
// 新增角色获取权限菜单树
// Adds a role to the access menu tree
// Adds a role to the access menu tree
export function getRoleTree(params) {
    return getRequest("/permission/getAllList", params)
}
// 新增角色保存
// New role saving
// New role saving
// export function saveRole(params) {
//     return postRequest(`/role/saveRoleAndPermIdsAnddepIds`, params)
// }
// 通过角色id获取当前角色详细信息
// Get the current role details from the role ID
// Get the current role details from the role ID
export function getRoleInfo(params) {
    return getRequest(`/role/getRoleInfoById`, params)
}
// 编辑角色保存
// Edit role save
// Edit role save
// export function editRole(params) {
//     return postRequest(`/role/editRoleAndPermIdsAnddepIds`, params)
// }
// 获取所有租户
// Get all tenants
// Get all tenants
export function getAllTenant(params) {
    return getRequest(`/tenant/getAll`, params)
}

//基础设备升级
// Infrastructure upgrade
//Infrastructure upgrade
//获取设备升级列表
// Gets the device upgrade list
//Gets the device upgrade list
export function updateList(params) {
    return getRequest("/deviceUpdate/getList", params)
}
//获取可升级设备列表
// Gets a list of upgradable devices
//Gets a list of upgradable devices
export function updateDev(params) {
    return getRequest("/deviceUpdate/getDevs", params)
}
//新增任务下发
// Release of new tasks
//Release of new tasks
export function updateDownloadJob(params) {
    return postRequest('/deviceUpdate/addDownloadJob', params)
}
//终止任务
// Termination of the task
// terminated task
export function updateStopJob(params) {
    return postRequest('/deviceUpdate/stopJob', params)
}
//获取新增模糊搜索下拉数据
// Gets the new fuzzy search drop-down data
//Gets the new fuzzy search drop-down data
export function searchDevsByTenantId(params) {
    return getRequest('/deviceUpdate/searchDevsByTenantId', params, false)
}
//获取设备升级下载详情
// Get device upgrade download details
//Get device upgrade download details
export function updateInfo(params) {
    return getRequest('/deviceUpdate/getDetails', params)
}
//导出设备升级详情excal
// Export device upgrade details excel AL
//Export device upgrade details excel AL
export function upDateDown(params) {
    return getRequest('/deviceUpdate/downLoadExccel', params)
}
//获取所有已经下载完成的设备
// Get all the devices that have been downloaded
//Get all the devices that have been downloaded
export function getAlreadyDownloadDevs(params) {
    return getRequest('/deviceUpdate/getAlreadyDownloadDevs', params)
}
//新增一个更新任务让设备去更新
// Add an update task for the device to update
//Add an update task for the device to update
export function addUpdateJob(params) {
    return postRequest('/deviceUpdate/addUpdateJob', params)
}
//模糊搜索设备升级首页
// Fuzzy search device upgrade home page
//Fuzzy search device upgrade home page
export function searchJobsByTenantId(params) {
    return getRequest('/deviceUpdate/searchJobsByTenantId', params)
}
//移动用户设置
// Mobile user Settings
//Mobile user Settings
//移动用户名字唯一性校验
// Mobile user name uniqueness check
//Mobile user name uniqueness check
export function mobileUserValidName(params) {
    return getRequest("/mobileUser/exist/name", params, false)
}
//获取租户路由域列表
// Gets a list of tenant routing domains
//Gets a list of tenant routing domains
export function mobileUserGetTenantVrfList(params) {
    return request.post("/mobileUser/getTenantVrfList", params, { headers: { 'showLoading': false } })
}

export function getDomainforTenant(params) {
    return getRequest("/mobileUser/getDomainforTenant", params)
}

//条件分页查询租户信息
// Conditional paging queries tenant information
//Conditional paging queries tenant information
export function mobileUserGetByCondition(params) {
    return postRequest("/mobileUser/getByCondition", params)
}
//创建移动用户
// Creating mobile users
//Creating mobile users
export function mobileUserAdd(params) {
    return request.post("mobileUser", params)
}
//删除移动用户
// Delete mobile users
//Delete mobile users
export function mobileUserDel(params) {
    return deleteRequest("/mobileUser", params)
}
//编辑移动用户
// Edit mobile user
//Edit mobile user
export function mobileUserEdit(params) {
    return request.put("/mobileUser", params)
}
//导出移动用户列表
// Export the mobile user list
//Export the mobile user list
export function mobileUserDownload() {
    return request.get("/mobileUser/download")
}
//同步移动用户下发
// Synchronous mobile user issue
//Synchronous mobile user issue
export function mobileUserSyncMobileUser(params) {
    return getRequest("/mobileUser/syncMobileUser", params)
}
//获取第三方认证
// Obtain third-party certification
//Obtain third-party certification
export function getRadius(params) {
    return getRequest("/radius", params)
}
//添加第三方认证
// Add third party authentication
//Add third party authentication
export function createRadius(params) {
    return request.post("/radius", params)
}
//获取radius开启状态
// Gets the RADIUS turned on state
//Gets the RADIUS turned on state
export function radiusGetRadiusEnable(params) {
    return getRequest("/radius/getRadiusEnable", params)
}
//同步radius信息到租户设备
// Synchronize RADIUS information to tenant devices
//Synchronize RADIUS information to tenant devices
export function radiusSynchronous(params) {
    return getRequest("/mobileUser/syncMobileUser", params)
}

// export function saveRole(params){
//     return postRequest(`/role/saveRoleAndPermIdsAnddepIds`, params)
// }

// 设置/vpn地址池分配
// Set up/VPN address pool assignment
// Set up/VPN address pool assignment
// 获取vpn地址池分配列表信息
// Gets VPN address pool assignment list information
// Gets VPN address pool assignment list information
export function getVpnList(params) {
    return request.post('/addrPool/getAddrPoolInfo', params)
}

// 设置/vpn地址池分配
// Set up/VPN address pool assignment
// Set up/VPN address pool assignment
// 获取vpn地址池分配列表信息
// Gets VPN address pool assignment list information
// Gets VPN address pool assignment list information
export function getAddrPool(params) {
    return getRequest('/addrPool/getAddrPool', params)
}

// // 获取租户路由域下拉框数据
// Gets the tenant routing domain drop-down box data
// // Gets the tenant routing domain drop-down box data
// export function getOperas(params) {
//     return getRequest('/addrPool/getOperas', params)
// }
// // vpn地址池保存
// Save the VPN address pool
// // Save the VPN address pool
export function saveVpnPop(params) {
    return request.post('/addrPool/addAddrPool', params)
}

// // vpn地址池保存
// Save the VPN address pool
// // Save the VPN address pool
export function addVpnPop(params) {
    return request.post('/addrPool/saveAddrPool', params)
}

//lite vpn名称唯一性校验
// Lite VPN name uniqueness check
//Lite VPN name uniqueness check
export function findPollName(params) {
    return getRequest('/addrPool/findIsOnlyName', params, false)
}

//分页获取地址池
// Paging gets the logical port
//Paging gets the logical port
export function getPoolList(params) {
    return getRequest('/addrPool/getByCondition', params, false)
}



// 拓扑/资源审批
// Topology/resource approval
// Topology/resource approval
// 获取资源审批列表
// Get the resource approval list
// Get the resource approval list
export function getApproveList(params) {
    return getRequest("/topoApproval/getByCondition", params)
}
//批准、驳回、暂停资源审批列表
// Approve, reject, and suspend the resource approval list
//Approve, reject, and suspend the resource approval list
export function operateApproveList(params) {
    return postRequest("/topoApproval/updateApproval", params)
}
//获取所有审核资源的类型
// Gets the types of all audit resources
//Gets the types of all audit resources
export function getTopoApprovalType(params) {
    return getRequest("/topoApproval/getTopoApprovalType", params)
}


// 拓扑/资源管理
// Topology/resource management
// Topology/resource management
// 拓扑ce申请
// Topology CE application
// Topology CE application
export function applyApprovalCe(params) {
    return postRequest("/topoApprovalCe/applyApprovalCe", params)
}
// 拓扑图骨干节点申请
// Topology backbone node application
// Topology backbone node application
export function applyMainDevice(params) {
    return postRequest("/approvalMainDevice/applyMainDevice", params)
}
// 获取骨干节点
// Acquire backbone node
// Acquire backbone node
export function getMainDevice(params) {
    return getRequest("/approvalMainDevice/getMainDevice", params, false)
}
// 获取租户下的租户路由域
// Gets the tenant routing domain under the tenant
// Gets the tenant routing domain under the tenant
export function getTenantVrf(params) {
    return getRequest("/approvalMainDevice/getTenantVrf", params, false)
}
// 续期或者更改带宽
// Renew or change bandwidth
// Renew or change bandwidth
export function renewalApproval(params) {
    return postRequest("/topoApproval/renewalApproval", params)
}
// 注销
// The cancellation
// logout
export function cancelApproval(params) {
    return postRequest("/topoApproval/cancelApproval", params)
}
// 获取申请资源的详情，例如获取测申请的详情，获取租户路由域申请的详情
// Get details of application resources, such as get details of test applications, get details of tenant routing domain applications
// Get details of application resources, such as get details of test applications, get details of tenant routing domain applications
export function getTopoApplyDetail(params) {
    return getRequest("/topoApproval/getTopoApplyDetails", params, false)
}
// 获取租户的当前资源
// Gets the tenant's current resources
// Gets the tenant's current resources
export function getConcurrentResource(params) {
    return getRequest("/topoApproval/getConcurrentResource", params, false)
}
// 拓扑图租户路由域申请保存
// Topology diagram tenant routing domain requests save
// Topology diagram tenant routing domain requests save
export function applyApprovalTenantVrf(params) {
    return postRequest("/topoApprovalTenantVrf/applyApprovalTenantVrf", params)
}
// 拓扑图资源VPN申请保存
// Topology diagram resource VPN application save
// Topology diagram resource VPN application save
export function saveOpenVpnDevice(params) {
    return request.post("/approvalDevice/addOpenVpnDevice", params)
}
// 获取住户路由域
// Gets the household routing domain
// Gets the household routing domain
export function getTenantVrfByTenantId(params) {
    return getRequest(`/approvalDevice/getTenantVrfByTenantId/${params}`)
}
// 获取可开通和未开通的vpn节点
// Gets the VPN nodes available and not available
// Gets the VPN nodes available and not available
export function getPEDeviceByTenantId(data1, data2) {
    return getRequest(`/approvalDevice/getPEDeviceByTenantId/${data1}/${data2}`)
}
// 通过审批流id获取vpn的详情
// Get details of the VPN through the approval flow ID
// Get details of the VPN through the approval flow ID
export function getTopoVpnDetail(params) {
    return getRequest(`/approvalDevice/getTopoVpnDetails/${params}`)
}


//  云账号管理
// Cloud account Management
//  Cloud account Management
//  新增云账号
// New cloud account
//  New cloud account
// export function addCloudAccount(params) {
//     return request.post("/cloudAccount/add", params);
// }
// // 获取云账号列表
// Get a list of cloud accounts
// // Get a list of cloud accounts
// export function getCloudAccountList(params) {
//     return postRequest("/cloudAccount/findByCondition", params)
// }
// // 删除云账号
// Delete your cloud account
// // Delete your cloud account
// export function delCloudAccount(params) {
//     return postRequest("/cloudAccount/delete", params)
// }
// //编辑云账号
// Edit the cloud account
// //Edit the cloud account
// export function editCloudAccount(params) {
//     return request.post("/cloudAccount/update", params)
// }
// //测试云账号是否存在
// Test if a cloud account exists
// //Test if a cloud account exists
// export function checkAccountName(params) {
//     return getRequest("/cloudAccount/checkAccountName", params, false)
// }
//获取云账号列表根据服务器类型
// Gets a list of cloud accounts by server type
//Gets a list of cloud accounts by server type
export function getAccountByType(params) {
    return getRequest("/cloudAccount/findByType", params, false)
}
//获取云设备序列号列表
// Gets a list of cloud device serial numbers
//Gets a list of cloud device serial Numbers
export function findAllCloudDeviceSerialNumbers(params) {
    return getRequest("/instance/findAllCloudDeviceSerialNumbers", params, false)
}
//新增云设备名称唯一性校验
// New cloud device name uniqueness check
//New cloud device name uniqueness check
export function cloudDevice(params) {
    return getRequest('/instance/deviceNameExist', params, false)
}
//云设备更新
// Cloud device Update
//Cloud device Update
export function cloudDevUpdate(params) {
    return getRequest('instance/updateVersion', params)
}
//获取地域列表
// Get a list of places
//Get a list of places
export function getRegionList(params) {
    return getRequest("/region/getDescribeRegions", params, false)
}
//获取VPC列表
// Gets the VPC list
//Gets the VPC list
export function getVpcList(params) {
    return getRequest("/vpc/getVpcList", params)
}
// 获取路由表列表
// Gets a list of routing tables
// Gets a list of routing tables
export function getRouteList(params) {
    return getRequest("/routeTable/getRouteTableList", params, false)
}
//新增路由表
// New routing table
//New routing table
export function addRoute(params) {
    return request.post("/routeTable/createRouteTable", params)
}
//删除路由表
// Delete routing table
//Delete routing table
export function delRoute(params) {
    return deleteRequest("/routeTable/deleteRouteTable", params)
}
//关联子网
// Associated subnets
//Associated subnets
export function associateSubnet(params) {
    return postRequest("/routeTable/associateRouteTableAndSubnets", params, false)
}
//获取子网列表(未绑定的)
// Get the subnet list (unbound)
//Get the subnet list (unbound)
export function getSubnetNoAss(params) {
    return getRequest("/subnet/getSubnetListRemoveAssociate", params)
}
//取消关联
// Cancel the associated
//Cancel the associated
export function unAssociateSubnet(params) {
    return postRequest("/routeTable/disassociateRouteTable", params)
}
//获取子网列表(已绑定的)
// Get the list of subnets (bound)
//Get the list of subnets (bound)
export function getSubnetAss(params) {
    return request.post("/subnet/getSubnetAssociateList", params)
}
//获取实例ID列表
// Gets the list of instance ids
//Gets the list of instance ids
export function getInstanceList(params) {
    return getRequest("/routeTable/getInstanceIdsByType", params)
}
//新增路由条目
// New route entry
//New route entry
export function addRouteEntry(params) {
    return request.post("/route/createRoute", params)
}
//根据ID获取路由表
// Gets the routing table based on ID
//Gets the routing table based on ID
export function getRouteById(params) {
    return getRequest("/routeTable/getRouteTableById", params);
}
//删除路由条目
// Delete route entry
//Delete route entry
export function delRouteEntry(params) {
    return deleteRequest("/route/deleteRoute", params)
}

//VPC管理
// VPC management
//VPC management
//获取Vpc列表
// Gets the Vpc list
//Gets the Vpc list
export function getVpcListByPage(params) {
    return getRequest("/vpc/getVpcListByPage", params, false)
}
//新增VPC
// New VPC
// add VPC
export function addVpc(params) {
    return request.post("/vpc/createVpc", params)
}
//查询指定区域的可用区列表
// Query the list of available areas for a specified area
//Query the list of available areas for a specified area
export function getZoneList(params) {
    return getRequest("/region/getZones", params)
}
//删除VPC
// Delete the VPC
//delete VPC
export function delVpc(params) {
    return deleteRequest("/vpc/deleteById", params)
}
//获取子网列表
// Gets the subnet list
//Gets the subnet list
export function getSubnetList(params) {
    return getRequest("/subnet/getSubnetListByPage", params)
}
//新增子网
// The new subnet
//The new subnet
export function addSubnet(params) {
    return request.post("/subnet/createSubnet", params)
}
//删除子网
// Delete the subnet
//Delete the subnet
export function delSubnet(params) {
    return deleteRequest("/subnet/deleteByIds", params)
}
//VPC网段校验
// VPC segment calibration
//VPC segment calibration
export function vpcCheck(params) {
    return getRequest("/cloudAccount/awsVpcCidrCheck", params)
}
//VPC子网校验
// VPC subnet validation
//VPC subnet validation
export function subnetCheck(params) {
    return getRequest("/cloudAccount/awsSubNetCidrCheck", params)
}
//路由网段校验
// Routing network segment validation
//Routing network segment validation
export function routeCheck(params) {
    return getRequest("/cloudAccount/awsRouteCidrCheck", params)
}

//设备管理
// Equipment management
//equipment management
//获取公共子网
// Get the public subnet
//Get the public subnet
export function getPublicSubnet(params) {
    return getRequest("/subnet/getPublicSubnetsByVpcId", params)
}
//获取密钥对
// Get key pair
//Get key pair
export function getKeys(params) {
    return postRequest("/keyPair/findKeyPair", params)
}
//创建密钥对
// Creating key pairs
//Creating key pairs
export function addKey(params) {
    return postRequest("/keyPair/create", params)
}
//创建设备
// Create a device
//Create a device
export function addDevice(params) {
    return postRequest("/instance/create", params)
}
//获取设备列表
// Get device list
//Get device list
export function getDevList(params) {
    return postRequest("/instance/findByCondition", params)
}
//删除设备
// Remove equipment
//Remove equipment
export function delDevice(params) {
    return getRequest("/instance/deleteById", params)
}

//拓扑
// The topology
//topology
//获取拓扑添加节点设备列表
// Gets the topology add node device list
//Gets the topology add node device list
export function getTopuList(params) {
    return getRequest('/topoSet/getByCondition', params)
}
//添加拓扑图节点
// Add topology nodes
//Add topology nodes
export function addTopuDevice(params) {
    return postRequest('/topoSet/addDevice', params)
}
//获取拓扑图信息
// Gets topology information
//Gets topology information
export function topoGetAllDevices(params) {
    return getRequest('/topoSet/getAllDevices', params)
}
//拓扑移动节点
// Topological mobile node
//Topological mobile node
export function topuMove(params) {
    return postRequest('/topoSet/moveDevice', params)
}
//获取链路设备的接口信息
// Gets the interface information for the link device
//Gets the interface information for the link device
export function findLogicalPortByDeviceId(params) {
    return getRequest('/topoSet/findLogicalPortByDeviceId', params, false)
}
//新增或编辑两台设备的链路
// Add or edit links for both devices
//Add or edit links for both devices
export function addLinked(params) {
    return request.post('/topoSet/addLinked', params)
}

//租户拓扑
// The tenant topology
// Tenant topology
//租户拓扑租户路由域获取
// Tenant topology tenant routing domain acquisition
//Tenant topology Tenant Topology tenant routing domain acquisition
export function topoSetGetTenantVrf(params) {
    return getRequest("/topoSet/getTenantVrf", params, false)

}

//后台大屏页面设置
// Background large screen page Settings
//Background large screen page Settings
//获取大屏页面配置信息
// Gets big-screen page configuration information
//Get large screen page configuration information
export function screenSettingGetSetInfo(params) {
    return request.post("/screenSet/getSetInfo", params)
}
//大屏基础设置
// Large screen base Settings
//Large screen base Settings
export function vsmScreenSettingDaseSet(params) {
    return request.post("/screenSet/baseSet", params)
}
//大屏图表设置
// Large screen chart Settings
//Large screen chart Settings
export function vsmSreenSettingGraphSet(params) {
    return request.post("/screenSet/graphSet", params)
}
//重点监控对象设置
// Focus on monitoring object Settings
//Focus on monitoring object Settings
export function vsmScreenSettingMajorMonitorSet(params) {
    return request.post("/screenSet/majorMonitorSet", params)
}
//获取当前租户下的所有设备与链路
// Gets all devices and links under the current tenant
// Gets all devices and links under the current tenant
export function screenSettingGetTenantDevAndLinks(params) {
    return postRequest("/screenSet/getTenantDevAndLinks", params)

}
//恢复默认值
// Restore default values
// Restore default values
export function vsmScreenSettingRestore(params) {
    return request.post("/screenSet/restore", params)

}
//跳转至大屏首页
// Jump to home screen
// Jump to home page of large screen
export function vsmScreenSetSkipToScreen(params) {
    return postRequest("/screenSet/skipToScreen", params)
}
//查询设备地址选项
// Query the device address options
// Query device address options
export function vsmScreenSetFindOperation(params) {
    return postRequest("/screenSet/findOperation", params)
}


//2.0 vsr100物理设备eage 新接口
// New interface of 2.0 VSR100 physical device Eage
//2.0 VSR100 physical device Eage new interface
//端口映射
// Port mapping
// Port mapping
//获取是否开启了端口映射
// Gets whether port mapping is enabled
// Gets whether port mapping is enabled
export function getEnableProtmap(params) {
    return getRequest("/protmap/getEnable", params)
}
//获取端口映射
// Get port mapping
// Gets the port map
export function getProtmap(params) {
    return getRequest("/protmap/get", params)
}
//新增端口映射
// Add port mapping
// New port mapping
export function protmapAdd(params) {
    return postRequest("/protmap/add", params)
}
//编辑端口映射
// Edit port mapping
// Edit port mapping
export function protmapEdit(params) {
    return putRequest("/protmap/edit", params)
}
//删除端口映射
// Delete port mapping
// Remove port mapping
export function protmapDel(params) {
    return postRequest("/protmap/del", params)
}
//开启端口映射
// Open port mapping
// Enable port mapping
export function protmapOpen(params) {
    return postRequest("/protmap/open", params)
}
//关闭端口映射
// Close port mapping
// Enable port mapping
export function protmapClose(params) {
    return postRequest("/protmap/close", params)
}
//端口映射生效
// Port mapping in effect
// Port mapping takes effect
export function protmapForce(params) {
    return putRequest("/protmap/force", params)
}
//端口映射失效
// Port mapping failure
// Port mapping failed
export function protmapFailure(params) {
    return putRequest("/protmap/failure", params)
}
//端口映射校验外网端口
// Port mapping verifies external network ports
// Port mapping to verify external network ports
export function protmapCheckExtPort(params) {
    return getRequest("/protmap/checkExtPort", params, false)
}
/* WIFI */
//获取wifi信息
// Get wifi information
// Get wifi information
export function wifiGetWifiInfo(params) {
    return getRequest("/wifi/getWifiInfo", params)
}
//添加新的WIFI
// Add new WIFI
// Add new WIFI
export function wifiSaveWifi(params) {
    return postRequest("/wifi/saveWifi", params)
}
/* URL过滤 */
/* URL filtering */
//获取URL过滤
// Get URL filtering
// Get URL filtering
export function urlfilterGet(params) {
    return getRequest("/urlfilter/get", params)
}
//设置url过滤,同时承担了关闭的责任
// Set url filtering and take the responsibility of closing
// Set url filtering and take the responsibility of closing
export function urlfilterClose(params) {
    return postRequest("/urlfilter/close", params)
}
//设置url过滤,同时承担了开启的责任
// Set url filtering while taking responsibility for turning it on
// Set URL filtering and take the responsibility to turn it on
export function urlfilterSetUrlFilter(params) {
    return postRequest("/urlfilter/setUrlFilter", params)
}
//校验url过滤
// Verify URL filtering
// Verify URL filtering
export function urlfilterCheck(params) {
    return getRequest("/urlfilter/check", params)
}
/* 防火墙 */
/* Firewall */
//获取防火墙规则
// Get firewall rules
// Get firewall rules
export function firewalldGet(params) {
    return getRequest("/firewalld/get", params)
}
//获取防火墙规则
// Get firewall rules
// Get firewall rules
export function GetFirewalldList(params) {
    return getRequest("/firewalld/getList", params)
}


//获取防火墙规则
// Get firewall rules
// Get firewall rules
export function GetFirewalldSel(params) {
    return getRequest("/firewalld/options", params)
}

//获取防火墙状态
// Get firewall status
// Get firewall status
export function firewalldGetState(params) {
    return getRequest("/firewalld/getState", params)
}
//添加防火墙规则
// Add firewall rules
// Add firewall rules
export function firewalldAdd(params) {
    return postRequest("/firewalld/add", params)
}

//添加防火墙规则
// Add firewall rules
// Add firewall rules
export function firewalldAddOrEdit(params) {
    return postRequest("/firewalld/addOrEdit", params)
}

//删除防火墙规则
// Delete firewall rules
// Delete firewall rules
export function firewalldDel(params) {
    return postRequest("/firewalld/del", params)
}

// 名称唯一校验
// check Is Only Name
export function firewalldIsOnlyName(params) {
    return getRequest("/firewalld/findIsOnlyName", params)
}
// 名称唯一校验
// check Is Only Name
export function firewalldIsOnlyPriority(params) {
    return getRequest("/firewalld/findIsOnlyPriority", params)
}

//  app 绑定校验
// check Is Only  ref APP
export function firewalldIsOnlyApp(params) {
    return getRequest("/firewalld/findIsOnlyApp", params)
}

//开启防火墙
// Open the firewall
// Turn on the firewall
export function firewalldOpen(params) {
    return postRequest("/firewalld/open", params)
}
//关闭防火墙
// Turn off the firewall
// Close the firewall
export function firewalldClose(params) {
    return postRequest("/firewalld/close", params)
}
//开启七层防火墙
// Open the Sevenfirewall
// Turn on the Sevenfirewall
export function sevenFirewalldOpen(params) {
    return postRequest("/sevenfirewalld/open", params)
}
//关闭七层防火墙
// Turn off the Sevenfirewall
// Close the Sevenfirewall
export function sevenFirewalldClose(params) {
    return postRequest("/sevenfirewalld/close", params)
}
/* 七层防火墙 */
/* SevenFirewall */
//获取七层防火墙规则
// Get Sevenfirewall rules
// Get Sevenfirewall rules
export function sevenfirewalldGet(params) {
    return getRequest("/sevenfirewalld/get", params)
}
//获取七层防火墙状态
// Get Sevenfirewall status
// Get Sevenfirewall status
export function sevenfirewalldGetState(params) {
    return getRequest("/sevenfirewalld/getState", params)
}
//添加七层防火墙规则
// Add SevenFirewall rules
// Add SevenFirewall rules
export function sevenFirewalldAdd(params) {
    return postRequest("/sevenfirewalld/add", params)
}
//删除七层防火墙规则
// Delete SevenFirewall rules
// Delete SevenFirewall rules
export function sevenFirewalldDel(params) {
    return postRequest("/sevenfirewalld/del", params)
}
//新增5G
// Add  5G
//Add  5G
export function addFifthG(params) {
    return postRequest("/fifthGeneration/add", params)
}
//批量删除5G
// Delete 5G in batch
//Delete 5G in batch
export function delFifthG(params) {
    return postRequest("/fifthGeneration/del", params)
}
//修改 5G
export function editFifthG(params) {
    return request.post("/fifthGeneration/edit", params)
}
//获取5G规则
// Get 5G rules
export function getFifthG(params) {
    return getRequest("/fifthGeneration/get", params)
}

//新增reipsec
// Add REIPSEC
//Add REIPSEC
export function addReIpsec(params) {
    return postRequest("/reipsec/add", params, { headers: { 'showLoading': false } })
}

//批量删除reipsec
// Delete reipsec in batch
export function delReIpsec(params) {
    return request.post("/reipsec/del", params)
}

/* 100端qos */
//获取qos列表
// Access to qos list
// Obtain qos list
export function vsmsimpleqosGetQosDetail(params) {
    return getRequest("/vsmsimpleqos/getQosDetail", params)
}
//获取qos是否开启
// Whether qos access is enabled
// Whether qos access is enabled
export function vsmsimpleqosGetQosEnable(params) {
    return getRequest("/vsmsimpleqos/getQosEnable", params)
}
//新增qos
// The new qos
//add qos
export function vsmsimpleqosAddQos(params) {
    return postRequest("/vsmsimpleqos/addQos", params)
}
//编辑qos
// Edit the qos
//edit qos
export function vsmsimpleqosEditQos(params) {
    return putRequest("/vsmsimpleqos/editQos", params)
}
//获取名字是否可用
// Gets whether the name is available
// Gets whether the name is available
export function vsmsimpleqosGetQosNameIsEnable(params) {
    return getRequest("/vsmsimpleqos/getQosNameIsEnable", params, false)
}
//开启qos
// Open the qos
// open the qos
export function vsmsimpleqosOpen(params) {
    return postRequest("/vsmsimpleqos/open", params)
}
//关闭qos
// Close the qos
// close the qos
export function vsmsimpleqosClose(params) {
    return postRequest("/vsmsimpleqos/close", params)
}
//删除qos
// Delete the qos
// delete the qos
export function vsmsimpleqosDelQos(params) {
    return postRequest("/vsmsimpleqos/delQos", params)
}
/*静态路由*/
/*static route*/
/*DNS*/
//获取DNS列表
// Getting DNS list
//Getting DNS list
export function dnsGetDns(params) {
    return getRequest("/dns/getDns", params)
}
//获取DNS状态
// Get DNS status
//Get DNS status
export function dnsGetState(params) {
    return getRequest("/dns/getState", params)
}
//新增DNS
// New DNS
//add DNS
export function dnsAdd(params) {
    return postRequest("/dns/add", params)
}
//开启DNS
// Open the DNS
//open DNS
export function dnsOpen(params) {
    return postRequest("/dns/open", params)
}
//关闭DNS
// Close the DNS
//close DNS
export function dnsClose(params) {
    return postRequest("/dns/close", params)
}
//删除DNS
// Remove the DNS
//delete DNS
export function dnsDel(params) {
    return postRequest("/dns/del", params)
}
/*修复工具*/
/*Repair tools*/
//发送修复命令
// Send repair command
//Send repair command
export function repairtoolsSendReairMessage(params) {
    return getRequest("/repairtools/sendReairMessage", params)
}
export function repairtoolsSendReairMessageNew(params) {
    return getRequest("/repairtools/sendReairMessageNew", params)
}
export function repairtoolsSendGREMessageNew(params) {
    return getRequest("/repairtools/sendGREMessageNew", params)
}
/*诊断工具*/
/*Repair tools*/
//ping的下发
// Ping issued
//Ping issued
export function networkdiagnosisPing(params) {
    return getRequest("/networkdiagnosis/ping", params)
}
//获取ping的状态
// Get the status of ping
//Get the status of ping
export function networkdiagnosisGetPing(params) {
    return getRequest("/networkdiagnosis/getPing", params, false)
}
//traceroute的下发
// Traceroute issued
//Traceroute issued
export function networkdiagnosisTraceroute(params) {
    return getRequest("/networkdiagnosis/traceroute", params)
}

/* WIFI */
//获取wifi速率
// Get wifi information
// Get wifi information
export function GetMqttWifiInfo(params) {
    return getRequest("/wifi/getMqttWifi", params)
}
/*1100诊断工具*/
/*Repair tools*/
//ping的下发
// Ping issued
//Ping issued
export function vsreNetPing(params) {
    return getRequest("/networkdiagnosis/vsrePing", params)
}
//获取1100 ping的状态
// Get the status of ping
//Get the status of ping
export function getVsrePing(params) {
    return getRequest("/networkdiagnosis/getVsrePing", params, false)
}
//保存PingTest 参数 信息
export function savePing(params) {
    return postRequest("/networkdiagnosis/savePing", params, false)
}
//保存PingTest 结果 信息
export function updatePing(params) {
    return postRequest("/networkdiagnosis/updatePing", params, false)
}
// 停止 PingTest
export function stopPing(params) {
    return postRequest("/networkdiagnosis/stopPing", params, false)
}


//获取 上次 Ping 参数 信息
export function getPing(params) {
    return postRequest("/networkdiagnosis/getPingParam", params, false)
}

//获取设备对应开启物理端口
// Get the status of ping
//Get the status of ping
export function getVsrePort(params) {
    return postRequest("/networkdiagnosis/getVsrePort", params)
}

//IPSEC 状态的获取
// IPSEC Status
export function networkdiagnosisGetIpsec(params) {
    return postRequest("/networkdiagnosis/getIpsec", params)
}

//LTE 状态的获取
// LTE Status
export function networkdiagnosisGetLte(params) {
    return postRequest("/networkdiagnosis/getLteStatus", params)
}

//获取Traceroute的状态
// Gets the status of Traceroute
//Gets the status of Traceroute
export function networkdiagnosisGetTraceroute(params) {
    return getRequest("/networkdiagnosis/getTraceroute", params, false)
}
//mtr的下发
// The MTR issued
//The MTR issued
export function networkdiagnosisMtr(params) {
    return getRequest("/networkdiagnosis/mtr", params)
}
//获取mtr的状态
// Get the status of the MTR
//Get the status of the MTR
export function networkdiagnosisFGetMtr(params) {
    return getRequest("/networkdiagnosis/getMtr", params, false)
}
//或取ipsec列表
// Or take the IPSec list
//Gets the IPSec list
export function ipSec(params) {
    return postRequest('/ipSec', params)
}
//新增编辑ipsec
// Added editor IPSEC
//Added editor IPSEC
export function addIpsec(params) {
    return request.post('/ipSec/addOrFlush', params)
}
//ipsec可否编辑或删除
// Ipsec can edit or delete
//Ipsec can edit or delete
export function ipSecAreBeenQuoted(params) {
    return request.post('/ipSec/areBeenQuoted', params)
}
//校验ipsec名称唯一性
// Verify ipSec name uniqueness
//Verify ipSec name uniqueness
export function ipSecCanNameUse(params) {
    return request.post('/ipSec/canNameUse', params, { headers: { 'showLoading': false } })
}
//获取ipsec下拉框选项
// Gets the IPSEC drop-down box option
//Gets the IPSEC drop-down box option
export function ipSecGetOperation(params) {
    return getRequest('/ipSec/getOperation', params, false)
}
//ipsec高级设置
// Ipsec Advanced Settings
//Ipsec Advanced Settings
export function ipSecExtra(params) {
    return request.post('/ipSec/extra', params)
}
//iperf的下发
// Iperf issued
//Iperf issued
export function networkdiagnosisIperf(params) {
    return getRequest("/networkdiagnosis/iperf", params)
}
//iperf的获取
// Iperf access
//Iperf access
export function networkdiagnosisGetIperf(params) {
    return getRequest("/networkdiagnosis/getIperf", params, false)
}
//Nslookup的下发
// Nslookup issued
//Nslookup issued
export function networkdiagnosisNslookup(params) {
    return getRequest("/networkdiagnosis/nslookup", params)
}
//Nslookup的获取
// Nslookup access
//Nslookup access
export function networkdiagnosisGetNslookup(params) {
    return getRequest("/networkdiagnosis/getNslookup", params, false)
}
//Httping的下发
// Httping issued
//Httping issued
export function networkdiagnosisHttping(params) {
    return getRequest("/networkdiagnosis/httping", params)
}
//Httping的获取
// Httping access
//Httping access
export function networkdiagnosisGetHttping(params) {
    return getRequest("/networkdiagnosis/getHttping", params, false)
}
//关闭socket
// Close the socket
//close socket
export function networkdiagnosisMessageOnClose(params) {
    return postRequest("/networkdiagnosis/messageOnClose", params)
}
//检查host
// Check the host
//check host
export function networkdiagnosisCheckHost(params) {
    return postRequest("/networkdiagnosis/checkHost", params)
}
/*BGP*/
//获取租户的租户路由域
// Gets the tenant routing domain for the tenant
//Gets the tenant routing domain for the tenant
export function bgpVrfGetTenants(params) {
    return getRequest("/bgp/vrf/getTenants", params, false)
}
//新增或编辑BGPvrf
// Add or edit BGPvrf
//Add or edit BGPvrf
export function bgpVrfAddOrEdit(params) {
    return postRequest("/bgp/vrf/addOrEdit", params)
}
//在设备下base和邻居网段发布有数据下不能更改
// Data published in base and neighbor segments under the device cannot be changed
//Data published in base and neighbor segments under the device cannot be changed
export function bgpVrfCheckAsNumber(params) {
    return getRequest("/bgp/vrf/checkAsNumber", params,false)
}
//获取到对端地址
// Gets the address of the opposite end
//Gets the address of the opposite end
export function bgpPolicyGetAddress(params) {
    return getRequest("/bgp/policy/getAddress",params)
}
//清空配置
// Empty the configuration
//Empty the configuration
// export function bgpVrfDeleteConfiguration(params) {
//     return postRequest("/bgp/vrf/deleteConfiguration",params)
// }
//删除BGPvrf
// Delete BGPvrf
//Delete BGPvrf
export function bgpVrfDel(params) {
    return postRequest("/bgp/vrf/del", params)
}
//获取基础信息
// Get basic information
//Get basic information
export function bgpBasisGet(params) {
    return getRequest("/bgp/basis/get", params, false)
}
//BGP基础设置
// BGP base Settings
//BGP base Settings
export function bgpBasisSet(params) {
    return request.post("/bgp/basis/set", params)
}
//获取设备所绑定的租户下的租户路由域
// Gets the tenant routing domain under the tenant to which the device is bound
//Gets the tenant routing domain under the tenant to which the device is bound
export function bgpVrfGetBgpVrf(params) {
    return getRequest("/bgp/vrf/getBgpVrf", params, false)
}
//同步
// synchronous
//synchronization
export function bgpVrfSync(params) {
    return getRequest("/bgp/vrf/sync", params)
}
//获取BGP邻居列表
// Gets a list of BGP neighbors
//Gets a list of BGP neighbors
export function bgpNeighborGet(params) {
    return getRequest("/bgp/neighbor/get", params)
}
//新增或编辑BGP邻居
// Add or edit BGP neighbors
//Add or edit BGP neighbors
export function bgpNeighborSave(params) {
    return request.post("/bgp/neighbor/save", params)
}
//删除BGP邻居
// Delete BGP neighbors
//Delete BGP neighbors
export function bgpNeighborDel(params) {
    return postRequest("/bgp/neighbor/del", params)
}
//获取网段发布列表
// Gets the network segment publication list
//Gets the network segment publication list
export function bgpCidrGet(params) {
    return getRequest("/bgp/cidr/get", params)
}
//新增或编辑网段发布
// Add or edit web segment to publish
//Add or edit web segment to publish
export function bgpCidrSave(params) {
    return request.post("/bgp/cidr/save", params)
}
//删除网段发布
// Delete network segment publishing
//Delete network segment publishing
export function bgpCidrDel(params) {
    return postRequest("/bgp/cidr/del", params)
}
//校验cidr
// Check the cidr
//Check the cidr
export function bgpCidrCheckUrl(params) {
    return getRequest("/bgp/cidr/checkUrl", params, false)
}
//获取本租户路由域的BGP策略
// Gets the BGP policy for the tenant routing domain
//Gets the BGP policy for the tenant routing domain
export function bgpPolicyGetBgpPolicyByVrfId(params) {
    return getRequest("/bgp/policy/getBgpPolicyByVrfId", params)
}
//获取CommunitySetting下拉列表
// Get the CommunitySetting drop-down list
//Get the CommunitySetting drop-down list
export function bgpCommunityGetCommunitySetting(params) {
    return getRequest("/bgp/community/getCommunitySetting", params)
}
//分页获取BgpCommunity
// Paging gets the BgpCommunity
//Get the CommunitySetting drop-down list分页获取BgpCommunity
// Get the CommunitySetting drop-down list page to Get BgpCommunity
export function bgpCommunityGet(params) {
    return getRequest("/bgp/community/get", params)
}
//新增或编辑BgpCommunity
// Add or edit BgpCommunity
//Add or edit BgpCommunity
export function bgpCommunitySave(params) {
    return request.post("/bgp/community/save", params)
}
//单独删除delBgpCommunitySession
// DelBgpCommunitySession removed separately
//DelBgpCommunitySession removed separately
export function bgpCommunityDelBgpCommunitySession(params) {
    return postRequest("/bgp/community/delBgpCommunitySession", params)
}
//批量删除BgpCommunityList
// Batch delete BgpCommunityList
//Batch delete BgpCommunityList
export function bgpCommunityDelBgpCommunity(params) {
    return request.post("/bgp/community/delBgpCommunity", params)
}
//分页获取BGPlpList
// Paging to get BGPlpList
//Paging to get BGPlpList
export function bgpIpListGetByCondition(params) {
    return getRequest("/bgp/ipList/getByCondition", params)
}
//新增或编辑lpList
// Add or edit lpList
//Add or edit iplist
export function bgpIpListSave(params) {
    return request.post("/bgp/ipList/save", params)
}
//批量删除BGPlpList
// Batch delete BGPlpList
//Batch delete BGPlpList
export function bgpIpListDelBgpIpList(params) {
    return request.post("/bgp/ipList/delBgpIpList", params)
}
//单独删除BGPlPListSession
// Delete BGPlPListSession separately
//Delete BGPlPListSession separately
export function bgpIpListDelBgpIpListSession(params) {
    return postRequest("/bgp/ipList/delBgpIpListSession", params)
}
// //在删除完默认租户路由域前不能删除default
// Default cannot be deleted until the default tenant routing domain is removed
// //Default cannot be deleted until the default tenant routing domain is removed
// export function bgpVrfCheckDelete(params) {
//     return getRequest("/bgp/vrf/checkDelete",params)
// }
//分页获取BgpPolicy
// Paging to get the BgpPolicy
//Paging to get the BgpPolicy
export function bgpPolicyGet(params) {
    return getRequest("/bgp/policy/get", params)
}
//删除routeMap时的校验
// Validation when REMOVING routeMap
//Validation when REMOVING routeMap
export function bgpPolicyDeleteCheck(params) {
    return getRequest("/bgp/policy/deleteCheck", params)
}
//删除lpList的校验
// Delete lpList validation
//Delete plIST validation
export function bgpIpListDeleteCheck(params) {
    return getRequest("/bgp/ipList/DeleteCheck", params)
}
//删除Community的校验
// Delete the validation for Community
//Delete the validation for Community
export function bgpCommunityDeleteCheck(params) {
    return getRequest("/bgp/community/deleteCheck", params)
}
//新增或编辑BGPPolicy
// Add or edit BGPPolicy
//Add or edit BGPPolicy
export function bgpPolicySave(params) {
    return request.post("/bgp/policy/save", params)
}
//获取本租户路由域的ipList
// Gets the ipList for the tenant routing domain
//Gets the ipList for the tenant routing domain
export function bgpIpListGetBgpIpListByVrfId(params) {
    return getRequest("/bgp/ipList/getBgpIpListByVrfId", params)
}
//获取本租户路由域的BGPCommunity
// Gets the BGPCommunity for the tenant routing domain
//Gets the BGPCommunity for the tenant routing domain
export function bgpCommunityGetBgpCommunityByVrfId(params) {
    return getRequest("/bgp/community/getBgpCommunityByVrfId", params)
}
//批量删除BgpPolicyList
// Batch delete BgpPolicyList
//Batch delete BgpPolicyList
export function bgpPolicyDelBgpPolicyList(params) {
    return request.post("/bgp/policy/delBgpPolicyList", params)
}
//单独删除BGPPolicySession
// Remove BGPPolicySession separately
//Remove BGPPolicySession separately
export function bgpPolicyDelBgpPolicySession(params) {
    return postRequest("/bgp/policy/delBgpPolicySession", params)
}
//routeMap 校验name
// RouteMap check the name
//routeMap Check the name
export function bgpPolicyNameExist(params) {
    return getRequest("/bgp/policy/nameExist", params, false)
}
// lpl 校验名字
// LPL check name
// lpl Check the name
export function bgpIpListNameExist(params) {
    return getRequest("/bgp/ipList/nameExist", params, false)
}
// community校验名字
// Community check name
// Community check name
export function bgpCommunityNameExist(params) {
    return getRequest("/bgp/community/nameExist", params, false)
}
/*DHCP*/
//新增或者修改dhcp
// Add or modify DHCP
//Add or modify DHCP
export function dhcpAddOrEditService(params) {
    return request.post("/dhcp/addOrEditService", params)
}
//删除dhcp
// Delete the DHCP
//delete dhcp
export function dhcpDel(params) {
    return postRequest("/dhcp/del", params)
}

//IP 检验
export function dhcpCheckIp(params) {
    return getRequest("/dhcp/checkIp", params)
}


//通过设备id获取DHCP服务
// Get the DHCP service through the device ID
//Get the DHCP service through the device ID
export function dhcpGetServiceByDeviceId(params) {
    return getRequest("/dhcp/getServiceByDeviceId", params)
}

/*DHCP*/
/*DHCP*/
//get DHCP
export function staticdhcpGet(params) {
    return getRequest("/staticdhcp/get", params)
}
//新增DHCP
// The new DHCP
//add DHCP
export function staticdhcpAdd(params) {
    return postRequest("/staticdhcp/add", params)
}
//修改DHCP
// Modify the DHCP
//edit DHCP
export function staticdhcpEdit(params) {
    return putRequest("/staticdhcp/edit", params)
}
//删除DHCP
// Delete the DHCP
//delete DHCP
export function staticdhcpDel(params) {
    return postRequest("/staticdhcp/del", params)
}
//DHCP失效
// DHCP failure
//DHCP failure
export function staticdhcpFailure(params) {
    return putRequest("/staticdhcp/failure", params)
}
//DHCP生效
// Effective DHCP
//Effective DHCP
export function staticdhcpForce(params) {
    return putRequest("/staticdhcp/force", params)
}
//MAC校验
// MAC calibration
//mac verification
export function staticdhcpCheck(params) {
    return getRequest("/staticdhcp/check", params, false)
}
/*上网审计*/
/*The Internet audit*/
//获取到审计日志
// Gets the audit log
//Gets the audit log
export function browserecordGetBrowserRecord(params) {
    return getRequest("/browserecord/getBrowserRecord", params)
}
//获取下载文件
// Get download file
//Get download file
export function browserecordGetFile(params) {
    return getRequest("/browserecord/getFile", params)
}
//获取存储上限
// Get storage ceiling
//Get storage ceiling
export function browserecordGetLimit(params) {
    return getRequest("/browserecord/getLimit", params)
}
//设置存储上限
// Set storage ceiling
//Set storage ceiling
export function browserecordSetLimit(params) {
    return putRequest("/browserecord/setLimit", params)
}
//获取上网审计状态
// Get online audit status
//Get online audit status
export function browserecordGetState(params) {
    return getRequest("/browserecord/getState", params)
}
//开启或关闭上网审计
// Turn online auditing on or off
//Turn online auditing on or off
export function browserecordOpenBrowserRecord(params) {
    return postRequest("/browserecord/openBrowserRecord", params)
}
/*SNAT*/
//获取设备上的SNAT
// Get the SNAT on the device
//Get the SNAT on the device
export function snatGet(params) {
    return getRequest("/snat/get", params)
}
//获取设备上的SNAT的外网接口
// Gets the external network interface of the SNAT on the device
//Gets the external network interface of the SNAT on the device
export function snatGetInterface(params) {
    return getRequest("/snat/getInterface", params)
}


//保存SNAT
// Save the SNAT
//save SNAT
export function snatSave(params) {
    return postRequest("/snat/save", params)
}
//删除snat
// Delete snat
//delete snat
export function snatDel(params) {
    return postRequest("/snat/del", params)
}

//获取设备上的SNAT
// Get the SNAT on the device
export function getSnatList(params) {
    return getRequest("/snat/getByCondition", params)
}

//获取是否可以删除
// Gets whether you can delete
//Gets whether you can delete
export function snatCheckDelete(params) {
    return getRequest("/snat/checkDelete", params)
}

//获取设备上的SNAT 对应接口是否 订阅服务
// Get the SNAT on the device
export function getSnatPort(params) {
    return getRequest("/snat/getSnatPort", params)
}

/*DNAT*/
//获取到外网IP,并写死
// Get to the external network IP, and write dead
//Get to the external network IP, and write dead
export function dnatGetOutIp(params) {
    return getRequest("/dnat/getOutIp", params)
}
//获取DNAT
// Get DNAT
//get DNAT
export function dnatGet(params) {
    return getRequest("/dnat/get", params)
}
//新增或编辑DNAT
// Add or edit DNAT
//add or edit DNAT
export function dnatSave(params) {
    return postRequest("/dnat/save", params)
}
//删除DNAT
// Delete DNAT
//delete DNAT
export function dnatDel(params) {
    return postRequest("/dnat/del", params)
}
//检查DNAT名字是否重复
// Check for duplicate DNAT names
//Check for duplicate DNAT names
export function dnatCheckName(params) {
    return getRequest("/dnat/checkName", params, false)
}
/*速度限制*/
/*rate limitation*/
//获取
// To obtain
//get
export function speedlimitGet(params) {
    return getRequest("/speedlimit/get", params)
}
//新增或编辑
// Add or edit
//add or edit
export function speedlimitSave(params) {
    return postRequest("/speedlimit/save", params)
}
//开启或关闭
// On or off
//open or close
export function speedlimitChangeState(params) {
    return postRequest("/speedlimit/changeState", params)
}
//删除
// delete
//delete
export function speedlimitDel(params) {
    return postRequest("/speedlimit/del", params)
}
//检查ip是否冲突和是否和Qos产生冲突了
// Check if IP conflicts and if it conflicts with Qos
//Check if IP conflicts and if it conflicts with Qos
export function speedlimitCheck(params) {
    return postRequest("/speedlimit/check", params, false)
}

/*网络*/
/*network*/
//组网
// networking
//networking
//根据场景类型查询分页信息
// Query for paging information by scenario type
//// Query paging information by scenario type
export function sceneGetByCondition(params) {
    return getRequest("/scene/getByCondition", params)
}
//获取场景中租户路由域列表
// Gets the list of tenant routing domains in the scenario
//Gets the list of tenant routing domains in the scenario
export function sceneNodeGetTenantVrfList(params) {
    return getRequest("/scene/node/getTenantVrfList", params)
}
//获取场景中的网络列表
// Gets the list of networks in the scenario
//Gets the list of networks in the scenario
export function sceneNodeGetNetList(params) {
    return getRequest("/scene/node/getNetList", params)
}
//根据场景类型获取100设备
// Gets 100 devices based on the scenario type
//Gets 100 devices based on the scenario type
export function sceneGetEdgeByCondition(params) {
    return getRequest("/scene/getEdgeByCondition", params, false)
}
//获取edge节点的100设备列表
// Gets the list of 100 devices for the EDGE node
//Gets the list of 100 devices for the EDGE node
export function scenenodeGetEdgeList(params) {
    return getRequest("/scene/node/getEdgeList", params)
}
//新增指定edge设备关联静态路由
// Added the specified EDGE device associated static route
//Added the specified EDGE device associated static route
export function sceneNodeAddStatic(params) {
    return request.post("/scene/node/addStatic", params)
}
//编辑指定edge设备关联静态路由
// Edit to specify the EDGE device associated static routing
//Edit to specify the EDGE device associated static routing
export function sceneNodeEditStatic(params) {
    return request.post("/scene/node/editStatic", params)
}
//删除指定edge设备关联静态路由
// Removes the specified EDGE device-associated static route
//Removes the specified EDGE device-associated static route
export function sceneNodeDeleteEdgeStatic(params) {
    return request.post("/scene/node/deleteEdgeStatic",params)
}
//创建场景节点设备
// Create the scene node device
//Create the scene node device
export function sceneNodeAddEdge(params) {
    return request.post("/scene/node/addEdge", params)
}
//新增组网
// The new network
//The new network
export function sceneAdd(params) {
    return request.post("/scene/add", params)
}
//获取组网中1000设备
// Get 1000 devices in the network
//Get 1000 devices in the network
export function sceneNodeGetTransitDevList(params) {
    return getRequest("/scene/node/getTransitDevList", params)
}
// //获取设备对应的逻辑端口
// Gets the logical port for the device
// //Gets the logical port for the device
export function sceneNodeGetLogicalPortList(params) {
    return getRequest("/scene/node/getLogicalPortList", params)
}
//编辑指定网关设备的网关加速配置
// Edit the gateway acceleration configuration for the specified gateway device
//Edit the gateway acceleration configuration for the specified gateway device
export function sceneNodeAccelerationSet(params) {
    return postRequest("/scene/node/acceleration", params)
}
//获取指定edge设备关联网关加速配置
// Gets the acceleration configuration for the specified EDGE device association gateway
//Gets the acceleration configuration for the specified EDGE device association gateway
// export function sceneNodeAccelerationGet(params) {
//     return getRequest("/scene/node/acceleration",params)
// }
//获取场景租户列表
// Gets the scenario tenant list
//Gets the scenario tenant list
export function sceneNodeGetTenantList(params) {
    return getRequest("/scene/node/getTenantList", params)
}
//获取场景节点的cidr
// Get the CIDR for the scene node
//Get the CIDR for the scene node
export function sceneNodeGetCidr(params) {
    return getRequest("/scene/node/getCidr", params)
}
//编辑场景节点的cidr
// Edit cidR for scene nodes
//Edit cidR for scene nodes
export function sceneNodeCidr(params) {
    return putRequest("/scene/node/cidr", params)
}
//删除场景
// Delete the scene
//Delete scene
export function sceneDelete(params) {
    return deleteRequest("/scene", params)
}
//获取场景中设备的专网连接
// Gets the private network connection for the device in the scenario
//Gets the private network connection for the device in the scenario
export function sceneNodeGetVpnDetails(params) {
    return getRequest("/scene/node/getVpnDetails", params)
}
//新增专网连接
// New private network connection
//New private network connection
export function sceneNodeVpnAdd(params) {
    return request.post("/scene/node/vpn/add", params)
}
//获取指定场景网关加速配置
// Gets the accelerated configuration for the specified scenario gateway
//Gets the accelerated configuration for the specified scenario gateway
export function sceneAccelerationGet(params) {
    return getRequest("/scene/acceleration", params)
}
//编辑指定场景网关加速配置
// Edit the specified scenario gateway acceleration configuration
//Edit the specified scenario gateway acceleration configuration
export function sceneAccelerationSet(params) {
    return postRequest("/scene/acceleration", params)
}
//编辑指定edge设备网关加速配置
// Edit to specify the EDGE device gateway acceleration configuration
//Edit to specify the EDGE device gateway acceleration configuration
export function sceneNodeAcceleration(params) {
    return putRequest("/scene/node/acceleration", params)
}
//从场景中退出指定场景节点设备
// Exits the specified scenario node device from the scenario
//Exits the specified scenario node device from the scenario
export function sceneNode(params) {
    return deleteRequest("/scene/node", params)
}
//提交发送消息
// Submit send message
//Submit send message
export function scenePush(params) {
    return getRequest('/scene/push', params)
}
//获取vpn地址池信息
// Gets VPN address pool information
//Gets VPN address pool information
export function sceneGetAddrPool(params) {
    return getRequest("/scene/getAddrPool", params)
}
//添加VPN地址池信息
// Add VPN address pool information
//Add VPN address pool information
export function sceneAddAddrPool(params) {
    return request.post("/scene/addAddrPool", params)
}
//检查组网或对等连接或网关互联的名字是否重复
// Check to see if the names of networking or peer-to-peer or gateway interconnections are duplicated
//Check to see if the names of networking or peer-to-peer or gateway interconnections are duplicated
export function sceneRepeatName(params) {
    return getRequest("/scene/repeatName", params, false)
}
//调试检查组网专网连接的互联地址是否重复
// Debug to check whether the interconnect address of the network private network connection is duplicate
//Debug to check whether the interconnect address of the network private network connection is duplicate
export function sceneRepeatIp(params) {
    return getRequest("/scene/repeatIp",params,false)
}


//设置
// Set up the
//set
//云账号管理
// Cloud account Management
//Cloud account Management
//获取云账号表格列表
// Get a list of cloud account tables
//Get a list of cloud account tables
export function cloudAccountGetByCondition(params) {
    return getRequest("/cloud/account/getByCondition", params)
}
//新增云账号
// New cloud account
//New cloud account
export function cloudAccountAdd(params) {
    return request.post("/cloud/account", params)
}
//检验云账号名称是否可用
// Verify that the cloud account name is available
//Is the inspector account name available
export function cloudAccountValidationAccountName(params) {
    return getRequest("/cloud/account/validation/accountName",params,false)
}
//编辑云账号
// Edit the cloud account
//Edit the cloud account
export function cloudAccountEdit(params) {
    return request.put("/cloud/account",params)
}
//删除云账号
// Delete your cloud account
//delete the cloud account
export function cloudAccountDel(params) {
    return request.delete("/cloud/account",{params:params})
}
//检验该设备是否有关联的组网
// Verify that the device has an associated network
//Verify that the device has an associated network
export function sceneCheckTran(params) {
    return getRequest("/scene/checkTran",params)
}
//获取组网列表的云设备列表
// Gets the list of cloud devices for the networking list
//Gets the list of cloud devices for the networking list
export function sceneGetCloudInfo(params) {
    return getRequest("/scene/getCloudInfo",params)
}
//检测设备是否包含指定接口，用于界面显示
// Checks whether the device contains the specified interface for interface display
//Checks whether the device contains the specified interface for interface display
export function deviceCheckInterface(params) {
    return postRequest("/device/check/interface",params)
}


// 新增应用组
// New application Group
//New application Group
export function addAppGroup(params) {
    return postRequest("/appGroup/saveOrFlush", params)
}

// 更新应用组
// Update application Group
//Update application Group
export function editAppGroup(params) {
    return postRequest("/appGroup/saveOrFlush", params)
}

// 删除应用组
// Delete application Group
//Delete application Group
export function delAppGroup(params) {
    return getRequest("/appGroup/del", params)
}

// 应用名称是否重复
// The application Group repeats the name check
//The application Group repeats the name check
export function checkAppGroupName(params) {
    return postRequest("/appGroup/canNameUse", params)
}

// 应用组查询
// Paging displays application Group information
//Paging displays application Group information
export function AppGroupGetByCondition(params) {
    return getRequest("/appGroup/getByCondition", params)
}


//获取应用下拉选项
// Gets the new application drop-down option
//Gets the new application drop-down option
export function APPGetSelect(params) {
    return getRequest('/apps/options', params)
}


/*NaaS设备总览*/
/*NaaS Equipment overview*/
//获取NaaS设备基础信息 BGP
// Get basic information about the NaaS device
//Get basic information about the NaaS device
export function naasDeviceBaseInfo(params) {
    return getRequest("/monitor/device/naasDeviceBaseInfo", params, false)
}


//获取NaaS设备下拉菜单
// Gets the device  drop-down menu
//Get device  drop-down menu
export function getNaaSDevSelect(params) {
    return getRequest('/device/getNaaSDevSelect', params, false)
}


/*NaaS BGPStats 列表*/
/*The BGPStats port*/
//获取BGPStats列表
export function getNaaSBGPInfo(params) {
    return getRequest("/monitor/device/naasBGPInfo", params)
}
//获取BGP Neighours列表
export function getNaaSBGPNeighbours(params) {
    return getRequest('/monitor/device/getNaaSBGPNeighours', params)
}

/*NaaS设备 ospf 总览*/
/*NaaS Equipment overview*/
//获取NaaS设备基础信息 BGP
// Get basic information about the NaaS device
//Get basic information about the NaaS device
export function ospfDeviceBaseInfo(params) {
    return getRequest("/monitor/device/ospfDeviceBaseInfo", params, false)
}

/*NaaS OSPFStats 列表*/
/*The OSPFStats port*/
//获取OSPFStats列表
export function getNaaSOspfInfo(params) {
    return getRequest("/monitor/device/naasOspfInfo", params)
}

//获取OSPF Neighours列表
export function getNaaSOspfNeighbours(params) {
    return getRequest('/monitor/device/getNaaSOspfNeighbours', params)
}



/*NaaS设备总览*/
/*NaaS Equipment overview*/
//获取NaaS设备基础信息 BGP
// Get basic information about the NaaS device
//Get basic information about the NaaS device
export function bfdDeviceBaseInfo(params) {
    return getRequest("/monitor/device/bfdDeviceBaseInfo", params, false)
}

/*NaaS BFDStats 列表*/
/*The BFDStats port*/
//获取BFDStats列表
export function getNaaSBfdInfo(params) {
    return getRequest("/monitor/device/naasBfdInfo", params)
}

/*NaaS BGP GET ROUTES*/
//发送 get 消息 Bgp Routes
export function bgpNaaSRoutesPing(params) {
    return getRequest("/networkdiagnosis/naasSendGetRoutes", params)
}

//获取BGP NaaS ROUTES
export function getBgpRoutesPing(params) {
    return getRequest("/networkdiagnosis/naasGetRoutes", params, false)
}

/*NaaS ospf GET ROUTES*/
//发送 get 消息 Bgp Routes
export function ospfNaaSRoutesPing(params) {
    return getRequest("/networkdiagnosis/naasSendGetOspfRoutes", params)
}

//获取OSPF NaaS ROUTES
export function getOspfRoutesPing(params) {
    return getRequest("/networkdiagnosis/naasGetOspfRoutes", params, false)
}

//通过id获取设备Location
export function getDevLocation(params) {
    return getRequest("/device/getDeviceLocation", params)
}

//获取配置的vsm版本
export function getVsmVersion(params) {
    return getRequest('/devConfig/getVsmVersion', params)
}

// 移动用户组
export function clientGroupList(params) {
    return getRequest("/clientGroup/getByCondition", params)
}

// 添加 移动用户组
export function addClientGroup(params) {
    return postRequest('/clientGroup/saveOrFlush', params)
}

// 校验 组是否存在
export function isNameUse(params) {
    return postRequest('/clientGroup/canNameUse', params)
}
// 校验 组是否存在
export function delClientGroup(params) {
    return getRequest('/clientGroup/del', params)
}
// 获取 移动用户组列表
export function getSelectGroupList(params) {
    return getRequest('/clientGroup/getGroupList', params)
}

// 获取 移动用户连接地址
export function getClientConnectionList(params) {
    return getRequest('/clientConnection/getByCondition', params)
}

// 获取 移动用户策略协议
export function getTrustPolicyList(params) {
    return getRequest('/trustPolicy/getByCondition', params)
}

// 校验 组是否存在
export function connIsNameUse(params) {
    return postRequest('/clientConnection/canNameUse', params)
}

// 更新 连接 配置
export function uptConnection(params) {
    return postRequest('/clientConnection/saveOrFlush', params)
}

// 更新 连接 配置
export function addTrustPolocy(params) {
    return postRequest('/trustPolicy/saveOrFlush', params)
}

// 修改组IP时校验 connection 中 IP是否在同一网段
export function checkSubnetAddress(params) {
    return postRequest('/clientGroup/checkSubnetAdd', params)
}

// 删除Client Group 校验 是否存在 Client
export function checkDel(params) {
    return postRequest('/clientGroup/checkDel', params)
}

// 校验 subnet address 是否妇存在
export function isubnetIsAlready(params) {
    return postRequest('/clientGroup/isAlready', params)
}

// 获取组内可用IP地址
export function getclientGroupIPList(params) {
    return getRequest('/clientGroup/getIPList', params)
}

//  获取 trust Policy 配置选项
export function trustSelectOptions(params) {
    return getRequest('/trustPolicy/selectOptions', params)
}
//  删除 trust Policy 配置
export function trustPolicyDel(params) {
    return getRequest('/trustPolicy/del', params)
}

//  名称是否被占用
export function trustPolicyCanNameUse(params) {
    return postRequest('/trustPolicy/canNameUse', params)
}
//  名称是否被占用
export function trustPolicyCanPriorityUse(params) {
    return postRequest('/trustPolicy/canPriorityUse', params)
}

//Site vpn innerIP 校验
export function checkSiteinnerIp(params) {
    return getRequest('/vpnSite/ipv4Exist', params)
}
