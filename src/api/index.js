import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router'

// create an axios instance
const request = axios.create({
  baseURL: process.env.NODE_ENV !== 'production' ? '/api' : '',
})

request.interceptors.request.use((config) => {
	//比如是否需要设置 token
  // debugger
  if (config.url === '/user/login') {
    config.headers['Authorization'] = `Basic ${btoa(config.data.username + ':' + config.data.password)}`
  } else {
    const auth = localStorage.getItem('Authorization')
    auth && (config.headers['Authorization'] = auth)
  }
	
  config.data && Object.keys(config.data).forEach((i => {
    if (!config.data[i]) {
      delete config.data[i]
    }
  }))
	return config
})

// response interceptor
request.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    console.log('response => ', response)
    if (res.status === '401') {
      localStorage.removeItem('user');
      Message({
        message: res.error,
        type: 'error',
        duration: 1.5 * 1000
      })
      return router.push('/login')
    } else if (res.status === 'error') {
      Message({
        message: res.error || res.status,
        type: 'error',
        duration: 1.5 * 1000
      })
    }

    if (res.success === false && res.msg) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 1.5 * 1000
      })
    }

    
    return res
  },
  ({ message, response }) => {
    console.log('err => ', message, response) // for debug
    if (response && response.data && response.data.detail) {
      Message({
        message: response.data.detail,
        type: 'error',
        duration: 2 * 1000
      })
    } else {
      Message({
        message: message,
        type: 'error',
        duration: 2 * 1000
      })
    }
    if (response && (response.status === 403 || response.status === 401)) {
      localStorage.removeItem('user');
      router.push('/login')
    }
    return Promise.reject(message)
  }
)

export async function login(data){
  await request({
    url: '/',
    method: 'get',
    headers: {
      accept: 'text/html'
    },
    data
  })
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function modifyPassword (params) {
  return request({
    url: '/api/user/pwd/modify',
    method: 'post',
    params
  })
}

export function forgetPassword (params) {
  return request({
    url: '/api/user/pwd/reset',
    method: 'post',
    params
  })
}

export function getAuthorPage (params) {
  return request({
    url: '/author/',
    method: 'get',
    params
  })
}

export function getAuthorDetail (id) {
  return request({
    url: `/author/${id}/`
  })
}

export function addAuthor (data) {
  return request({
    url: '/author/',
    method: 'post',
    data
  })
}

export function editAuthor (data) {
  const { id } = data
  delete data.id
  return request({
    url: `/author/${id}/`,
    method: 'put',
    data
  })
}

export function deleteAuthor (id) {
  return request({
    url: `/author/${id}/`,
    method: 'delete'
  })
}

export function getBookPage (params) {
  return request({
    url: '/book/',
    method: 'get',
    params
  })
}

export function getBookDetail (id) {
  return request({
    url: `/book/${id}/`
  })
}

export function addBook (data) {
  return request({
    url: '/book/',
    method: 'post',
    data
  })
}

export function editBook (data) {
  return request({
    url: '/book/',
    method: 'put',
    data
  })
}

export function deleteBook (id) {
  return request({
    url: `/book/${id}/`,
    method: 'delete'
  })
}

export function getPublisherPage (params) {
  return request({
    url: '/publisher/',
    method: 'get',
    params
  })
}

export function addPublisher (data) {
  return request({
    url: '/publisher/',
    method: 'post',
    data
  })
}

export function editPublisher (data) {
  return request({
    url: '/publisher/',
    method: 'put',
    data
  })
}

export function deletePublisher (id) {
  return request({
    url: `/publisher/${id}/`,
    method: 'delete'
  })
}

export function getCollegePage (params) {
  return request({
    url: '/college/',
    method: 'get',
    params
  })
}

export function addCollege (data) {
  return request({
    url: '/college/',
    method: 'post',
    data
  })
}

export function editCollege (data) {
  return request({
    url: '/college/',
    method: 'put',
    data
  })
}

export function deleteCollege (id) {
  return request({
    url: `/college/${id}/`,
    method: 'delete'
  })
}

export function getUserInfo (id) {
  return request({
    url: `/user/${id}/`,
    method: 'get'
  })
}

export function setUserInfo (data) {
  const { id } = data
  delete data.id
  return request({
    url: `/user/${id}/`,
    method: 'patch',
    data
  })
}

export function getRecommend () {
  return request({
    url: `/book-recommend/`
  })
}

export function bookSearch (params) {
  return request({
    url: '/book-search/',
    params
  })
}

export function getDictionary () {
  return request({
    url: '/dict/'
  })
}


export function getComment (params) {
  return request({
    url: '/comment/',
    params
  })
}

export function deleteComment (id) {
  return request({
    url: `/comment/${id}/`,
    method: 'delete'
  })
}



export function getBorrowList (params) {
  return request({
    url: '/borrow/',
    params
  })
}

export function returnBook (id) {
  return request({
    url: `/return/${id}/`,
    method: 'put'
  })
}

export function borrowBook (data) {
  return request({
    url: '/borrow/',
    method: 'post',
    data
  })
}

export function comment (data) {
  return request({
    url: '/comment/',
    data,
    method: 'post'
  })
}

export function renew (id) {
  return request({
    url: `/renew/${id}/`,
    method: 'put'
  })
}

export function createCopy (data) {
  return request({
    url: '/copy/',
    method: 'post',
    data
  })
}

export function getCopyPage (params) {
  return request({
    url: '/copy/',
    params
  })
}

export function getUserPage (params) {
  return request({
    url: '/user/',
    params
  })
}
