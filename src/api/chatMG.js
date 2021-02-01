import axios from 'axios';
import { loginreq, req } from './axiosFun';



// 获取评论列表
export const getMessageList = (params) => { return req("post", "/api/message/getTalk", params) };
//添加评论
export const addMessage= (params) => { return req('post',"/api/message/save", params)};
//删除当前用户和所选用户的留言记录
export const delMessage= (params) => { return req('post',"/api/message/delete", params)};
//获取新留言
export const getNewMessage = (params) => { return req('post',"/api/message/getNewMessage?userId="+params, params)};
