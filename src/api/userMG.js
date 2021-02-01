import axios from 'axios';
import { loginreq, req } from './axiosFun';

// 登录接口
export const login = (params) => { return loginreq("post", "/api/user/login", params) };
// 注册接口
export const register = (params) => { return req("post", "/api/user/register", params) };
// 获取用户菜单
export const menu = (params) => { return axios.get("/api/menu?&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 退出接口
export const loginout = () => { return axios.delete("/api/login?&token=" + localStorage.getItem('logintoken')).then(res => res.data) };

//获取游客文章列表
export const touristVisible = (params) => { return req("post", "/api/article/getTouristVisible", params) };
//获取登录后所以可见的文章
export const allVisible = (params) => { return req("post", "/api/article/getAllVisible", params) };
//获取所有标签
export const getAllLables = () => { return req("post", "/api/lable/getAllLables") };
//获取评论数
export const getCommentCount = (params) => { return req("post", "/api/article/getArticleCommentCount", params) };
//进入他人主页后可以看到的文章列表
export const showAdminArticle = (params) => { return req("post", "/api/article/showAdminArticle", params) }
//获取粉丝数
export const fansCount = (params) => { return axios.get( "/api/user/getFansCount?userId=" + params) }
//获取关注数
export const followCount = (params) => { return axios.get( "/api/user/getAttentionCount?userId=" + params) }
//获取访问数
export const viewerCount = (params) => { return axios.get( "/api/user/getViewerCount?userId=" + params) }
//获取黑名单数
export const blackCount = (params) => { return axios.get( "/api/user/getBlackCount?userId=" + params) }
//获取点赞数
export const praiseCount = (params) => { return axios.get( "/api/user/getPraiseCount?userId=" + params) }
//获取排名
export const getOrder = (params) => { return axios.get( "/api/user/getOrder?userId=" + params) }
//获取我的关注文章
export const getFollow = (params) => { return req("post", "/api/article/getFollow", params) };
//获取我的收藏文章列表
export const getCollection = (params) => { return req("post", "/api/article/getCollectionList", params) };
//获取我的文章列表
export const getMyArticle = (params) => { return req("post", "/api/article/getMyArticle", params) };
//获取粉丝列表
export const getFansList = (params) => { return req("post", "/api/user/getFansList", params) };
//获取关注列表
export const getAttentionList = (params) => { return req("post", "/api/user/getAttentionList", params) };
//获取黑名单列表
export const getBlackList = (params) => { return req("post", "/api/user/getBlackList", params) };
//获取排名列表
export const getOrderList = () => { return axios.get( "/api/user/getOrderList")};
//获取访客列表
export const getViewerList = (params) => { return req("post", "/api/user/getViewerList", params) };
//写文章
export const writeArticle = (params) => { return req("post", "/api/article/writeArticle", params) }
//获取文章详情
export const getArticleDetail = (params) => { return axios.get( "/api/article/getArticleDetail?articleId=" + params) }
//编辑文章
export const editArticle = (params) => { return req("post", "/api/article/editArticle", params) }
//判断是否点赞该文章
export const isPraise = (userId, articleId) => { return axios.get( "/api/user/isPraise?userId=" + userId + "&articleId=" + articleId) }
//判断是否收藏该文章
export const isCollection = (userId, articleId) => { return axios.get( "/api/user/isCollection?userId=" + userId + "&articleId=" + articleId) }
//收藏该文章
export const addCollection = (userId, articleId) => { return axios.get( "/api/article/addCollection?userId=" + userId + "&articleId=" + articleId) }
//取消收藏该文章
export const deleteCollection = (userId, articleId) => { return axios.get( "/api/article/deleteCollection?userId=" + userId + "&articleId=" + articleId) }
//点赞该文章
export const praiseArticle = (userId, articleId) => { return axios.get( "/api/article/praiseArticle?userId=" + userId + "&articleId=" + articleId) }
//取消赞
export const delPraise = (userId, articleId) => { return axios.get( "/api/article/delPraise?userId=" + userId + "&articleId=" + articleId) }
//点赞量增加
export const increasePraise = (articleId) => { return axios.get( "/api/article/increasePraise?articleId=" + articleId) }
//点赞量减一
export const decreasePraise = (articleId) => { return axios.get( "/api/article/decreasePraise?articleId=" + articleId) }
//浏览量增加
export const increaseViews = (articleId) => { return axios.get( "/api/article/increaseViews?articleId=" + articleId) }
//修改用户信息
export const saveUserInfo = (params) => { return req("post", "/api/user/save", params) }
//取消关注
export const deleteAttention = (userId, fansId) => { return axios.get( "/api/user/deleteAttention?userId=" + userId + "&fansId=" + fansId) }
//移除黑名单
export const deleteBlack = (userId, blackId) => { return axios.get( "/api/user/deleteBlack?userId=" + userId + "&blackId=" + blackId) }
//访客增加
export const addViewer = (adminId, viewerId) => { return axios.get( "/api/user/addViewer?adminId=" + adminId + "&viewerId=" + viewerId) }
//获取用户信息
export const getUserInfo = (userId) => { return axios.get( "/api/user/getUserInfo?userId=" + userId) }
//判断是否拉黑
export const isBlack = (viewerId, adminId) => { return axios.get( "/api/user/isBlack?viewerId=" + viewerId + "&adminId=" + adminId) }
//判断是否关注
export const isAttention = (viewerId, adminId) => { return axios.get( "/api/user/isAttention?viewerId=" + viewerId + "&adminId=" + adminId) }
//拉黑
export const addBlack = (viewerId, adminId) => { return axios.get( "/api/user/addBlack?userId=" + viewerId + "&blackId=" + adminId) }
//关注
export const addAttention = (viewerId, adminId) => { return axios.get( "/api/user/addAttention?userId=" + adminId + "&fansId=" + viewerId) }
//删除文章
export const deleteArticle = (articleId) => { return axios.get( "/api/article/delete?id=" + articleId) }
