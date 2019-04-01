import axios from 'axios';
const Qs = require('qs');

// let base = 'https://dgerbu6e.qcloud.la/weapp';
// let base = 'http://47.101.167.187/weapp/index.php?';
let base = "/api";
//登录接口
export const requestLogin = params => { 
	return axios.post(
		`${base}/adminlogin/index`,
		Qs.stringify(params),
		{
	        headers: {
	          'Content-Type': 'application/x-www-form-urlencoded'
	        }
      	}
    ); 
};
//获取拿快递的信息接口
export const getExpressList = params => { 
	return axios.post(
		`${base}/admingetexpress/index`,
		Qs.stringify(params),
		{
	        headers: {
	          'Content-Type': 'application/x-www-form-urlencoded'
	        }
      	}
    ); 
};

//提交状态值
export const submitState = params => { 
	return axios.post(
		`${base}/admingetexpress/update`,
		Qs.stringify(params),
		{
	        headers: {
	          'Content-Type': 'application/x-www-form-urlencoded'
	        }
      	}
    ); 
};


//获取代发快递的信息接口 
export const getSendExpress = params => { 
	return axios.post(
		`${base}/admingetsendexpress/index`,
		Qs.stringify(params),
		{
	        headers: {
	          'Content-Type': 'application/x-www-form-urlencoded'
	        }
      	}
    ); 
};

//提交状态值
export const submitSendState = params => { 
	return axios.post(
		`${base}/admingetsendexpress/update`,
		Qs.stringify(params),
		{
	        headers: {
	          'Content-Type': 'application/x-www-form-urlencoded'
	        }
      	}
    ); 
};

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };