import {
  gets,
  get,
  post,
  put,
  deletefn
} from './http'

import {
  getGitIoURL,
} from './tool'

export const authLogin = res => post('/api/v1/auth/', res)
export const getEnum = res => get('/api/v1/init/enum', res)
//   ##
export const getUser = res => get('/api/v1/user/user/', res)
// 修改密码
export const putUser = res => put('/api/v1/user/user/', res)
export const getAdmin = res => get('/api/v1/admin/user/', res)
export const getUserUser = res => get('/api/v1/user/user/', res)
export const addUserInter = res => post('/api/v1/admin/user/', res)
// 管理员 查看积分记录
export const getPointsRecord = res => get('/api/v1/admin/pointsRecord/', res)
export const deletefnPointsRecord = res => deletefn('/api/v1/admin/pointsRecord/', res)
// 用户管理
export const putUserInter = res => put('/api/v1/admin/user/', res)
//  未改动
export const putUserBinding = res => put('/api/v1/user/proxy', res)
//   ##
export const delUserInter = res => deletefn('/api/v1/admin/user/', res)
//  无api 未改动
export const getGroup = res => get('/api/v1/group/', res)
//  无api 未改动
export const postGroup = res => post('/api/v1/group/', res)
//  无api 未改动
export const putGroup = res => put('/api/v1/group/', res)
//  无api 未改动
export const delGroup = res => deletefn('/api/v1/group/', res)
export const getDevice = res => get('/api/v1/user/port/', res)
//  无api 未改动
export const postDevice = res => post('/api/v1/port/', res)
//   ##
export const putDevice = res => put('/api/v1/user/port/remark', res) 
//  无api 未改动
export const putRenewDevice = res => put('/api/v1/port/renew', res)
//  无api 未改动
export const delDevice = res => deletefn('/api/v1/port/', res)
//   ##
export const getAcount = res => get('/api/v1/user/account/', res)
//   ##
export const getAcountAll = res => get('/api/v1/user/account/', res)
//   ##
export const delAcount = res => deletefn('/api/v1/user/account/', res)
//  无api
export const putAcount = res => put('/api/v1/account/', res)
//  账号管理  备注  无api
export const putAcountRemarks = res => put('/api/v1/account/remarks', res)
//  账号管理  分配到用户 无api
export const putAcountAssign = res => put('/api/v1/account/assign', res)
//  账号管理  绑定到端口 分配账号到设备  ##
export const putAcountBindPortUser  = res => put('/api/v1/user/account/bind', res)
//  任务管理  关注 不使用  有api 用户链接
export const postAnalyzeUserLink = res => post('/api/v1/tiktokParse/user',res)  // 原
export const postAnalyzeUserLinkUser = res => post('/api/v1/user/tiktokParse/user',res)  // 修改
//  任务管理  关注 不使用  有api 视频链接
export const postAnalyzeVideoLink = res => post('/api/v1/tiktokParse/video',res) // 原
export const postAnalyzeVideoLinkUser = res => post('/api/v1/user/tiktokParse/video',res)   // 修改
// 未使用 无api
export const exportAccountInfo = res => gets('/api/v1/account/download', res)
//   ##
export const getTask = res => get('/api/v1/user/task/', res)
//   ##
export const postTask = res => post('/api/v1/user/task/', res)
// 未使用 不明
export const getTaskRecord = res => get('/api/v1/taskRecord/', res)
//   ##
export const delTask = res => deletefn('/api/v1/user/task/', res)
// 未使用 不明 无api
export const stopTask = res => put('/api/v1/task/stop', res)

