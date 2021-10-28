import { config } from '@vue/test-utils'
import axios from 'axios' // 引入axios
import {
  Message
} from 'element-ui'
import QueryString from 'qs'

const apiAddress = process.env.VUE_APP_BASE_API
axios.defaults.timeout = 5000
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

axios.interceptors.request.use(
  config => {
    // 表示在配置中的设置头消息的字段Authorization为从本地获取的token值
    config.headers.Authorization = ('Bearer ' + window.sessionStorage.getItem('token'))
    if (config.method === "get") {
      config.data = { unused: 0 }; // 这个是关键点，加入这行就可以了,解决get,请求添加不上Content-Type
      config.headers["Content-type"] = "application/x-www-form-urlencoded;charset=UTF-8";
    } else {
      config.headers["Content-type"] = "application/json;charset=UTF-8";
    }
    // config.headers["Content-type"] = "application/x-www-form-urlencoded;charset=UTF-8";

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.message.includes('timeout')) {
      Message({
        message: '网络超时',
        type: 'error'
      })
      return Promise.reject(error)
    }
    Message({
      message: '服务器错误',
      type: 'error'
    })
    return Promise.reject(error)
  }
)

export function get(url, param = {}) {
  /* let str = ''
  Object.keys(params).forEach((key, index) => {
    if (params[key] != null && params[key] !== '') {
      str = `${str}&${key}=${params[key]}`
    }
  })
  if (str) {
    str = '?' + str.slice(1)
  }
  str = url + str */
  return ajaxGET(url, param)
}
export function gets(url, params = {}) {
/*   let str = ''
  if (params) {
    str = '?' + params
  }
  str = url + str */
  return ajaxGET( url, params)
}
export function post(url, params) {
  return ajax('post', url, params)
}
export function put(url, params) {
  return ajax('put', url, params)
}
export function deletefn(url, params) {
  return ajax('delete', url + params)
}

function ajax(type = 'get', url = '', params = {}) {
  return new Promise((resolve, reject) => {
    let isMessage = true
    if (params.isMessage != null) {
      isMessage = params.isMessage
      delete params.isMessage
    }
      axios[type](apiAddress + url, params)
        .then(res => {
          if (res && res.headers && res.headers['content-type'] === 'application/octet-stream') {
            convertRes2Blob(res)
            Message({
              message: '下载成功',
              type: 'success'
            })
            resolve({
              code: 0
            })
            return
          }
          if (res && res.data && res.data.code === -401) {
            /* window.sessionStorage.clear()
            location.href = location.origin + '/#/login' */
          } else if (res && res.data && res.data.code !== 0) {
            /* Message({
              message: res.data.msg,
              type: 'error'
            }) */
            reject(res.data)
          } else {
            // 做了增删改后前端提示
            if (isMessage) {
              prompt(type, url)
            }
            resolve(res.data)
          }
        })
        .catch(err => {
          reject(err.data)
        })
    })
}


function ajaxGET(url = '',  params = {}) {
  return new Promise((resolve, reject) => {
    /* let isMessage = true
    if (params.isMessage != null) {
      isMessage = params.isMessage
      delete params.isMessage
    } */
    // axios.get(apiAddress + url, {data: QueryString.stringify(params)})
    axios.get(apiAddress + url, {params}).then(res => {
        if (res && res.headers && res.headers['content-type'] === 'application/octet-stream') {
          convertRes2Blob(res)
          Message({
            message: '下载成功',
            type: 'success'
          })
          resolve({
            code: 0
          })
          return
        }
        if (res && res.data && res.data.code === -401) {
          /* window.sessionStorage.clear()
          location.href = location.origin + '/#/login' */
        } else if (res && res.data && res.data.code != 0) {
          Message({
            message: res.data.msg,
            type: 'error'
          })
          reject(res.data)
        } else {
          // 做了增删改后前端提示
          /* if (isMessage) {
            prompt(type, url)
          } */
          resolve(res.data)
        }
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

function prompt(type, url) {
  if (type === 'post' && url === '/api/v1/auth/') {
    Message({
      message: '登录成功',
      type: 'success'
    })
    return
  }
  if (type === 'delete') {
    Message({
      message: '删除成功',
      type: 'success'
    })
    return
  }
/*   if (type === 'post') {
    Message({
      message: '提交成功',
      type: 'success'
    })
  } */
  if (type === 'put') {
    Message({
      message: '修改成功',
      type: 'success'
    })
    return
  }
}

function convertRes2Blob(response) {

  console.log(response)
  // 提取文件名

  const fileName = response.headers['content-disposition'].match(
    /filename=(.*)/
  )[1]

  // 将二进制流转为blob
  const blob = new Blob([response.data[0]], {
    type: 'application/octet-stream'
  })
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
    window.navigator.msSaveBlob(blob, decodeURI(fileName))
  } else {

    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob)
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', fileName)

    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    // 挂载a标签
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL)
  }
}
