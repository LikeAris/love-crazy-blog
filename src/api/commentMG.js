import axios from 'axios';
import { loginreq, req } from './axiosFun';



// 获取评论列表
export const getCommentList = (params) => { return req("post", "/api/comment/get?articleId="+params, params) };
//添加评论
export const addComment= (params) => { return req('post',"/api/comment/save", params)};