// tiktok用户    ##
export const getTiktokUser = res => get('/api/v1/user/tiktokUser/', res)
// tag插件  tiktok拉取信息 无api
export const getTiktokUserTag = res => get('/api/v1/tag/', res)
//  账号管理   重置次数 不使用  无api
export const putSend = res => put('/api/v1/account/send/' + res)
// 包管理 废弃页面
export const getPack = res => get('/api/v1/bundle/', res)
// 废除  无api
export const postTag = res => post('/api/v1/tag/', res)
// 废除  无api
export const putTag = res => put('/api/v1/tag/', res)
// 废除  无api
export const delTag = res => deletefn('/api/v1/tag/', res)
//  账号信息   查询所有 无api
export const getAccountInfo = res => get('/api/v1/accountInfo/', res)
//  账号信息   新增 无api
export const postAccountInfo = res => post('/api/v1/accountInfo/', res)
// 未使用 不明 无api
export const postAccountInfoUpload = res => get('/api/v1/accountInfo/upload', res)
//  用户管理   配置广告 
export const getAdConfig = res => get('/api/v1/adConfig/', res)
// 未使用 不明
export const getAdConfigAvailable = res => get('/api/v1/adConfig/available/', res)
//  账号包管理   配置广告
export const postAdConfig = res => post('/api/v1/adConfig/', res)
//  广告管理 返利记录   无api
export const getReward = res => get('/api/v1/reward/', res)
//  广告管理 返利记录   无api
export const putRewardConfirm = res => put('/api/v1/reward/confirm', res)
//  广告管理 返利记录   无api
export const putRewardComplete = res => put('/api/v1/reward/complete', res)
// 广告管理 分成配置  查询所有  无api
export const getDistribution = res => get('/api/v1/distribution/', res)
// 未使用 不明
export const getDistributionNow = res => get('/api/v1/distribution/now/', res)
// 广告管理 分成配置  新增 无api
export const postDistribution = res => post('/api/v1/distribution/', res)
// 广告管理 申请广告 查询所有  无api
export const getOfferFeed = res => get('/api/v1/module/clickDealer/OfferFeed/', res)
// 广告管理 创建链接 查询所有   无api
export const GetCampaignsLinks = res => get('/api/v1/module/clickDealer/GetCampaignsLinks/', res)
// 广告管理 创建链接 详情  无api 
export const GetCampaign = res => get('/api/v1/module/clickDealer/GetCampaign/', res)
//  广告管理 申请记录   无api
export const ApplyForOffer = res => get('/api/v1/module/clickDealer/ApplyForOffer/', res)
//  广告管理 广告记录   无api
export const getAdRecord = res => get('/api/v1/adRecord/', res)
//  广告管理 广告记录   无api
export const putAdRecordConfirm = res => put('/api/v1/adRecord/confirm', res)
//  广告管理 广告记录   无api
export const putAdRecordComplete = res => put('/api/v1/adRecord/complete', res)
// 资源管理 查询所有  ##      插件  resource  获取资源   ##
export const getResourceUser = res => get('/api/v1/user/resource/', res)
// 未使用 不明
export const postResourceUser = res => post('/api/v1/user/resource/', res) 
export const postUserbatchDelete = res => post('/api/v1/user/account/batchDelete', res)
// 资源管理 删除  用户   ##
export const delResourceUser = res => deletefn('/api/v1/user/resource/' + res, '')
// 账号包管理   查看收益
export const getIncome = res => get('/api/v1/user/income', res)
// 广告管理  广告记录   用户   ##
export const getTimeCount = res => get('/api/v1/adRecord/count', res)
// 广告管理  返利记录   用户   ##
export const getRewardTimeCount = res => get('/api/v1/reward/count', res)

// 账号管理 运行记录  用户   ##
export const getAccountRecordUser = res => get('/api/v1/user/accountRecord', res)
export const getProxyResource = res => get('/api/v1/user/proxy/', res)
export const delProxyResource = res => deletefn('/api/v1/proxy/' + res, '')

// 添加代理 管理员 用户管理
export const postAgency = res => post('/api/v1/agent/proxy/add' , res) 

// 管理员 用户管理 用户添加流量
export const putAddTraffic = res => put('/api/v1/proxy/flow' , res)

// 管理员 用户管理 查看代理 用户   ##
export const getAgencyUser = res => get('/api/v1/user/proxy/', res)
// 私信 名片   ##
export const postTiktokParseNameCard = res => post('/api/v1/tiktokParse/nameCard', res)
// 私信 名片 用户   ##
export const postTiktokParseNameCardUser = res => post('/api/v1/user/tiktokParse/nameCard', res)
// 修改昵称  用户 ##
export const setAccountNicknameUser = res => post('/api/v1/user/accountInfo/nickname', res)
// 修改个签  用户 ##
export const setAccountSignatureUser = res => post('/api/v1/user/accountInfo/signature', res)
// 修改头像  用户 ##
export const setAccountAvatarUser = res => post('/api/v1/user/accountInfo/avatar', res)
// 管理员  代理商等级设置 
export const getAgentLevel = res => get('/api/v1/admin/agentLevel/', res)
export const postAgentLevel = res => post('/api/v1/admin/agentLevel/', res)
export const putAgentLevel = res => put('/api/v1/admin/agentLevel/', res)
export const deletefnAgentLevel = res => deletefn('/api/v1/admin/agentLevel/', res)
export const putSetOfficial = res => put('/api/v1/admin/commodityAccount/setOfficial' , res)
export const postAgentLevelSet = res => post('/api/v1/admin/agentLevel/set', res)
export const postPointsRecord = res => post('/api/v1/admin/pointsRecord', res)
export const getAdminResource = res => get('/api/v1/admin/resource/', res) 
export const postAdminExamineResource = res => post('/api/v1/admin/resource/ExamineResource', res)


// 管理员 系统配置
export const postAdminConfig = res => post('/api/v1/admin/config/', res)
export const getAdminConfig = res => get('/api/v1/admin/config/'+ res, )
export const getAdminCommodityAccount = res => get('/api/v1/admin/commodityAccount', res)

// 代理商 
export const getAgent = res => get('/api/v1/agent/user/', res)
export const addAgentInter = res => post('/api/v1/agent/user/', res)
export const getAgencyProxy = res => get('/api/v1/agent/proxy/', res)
export const postAgencyAddFlow = res => post('/api/v1/agent/proxy/addFlow' , res)
export const postAgencyBuy = res => post('/api/v1/agent/proxy/buy' , res)
export const postAgentPort = res => post('/api/v1/agent/port/', res)
export const getAgentPort = res => get('/api/v1/agent/port/', res)
export const putAgentPortRenew = res => put('/api/v1/agent/port/renew', res)
export const getAgentAcount = res => get('/api/v1/agent/account', res)
export const putAgentRemark = res => put('/api/v1/agent/port/remark', res) 
export const getAgentPointsRecord = res => get('/api/v1/agent/pointsRecord', res)
export const getAgentCommodityAccount = res => get('/api/v1/agent/commodityAccount', res)
export const postAgentCommodityAccountBuy = res => post('/api/v1/agent/commodityAccount/buy' , res)
export const getAgentUser = res => get('/api/v1/agent/user/', res)
export const postAgentAcountAssign = res => post('/api/v1/agent/account/assign', res)
export const getAgentCommodityAccountOrder = res => get('/api/v1/agent/commodityAccount/order', res)
export const postAgentCommodityAccountStock = res => post('/api/v1/agent/commodityAccount/stock', res)
// export const putAcountRemarks = res => put('/api/v1/agent/account/remarks', res)

// 号商
export const getDealerUser = res => get('/api/v1/dealer/user', res)
export const deletefnDealerUser = res => deletefn('/api/v1/dealer/user/', res)
export const getDealerPointsRecord = res => get('/api/v1/dealer/pointsRecord', res)
export const getDealerAcount = res => get('/api/v1/dealer/account', res)
export const getDealerCommodityAccount = res => get('/api/v1/dealer/commodityAccount', res)
export const postDealerCommodityAccount = res => post('/api/v1/dealer/commodityAccount', res)
export const postDealeryAccountAssign = res => post('/api/v1/dealer/account/assign', res)


export const getGitIO = res => getGitIoURL(res)


