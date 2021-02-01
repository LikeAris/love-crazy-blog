<template>
  <div>
    <div class="left">
      <el-container>
        <el-header>标签云</el-header>
        <el-main>
			<el-tag @click="lableClick('')">全部</el-tag>
			<el-tag class="tag" :key="lable.id" v-for="lable in lables" @click="lableClick(lable.id)">{{lable.name}}</el-tag>
        </el-main>
      </el-container>
    </div>
    <div class="mid">
      <el-container>
        <el-header>
			<div>
			    <span><el-button type="text" v-model="temp" @click="getdata(formInline)">首页</el-button></span>
			    <el-divider direction="vertical"></el-divider>
			    <span><el-button type="text" v-model="temp" @click="getFollow(formInline)">我的关注</el-button></span>
			    <el-divider direction="vertical"></el-divider>
			    <span><el-button type="text" v-model="temp" @click="getCollection(formInline)">我的收藏</el-button></span>
				<el-divider direction="vertical"></el-divider>
				<span><el-button type="text" v-model="temp" @click="getMyArticle(formInline)">我的文章</el-button></span>
			  </div>
		</el-header>
        <el-main>
			<el-form :model="formInline" ref="queryForm" :inline="true"  label-width="68px">
			    <el-form-item label="关键字" prop="postName">
			      <el-input
			        v-model="formInline.title"
			        placeholder="请输入关键字"
			        clearable
			        size="small"/>
			    </el-form-item>
			    <el-form-item label="发布者" prop="postName">
			      <el-input
			        v-model="formInline.username"
			        placeholder="请输入发布者"
			        clearable
			        size="small"/>
			    </el-form-item>
			    <el-form-item>
			      <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
			      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
			    </el-form-item>
			  </el-form>
          <el-timeline>
              <el-timeline-item :key="article.id" :timestamp="'发布于'+article.putTime" placement="top" v-for="article in articleList">
                <el-card>
				<el-avatar icon="el-icon-user-solid" :src="article.head"></el-avatar><span>{{article.username}}</span><br />
                  <h2>
                    <router-link target="_blank" :to="{name: 'articleDetail', params: {articleId: article.id}}">
                      {{article.title}}
                    </router-link>
                  </h2>
				  <p>{{article.file}}</p>
				  <el-badge :value="article.views" :max="99" class="item">
				    <el-button size="small">浏览</el-button>
					</el-badge>
					<el-badge :value="article.commentCount" :max="99" class="item">
					  <el-button size="small">评论</el-button>
					</el-badge>
					<el-badge :value="article.praise" :max="99" class="item">
					  <el-button size="small">赞</el-button>
				  </el-badge>
				  <div class="time">
					  <span>最近修改{{article.modifyTime}}</span>
					  <router-link v-show="editVisible == 1" target="_blank" :to="{name: 'editArticle', params: {articleId: article.id}}">编辑</router-link>
					  <el-button type="danger" icon="el-icon-delete" circle v-show="delCollection == 1" @click="deleletCol(formInline.userId, article.id)"></el-button>
					  <el-button type="danger" icon="el-icon-delete" circle v-show="delArticle == 1" @click="deleteArticle(article.id)"></el-button>
				  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
            <!-- 分页组件 -->
            <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
        </el-main>
      </el-container>
    </div>
    <div class="right">
		<el-container>
		  <el-header>
			  <p><el-link type="primary" @click="logOut">退出</el-link></p>
		  </el-header>
		  <el-main>
			  <div>
				   <el-button circle @click="headDialogVisible = true"><el-avatar icon="el-icon-user-solid" :src="user.head"></el-avatar></el-button>
				  <p>{{user.motto}}</p>
				    <p>
				  	  <el-dropdown @command="handleCommand">
				  	  <span class="el-dropdown-link">
				  		{{user.username}}<i class="el-icon-arrow-down el-icon--right"></i>
				  	  </span>
				  	  <el-dropdown-menu slot="dropdown">
				  		<el-dropdown-item command="1">个人信息</el-dropdown-item>
				  		<el-dropdown-item command="2">修改密码</el-dropdown-item>
				  		<el-dropdown-item command="3">帮助</el-dropdown-item>
				  	  </el-dropdown-menu>
				  	</el-dropdown>
				  </p>
			  </div>
			  <div>
				  <span>粉丝：<el-button type="text" @click="fansList(fansFormInline)">{{fans}}</el-button></span>
				  <span>关注：<el-button type="text" @click="followList(followFormInline)">{{follow}}</el-button></span>
				  <span>黑名单：<el-button type="text" @click="blackList(blackFormInline)">{{black}}</el-button></span><br />
				  <span>获赞：<el-button type="text" >{{praise}}</el-button></span>
				  <span>访问：<el-button type="text" @click="viewerList(viewerFormInline)">{{viewer}}</el-button></span>
				  <span>排名：<el-button type="text" @click="orderList">{{order}}</el-button></span>
			  </div>
			  <el-row>
				   <el-col :span="12">
					   <div class="msg">
							<div class="msg">
							<el-row class="block-col-2">
							  <el-col :span="12">
							    <el-dropdown trigger="click" @command="handleCommand2">
							      <span class="el-dropdown-link">
							        <el-button icon="el-icon-message" >私信</el-button>
							      </span>
							      <el-dropdown-menu slot="dropdown">
							        <el-dropdown-item v-for="(item,index) in list" :command="item.withUserId" :key="index">
							        <div class="web__main" ref="main">
							          <div
							            class="web__main-item"
							            :key="JSON.stringify(item)"
							            :class="{'web__main-item--mine':item.mine}"
							          >
							            <div class="web__main-user">
							              <img :src="item.head" @click="bindClick('img',item)" />
							              <cite>
							                {{item.username}}
							                <i>{{item.time}}</i>
							              </cite>
							            </div>
							            <div class="web__main-text">
							              <div class="web__main-arrow"></div>
							              <itemTalk v-if="item.message" :text="item.message" />
							            </div>
							          </div>
							        </div>
							        </el-dropdown-item>
							      </el-dropdown-menu>
							    </el-dropdown>
							  </el-col>
							</el-row>
							<!-- 弹出框 -->
							<!-- <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button> -->
							<el-dialog
							  title="私信"
							  :visible.sync="dialogVisible"
							  width=45%
							  :before-close="handleClose">
							  <span>
							    <Message
							      :uids="users"
							      v-if="hackReset == true"
							    >
							  </Message></span>
							  <span slot="footer" class="dialog-footer">
							  </span>
							</el-dialog>
							</div>
						</div>
				  </el-col>
				    <el-col :span="12">
						<div class="write">
							<router-link target="_blank" to="/editArticle">写博客</router-link>
						</div>
					</el-col>
			  </el-row>
		  </el-main>
		</el-container>
	</div>
	<el-dialog
	  title="完善个人信息"
	  :visible.sync="infoDialogVisible"
	  width="30%">
	 <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="100px" class="demo-ruleForm">
	   <el-form-item label="用户名" prop="username">
	     <el-input v-model="infoForm.username"></el-input>
	   </el-form-item>
	  <el-form-item label="性别" prop="sex">
	        <el-radio v-model="infoForm.sex" :label="0">男</el-radio>
	        <el-radio v-model="infoForm.sex" :label="1">女</el-radio>
	    </el-form-item>
	   <el-form-item label="个性签名" prop="motto">
	       <el-input type="textarea" v-model="infoForm.motto"></el-input>
	     </el-form-item>
	   <el-form-item label="电话" prop="phone">
	     <el-input v-model="infoForm.phone"></el-input>
	   </el-form-item>
	   <el-form-item label="邮箱" prop="email">
	     <el-input v-model="infoForm.email"></el-input>
	   </el-form-item>
	   <el-form-item>
	     <el-button type="primary" @click="infoSubmit('infoForm')">保存</el-button>
		  <el-button type="primary" @click="infoDialogVisible = false">取消</el-button>
	   </el-form-item>
	 </el-form>
	</el-dialog>
	<el-dialog
	  title="修改密码"
	  :visible.sync="pwdDialogVisible"
	  width="30%">
	 <el-form :model="pwdForm" :rules="rules" ref="pwdForm" label-width="120px" class="demo-ruleForm">
	   <el-form-item label="请输入原密码" prop="oldPwd">
	     <el-input type="password" v-model="pwdForm.oldPwd"></el-input>
	   </el-form-item>
	    <el-form-item label="输入新密码" prop="newPwd">
	       <el-input type="password" v-model="pwdForm.newPwd" autocomplete="off"></el-input>
	     </el-form-item>
	     <el-form-item label="确认新密码" prop="checkNewPwd">
	       <el-input type="password" v-model="pwdForm.checkNewPwd" autocomplete="off"></el-input>
	     </el-form-item>
	   <el-form-item>
	     <el-button type="primary" @click="pwdSubmit('pwdForm')">保存</el-button>
		  <el-button type="primary" @click="pwdDialogVisible = false">取消</el-button>
	   </el-form-item>
	 </el-form>
	</el-dialog>
	<el-dialog
	  title="粉丝列表"
	  :visible.sync="fansListVisible"
	  width="40%">
	  <span>
		  <el-table
		      :data="fansL"
		      stripe
		      style="width: 100%">
		      <el-table-column
		        prop="head"
		        label="头像"
		        width="180">
				<template slot-scope="scope">
				     <el-avatar :src="scope.row.head"></el-avatar>
				</template>
		      </el-table-column>
		      <el-table-column
		        prop="username"
		        label="用户名"
		        width="180">
		      </el-table-column>
		      <el-table-column
		        prop="operator"
		        label="操作">
				<template slot-scope="scope">
				     <el-button type="text" size="small" @click="deleteFans(scope.row.id)">移除粉丝</el-button>
				</template>
		      </el-table-column>
		    </el-table>
			<Pagination v-bind:child-msg="fanspageparm" @callFather="fanscallFather"></Pagination>
	  </span>
	  <span slot="footer" class="dialog-footer">
	  </span>
	</el-dialog>
	<el-dialog
	  title="关注列表"
	  :visible.sync="followListVisible"
	  width="40%">
	  <span>
		  <el-table
		      :data="followL"
		      stripe
		      style="width: 100%">
		      <el-table-column
		        prop="head"
		        label="头像"
		        width="180">
				<template slot-scope="scope">
				     <el-avatar :src="scope.row.head"></el-avatar>
				</template>
		      </el-table-column>
		      <el-table-column
		        prop="username"
		        label="用户名"
		        width="180">
		      </el-table-column>
		      <el-table-column
		        prop="operator"
		        label="操作">
				<template slot-scope="scope">
				     <el-button type="text" size="small" @click="deleteFollow(scope.row.id)">取消关注</el-button>
				</template>
		      </el-table-column>
		    </el-table>
			<Pagination v-bind:child-msg="followpageparm" @callFather="followcallFather"></Pagination>
	  </span>
	  <span slot="footer" class="dialog-footer">
	  </span>
	</el-dialog>
	<el-dialog
	  title="黑名单列表"
	  :visible.sync="blackListVisible"
	  width="40%">
	  <span>
		  <el-table
		      :data="blackL"
		      stripe
		      style="width: 100%">
		      <el-table-column
		        prop="head"
		        label="头像"
		        width="180">
				<template slot-scope="scope">
				     <el-avatar :src="scope.row.head"></el-avatar>
				</template>
		      </el-table-column>
		      <el-table-column
		        prop="username"
		        label="用户名"
		        width="180">
		      </el-table-column>
		      <el-table-column
		        prop="operator"
		        label="操作">
				<template slot-scope="scope">
				     <el-button type="text" size="small" @click="deleteBlack(scope.row.id)">移除黑名单</el-button>
				</template>
		      </el-table-column>
		    </el-table>
			<Pagination v-bind:child-msg="blackpageparm" @callFather="blackcallFather"></Pagination>
	  </span>
	  <span slot="footer" class="dialog-footer">
	  </span>
	</el-dialog>
	<el-dialog
	  title="排名列表"
	  :visible.sync="orderListVisible"
	  width="40%">
	  <span>
		  <el-table
		      :data="orderL"
		      stripe
		      style="width: 100%">
		      <el-table-column
		        prop="head"
		        label="头像"
		        width="180">
				<template slot-scope="scope">
				     <el-avatar :src="scope.row.head"></el-avatar>
				</template>
		      </el-table-column>
		      <el-table-column
		        prop="username"
		        label="用户名"
		        width="180">
		      </el-table-column>
			  <el-table-column
			    prop="praiseCount"
			    label="获赞"
			    width="180">
			  </el-table-column>
		    </el-table>
	  </span>
	  <span slot="footer" class="dialog-footer">
	  </span>
	</el-dialog>
	<el-dialog
	  title="访客列表"
	  :visible.sync="viewerListVisible"
	  width="40%">
	  <span>
		  <el-table
		      :data="viewerL"
		      stripe
		      style="width: 100%">
		      <el-table-column
		        prop="head"
		        label="头像"
		        width="180">
				<template slot-scope="scope">
				     <el-avatar :src="scope.row.head"></el-avatar>
				</template>
		      </el-table-column>
		      <el-table-column
		        prop="username"
		        label="用户名"
		        width="180">
		      </el-table-column>
			  <el-table-column
			    prop="time"
			    label="访问时间"
			    width="180">
			  </el-table-column>
		    </el-table>
			<Pagination v-bind:child-msg="viewerpageparm" @callFather="viewercallFather"></Pagination>
	  </span>
	  <span slot="footer" class="dialog-footer">
	  </span>
	</el-dialog>
	<el-dialog
	  title="更换头像"
	  :visible.sync="headDialogVisible"
	  width="30%">
	 <el-form label-width="120px" class="demo-ruleForm">
		 <el-form-item label="头像">
		     <el-upload
		  class="avatar-uploader"
		  action="http://localhost:1109/user/upload"
		  name="headImg"
		  :show-file-list="false"
		  :on-success="handleAvatarSuccess"
		  :before-upload="beforeAvatarUpload">
		  <img v-if="imgUrl" :src="imgUrl" class="avatar">
		  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
		  </el-form-item>
	     <el-button type="primary" @click="headSubmit('infoForm')">保存</el-button>
		  <el-button type="primary" @click="headDialogVisible = false">取消</el-button>
	 </el-form>
	</el-dialog>
  </div>
</template>

<script>
	// 导入请求方法
	import {
		allVisible,
		getAllLables,
		fansCount,
		followCount,
		blackCount,
		praiseCount,
		viewerCount,
		getOrder,
		getFollow,
		getCollection,
		getMyArticle,
		getFansList,
		getAttentionList,
		getOrderList,
		getBlackList,
		getViewerList,
		deleteCollection,
		saveUserInfo,
		deleteAttention,
		deleteBlack,
		deleteArticle
	} from "../api/userMG.js"
	import Pagination from '../components/Pagination.vue'
	import itemTalk from '../components/Chat/itemTalk'
	import {getNewMessage} from '../api/chatMG'
	import Message from '../components/Message.vue'
  export default{
    data(){
		var checkOldPwd = (rule, value, callback) => {
		if (!value) {
		  return callback(new Error('密码不能为空'));
		}
		setTimeout(() => {
		  if (value !== this.user.password) {
			callback(new Error('密码错误'));
		  } else {
			  callback();
		  }
		}, 1000);
	  };
	  var validatePass = (rule, value, callback) => {
		if (value === '') {
		  callback(new Error('请输入新密码'));
		} else {
		  if (this.pwdForm.checkNewPwd !== '') {
			this.$refs.pwdForm.validateField('checkNewPwd');
		  }
		  callback();
		}
	  };
	  var validatePass2 = (rule, value, callback) => {
		if (value === '') {
		  callback(new Error('请再次输入密码'));
		} else if (value !== this.pwdForm.newPwd) {
		  callback(new Error('两次输入密码不一致!'));
		} else {
		  callback();
		}
	  };
      return{
		infoDialogVisible: false,
		pwdDialogVisible: false,
		fansListVisible: false,
		followListVisible: false,
		blackListVisible: false,
		orderListVisible: false,
		viewerListVisible: false,
		headDialogVisible: false,
		editVisible: 0,
		delCollection: 0,
		delArticle: 0,
		imgUrl:"",
		fans:0,
		follow:0,
		black:0,
		praise:0,
		viewer:0,
		temp:0,
		fansL:{},
		followL:{},
		blackL:{},
		viewerL:{},
		orderL:{},
		order:"无",
        lables:{},
        articleList:{},
		user:{},
		userId:0,
		list:[],
		dialogVisible: false,
		hackReset:false,
		users:{
		  userId:0,
		  withUserId:0,
		},
		infoForm:{

		},
		pwdForm:{
			oldPwd:"",
			newPwd:"",
			checkNewPwd:""
		},
        formInline: {
          page: 1,
          limit: 5,
		  userId:0,
		  title: "",
		  username: "",
		  lableId: 0
        },
		fansFormInline: {
			page: 1,
			limit: 5,
			userId:0,
		},
		followFormInline: {
			page: 1,
			limit: 5,
			userId:0,
		},
		blackFormInline: {
			page: 1,
			limit: 5,
			userId:0,
		},
		viewerFormInline: {
			page: 1,
			limit: 5,
			userId:0,
		},
		pageparm: {
		  currentPage: 1,
		  pageSize: 5,
		  total: 0
		},
		fanspageparm:{
			currentPage: 1,
			pageSize: 5,
			total: 0
		},
		followpageparm:{
			currentPage: 1,
			pageSize: 5,
			total: 0
		},
		blackpageparm:{
			currentPage: 1,
			pageSize: 5,
			total: 0
		},
		viewerpageparm:{
			currentPage: 1,
			pageSize: 5,
			total: 0
		},
		rules: {
		         username: [
		           { required: true, message: '', trigger: 'blur' },
		           { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
		         ],
				 password: [
					 { required: true, message: '', trigger: 'blur' },
					 { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
				 ],
				 sex: [
				      { required: true, message: '请选择性别', trigger: 'change' }
				 ],
				 newPwd: [
				 { validator: validatePass, trigger: 'blur' },
				 { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
			   ],
			   checkNewPwd: [
				 { validator: validatePass2, trigger: 'blur' },
				 { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
			   ],
			   oldPwd: [
				 { validator: checkOldPwd, trigger: 'blur' }
			   ]
		    }
      };

    },
    methods:{
      lableClick(lableId){
        this.formInline.lableId = lableId;
		this.getdata(this.formInline)
      },
	   getdata(parameter) {
	    this.loading = true
		this.temp = 0
		this.editVisible = 0
		this.delCollection = 0
		this.delArticle = 0
	    allVisible(parameter).then(res => {
	      this.loading = false
		  console.log(res)
	      if (res.success == false) {
	        this.$message({
	          type: 'info',
	          message: res.msg
	        })
	      } else {
	        this.articleList = res.data.list
	        // 分页赋值
	        this.pageparm.currentPage = this.formInline.page
	        this.pageparm.pageSize = this.formInline.limit
	        this.pageparm.total = res.total
	      }
	    })
	  },
	  getFollow(parameter) {
	    this.loading = true
		this.temp = 1
		this.editVisible = 0
		this.delCollection = 0
		this.delArticle = 0
	    getFollow(parameter).then(res => {
	      this.loading = false
	      if (res.success == false) {
	        this.$message({
	          type: 'info',
	          message: res.msg
	        })
	      } else {
	        this.articleList = res.data.list
	        // 分页赋值
	        this.pageparm.currentPage = this.formInline.page
	        this.pageparm.pageSize = this.formInline.limit
	        this.pageparm.total = res.total
	      }
	    })
	  },
	  getCollection(parameter) {
	    this.loading = true
		this.temp = 2
		this.editVisible = 0
		this.delCollection = 1
		this.delArticle = 0
	    getCollection(parameter).then(res => {
	      this.loading = false
	      if (res.success == false) {
	        this.$message({
	          type: 'info',
	          message: res.msg
	        })
	      } else {
	        this.articleList = res.data.list
	        // 分页赋值
	        this.pageparm.currentPage = this.formInline.page
	        this.pageparm.pageSize = this.formInline.limit
	        this.pageparm.total = res.total
	      }
	    })
	  },
	  getMyArticle(parameter) {
	    this.loading = true
		this.temp = 3
		this.editVisible = 1
		this.delCollection = 0
		this.delArticle = 1
	    getMyArticle(parameter).then(res => {
	      this.loading = false
	      if (res.success == false) {
	        this.$message({
	          type: 'info',
	          message: res.msg
	        })
	      } else {
	        this.articleList = res.data.list
	        // 分页赋值
	        this.pageparm.currentPage = this.formInline.page
	        this.pageparm.pageSize = this.formInline.limit
	        this.pageparm.total = res.total
	      }
	    })
	  },
	  getAllLables(){
		  this.loading = true
		  getAllLables().then(res => {
		    this.loading = false
		    if (res.success == false) {
		      this.$message({
		        type: 'info',
		        message: res.msg
		      })
		    } else {
		      this.lables = res.data
		    }
		  })
	  },
	  // 分页插件事件
	  callFather(parm) {
	    this.formInline.page = parm.currentPage
	    this.formInline.limit = parm.pageSize
		if(this.temp == 0){
			this.getdata(this.formInline)
		}else if(this.temp == 1){
			this.getFollow(this.formInline)
		}else if(this.temp == 2){
			this.getCollection(this.formInline)
		}else if(this.temp == 3){
			this.getMyArticle(this.formInline)
		}
	  },
	  fanscallFather(parm){
		  this.fansFormInline.page = parm.currentPage
		  this.fansFormInline.limit = parm.pageSize
		  this.fansList(this.fansFormInline)
	  },
	  followcallFather(parm){
		  this.followFormInline.page = parm.currentPage
		  this.followFormInline.limit = parm.pageSize
		  this.followList(this.followFormInline)
	  },
	  blackcallFather(parm){
		  this.blackFormInline.page = parm.currentPage
		  this.blackFormInline.limit = parm.pageSize
		  this.blackList(this.blackFormInline)
	  },
	  viewercallFather(parm){
	  		  this.viewerFormInline.page = parm.currentPage
	  		  this.viewerFormInline.limit = parm.pageSize
	  		  this.viewerList(this.viewerFormInline)
	  },
	  handleQuery(){
		  if(this.temp == 0){
			  this.getdata(this.formInline)
		  }else if(this.temp == 1){
			  this.getFollow(this.formInline)
		  }else if(this.temp == 2){
			  this.getCollection(this.formInline)
		  }else if(this.temp == 3){
			  this.getMyArticle(this.formInline)
		  }
	  },
	  resetQuery(){
		  this.formInline.title = ''
		  this.formInline.username = ''
	  },
	   handleCommand(command) {
	          if(command == 1){
				  this.infoForm = JSON.parse(localStorage.getItem('user'))
				  this.infoDialogVisible = true
			  }else if(command == 2){
				  this.pwdForm.oldPwd = ""
				  this.pwdForm.newPwd = ""
				  this.pwdForm.checkNewPwd = ""
				  this.pwdDialogVisible = true
			  }
	   },
		infoSubmit(infoForm){
			saveUserInfo(this.infoForm).then(res => {
			  if(res.code == 200){
				  this.user = res.data
				  localStorage.setItem("user", JSON.stringify(res.data))
				  this.infoDialogVisible = false
				   this.getdata(this.formInline)
				  this.$message({
					type: 'success',
					message: res.msg
				  })
			  }else{
				  this.$message.error(res.msg)
				  this.infoDialogVisible = false
			  }
			})
		},
		pwdSubmit(formName) {
			this.$refs[formName].validate((valid) => {
			  if (valid) {
				this.infoForm.password = this.pwdForm.newPwd
				saveUserInfo(this.infoForm).then(res => {
				  if(res.code == 200){
					  this.user = res.data
					  localStorage.setItem("user", JSON.stringify(res.data))
					  this.pwdDialogVisible = false
					   this.getdata(this.formInline)
					  this.$message({
						type: 'success',
						message: res.msg
					  })
				  }else{
					  this.$message.error(res.msg)
					  this.pwdDialogVisible = false
				  }
				})
			  } else {
				this.$message.error("请正确输入信息")
				return false;
			  }
			});
		},
		fansCount(userId){
			fansCount(userId).then(res => {
			  if (res.success == false) {
			    this.$message({
			      type: 'info',
			      message: res.msg
			    })
			  } else {
			    this.fans = res.data
			  }
			})
		},
		followCount(userId){
			followCount(userId).then(res => {
			  if (res.success == false) {
			    this.$message({
			      type: 'info',
			      message: res.msg
			    })
			  } else {
			    this.follow = res.data
			  }
			})
		},
		blackCount(userId){
			blackCount(userId).then(res => {
			  if (res.success == false) {
			    this.$message({
			      type: 'info',
			      message: res.msg
			    })
			  } else {
			    this.black = res.data.data
			  }
			})
		},
		praiseCount(userId){
			praiseCount(userId).then(res => {
			  if (res.success == false) {
			    this.$message({
			      type: 'info',
			      message: res.msg
			    })
			  } else {
			    this.praise = res.data.data
			  }
			})
		},
		viewerCount(userId){
			viewerCount(userId).then(res => {
			  if (res.success == false) {
			    this.$message({
			      type: 'info',
			      message: res.msg
			    })
			  } else {
			    this.viewer = res.data.data
			  }
			})
		},
		getOrder(userId){
			getOrder(userId).then(res => {
			  if (res.success == false) {
			    this.$message({
			      type: 'info',
			      message: res.msg
			    })
			  } else {
			    this.order = res.data.data
			  }
			})
		},
		fansList(parameter){
			getFansList(parameter).then(res => {
				console.log(res)
			  if (res.success == false) {
			    this.$message({
			      type: 'info',
			      message: res.msg
			    })
			  } else {
			    this.fansL = res.data.list
				this.fanspageparm.currentPage = this.fansFormInline.page
				this.fanspageparm.pageSize = this.fansFormInline.limit
				this.fanspageparm.total = res.total
				this.fansListVisible = true
			  }
			})
		},
		followList(parameter){
			getAttentionList(parameter).then(res => {
			  if (res.success == false) {
			    this.$message({
			      type: 'info',
			      message: res.msg
			    })
			  } else {
			    this.followL = res.data.list
				this.followpageparm.currentPage = this.followFormInline.page
				this.followpageparm.pageSize = this.followFormInline.limit
				this.followpageparm.total = res.total
				this.followListVisible = true
			  }
			})
		},
		blackList(parameter){
			getBlackList(parameter).then(res => {
				console.log(res)
			  if (res.success == false) {
			    this.$message({
			      type: 'info',
			      message: res.msg
			    })
			  } else {
			    this.blackL = res.data.list
				this.blackpageparm.currentPage = this.blackFormInline.page
				this.blackpageparm.pageSize = this.blackFormInline.limit
				this.blackpageparm.total = res.total
				this.blackListVisible = true
			  }
			})
		},
		viewerList(parameter){
			getViewerList(parameter).then(res => {
			  if (res.success == false) {
			    this.$message({
			      type: 'info',
			      message: res.msg
			    })
			  } else {
			    this.viewerL = res.data.list
				this.viewerpageparm.currentPage = this.viewerFormInline.page
				this.viewerpageparm.pageSize = this.viewerFormInline.limit
				this.viewerpageparm.total = res.total
				this.viewerListVisible = true
			  }
			})
		},
		orderList(){
			getOrderList().then(res => {
			  if (res.success == false) {
			    this.$message({
			      type: 'info',
			      message: res.msg
			    })
			  } else {
			    this.orderL = res.data.data
				this.orderListVisible = true
			  }
			})
		},
		logOut(){
			localStorage.removeItem('user')
			this.$router.push("/login")
		},
		deleletCol(userId, articleId){
			deleteCollection(userId, articleId).then(res => {
				this.$message({
				  type: 'success',
				  message: res.data.msg
				})
				this.getCollection(this.formInline)
			})
		},
	     handleAvatarSuccess(res) {
				this.infoForm.head = res.data
				this.imgUrl = this.infoForm.head
	          },
		  beforeAvatarUpload(file) {
			const isJPG = file.type === 'image/jpeg';
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG) {
			  this.$message.error('上传头像图片只能是 JPG 格式!');
			}
			if (!isLt2M) {
			  this.$message.error('上传头像图片大小不能超过 2MB!');
			}
			return isJPG && isLt2M;
		  },
		  headSubmit(){
			  saveUserInfo(this.infoForm).then(res => {
				  if(res.code == 200){
					  this.user = res.data
					  localStorage.setItem("user", JSON.stringify(res.data))
					  this.headDialogVisible = false
					   this.getdata(this.formInline)
					  this.$message({
					    type: 'success',
					    message: res.msg
					  })
				  }else{
					  this.$message.error(res.msg)
					  this.headDialogVisible = false
				  }

			  })
		  },
		  deleteFans(fansId){
			  deleteAttention(this.user.id, fansId).then(res => {
				  if(res.data.code == 200){
					  this.fansCount(this.user.id)
					  this.fansList(this.fansFormInline)
					  this.$message({
					    type: 'success',
					    message: res.data.msg
					  })
					  this.fansListVisible = false
				  }else{
					  this.$message.error(res.data.msg)
				  }
			  })
		  },
		  deleteFollow(userId){
			  deleteAttention(userId, this.user.id).then(res => {
				 if(res.data.code == 200){
					 this.followCount(this.user.id)
					  this.followList(this.followFormInline)
					  this.$message({
						type: 'success',
						message: res.data.msg
					  })
				 }else{
				 	 this.$message.error(res.data.msg)
				 }
			  })
		  },
		  deleteBlack(blackId){
			  deleteBlack(this.user.id, blackId).then(res => {
				  if(res.data.code == 200){
					 this.blackCount(this.user.id)
					  this.blackList(this.followFormInline)
					  this.$message({
						type: 'success',
						message: res.data.msg
					  })
				  }else{
				  	 this.$message.error(res.data.msg)
				  }
			  })
		  },
			deleteArticle(param){
				this.$confirm('删除之后将无法恢复，是否继续', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
						  deleteArticle(param).then(res => {
                console.log(param)
							if(res.data.code == 200){
							this.getMyArticle(this.formInline)
							 this.$message({
							   type: 'success',
							   message: '删除成功'
							 });
						 }else{
							 this.$message.error("删除失败")
						 }
						  })
					  }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });
				        });
			},
		  getNewMessage(param){
		    getNewMessage(param).then(response =>{
		      this.list = response.data
		      console.log(response.data)
		    })
		  },
		  handleClose(done) {
		    this.$confirm('确认关闭？')
		      .then(_ => {
		        done();
		      })
		      .catch(_ => {});
		  },
		  handleCommand2(command) {
		    this.users.withUserId = command
		    this.dialogVisible = true
		    //this.$forceUpdate();
		    this.hackReset  = false
		   // $nextTick 是在下次 DOM 更新完成后，在执行里面的函数，类似于回调
		    this.$nextTick(() => {
		      this.hackReset = true;
		    })
		    this.$emit("reloadNewMessage")
		  },
    },
	components: {
	  Pagination,
	  itemTalk,
	  Message
	},
    created() {
	this.user = JSON.parse(localStorage.getItem('user'))
  console.log(this.user)
	this.infoForm = JSON.parse(localStorage.getItem('user'))
	this.formInline.userId = this.user.id
	this.fansFormInline.userId = this.user.id
	this.blackFormInline.userId = this.user.id
	this.followFormInline.userId = this.user.id
	this.viewerFormInline.userId = this.user.id
	this.userId = this.user.id
	this.fansCount(this.formInline.userId)
	this.followCount(this.formInline.userId)
	this.blackCount(this.formInline.userId)
	this.praiseCount(this.formInline.userId)
	this.viewerCount(this.formInline.userId)
	this.getOrder(this.formInline.userId)
     this.getdata(this.formInline)
	 this.getAllLables()
	 this.users.userId = this.userId
	 this.getNewMessage(this.users.userId)
    }
  }
</script>

<style>
  .el-header, .el-footer {
      /* background-color: #B3C0D1; */
      color: #333;
      text-align: center;
      line-height: 60px;
    }

    .el-main {
      /* background-color: #E9EEF3; */
      color: #333;
      /* text-align: center; */
    }
  .left,.mid,.right{
    float: left;
  }
  .left{
    width: 20%;
    height: 500px;
  }
  .mid{
    width: 60%;
    height: 500px;
  }
  .right{
    height: 500px;
    width: 20%;

  }
  li{
    list-style-type: none;
	cursor: pointer;
	padding: 15px;
	margin-right: 5px;
  }
   .el-dropdown-link {
      cursor: pointer;
      color: #409EFF;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
	.tag{
		margin-left: 10px;
	}
	.right{
		text-align: center;
	}
	.time{
		float: right;
	}
	.avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	  }
	  .avatar-uploader .el-upload:hover {
	    border-color: #409EFF;
	  }
	  .avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
	  }
	  .avatar {
	    width: 178px;
	    height: 178px;
	    display: block;
	  }
	 .write{
		 float: right;
	 }
	 .msg{
		float: left;
	 }

	 .web__main{
	   width: 250px;
	 }
	 .web__main-item {
	   position: relative;
	   font-size: 0;
	   margin-bottom: 10px;
	   padding-left: 60px;
	   min-height: 68px;
	   text-align: left;
	 }

	 .web__main-user,
	 .web__main-text {
	   display: inline-block;
	   /* @css { * }display: inline;
	     @css { * }zoom: 1; */
	   vertical-align: top;
	   font-size: 14px;
	 }

	 .web__main-user {
	   position: absolute;
	   cursor: pointer;
	   left: 3px;
	 }

	 .web__main-user img {
	   width: 40px;
	   height: 40px;
	   border-radius: 100%;
	 }

	 .web__main-user cite {
	   position: absolute;
	   left: 60px;
	   top: -2px;
	   /* width: 500px; */
	   line-height: 24px;
	   font-size: 12px;
	   white-space: nowrap;
	   color: #999;
	   text-align: left;
	   font-style: normal;
	 }

	 .web__main-user cite i {
	   padding-left: 15px;
	   font-style: normal;
	 }

	 .web__main-text {
	   max-width: 75%;
	   position: relative;
	   line-height: 22px;
	   margin-top: 25px;
	   padding: 8px 15px;
	   background-color: #f3f3f3;
	   border-radius: 3px;
	   border: 1px solid #f0f0f0;
	   color: #000;
	   word-break: break-all;
	 }

	 .web__main-arrow {
	   top: 6px;
	   left: -8px;
	   position: absolute;
	   display: block;
	   width: 0;
	   height: 0;
	   border-color: transparent;
	   border-style: solid;
	   border-width: 8px;
	   border-left-width: 0;
	   border-right-color: #ebeef5;
	 }

	 .web__main-arrow::after {
	   content: " ";
	   top: -7px;
	   left: 1px;
	   position: absolute;
	   display: block;
	   width: 0;
	   height: 0;
	   border-color: transparent;
	   border-style: solid;
	   border-width: 7px;
	   border-left-width: 0;
	   border-right-color: #ebeef5;
	 }

	 .web__main-item--mine .web__main-text .web__main-arrow {
	   left: auto;
	   right: -5px;
	   border-color: transparent;
	   border-style: solid;
	   border-width: 8px;
	   border-right-width: 0;
	   border-left-color: #409eff;
	 }

	 .web__main-item--mine .web__main-text .web__main-arrow::after {
	   left: auto;
	   right: -2px;
	   border-color: transparent;
	   border-style: solid;
	   border-width: 7px;
	   border-right-width: 0;
	   border-left-color: #409eff;
	 }

	 .web__main-list {
	   margin: 10px 0;
	 }

	 .web__main-list li {
	   height: 30px;
	   color: #409eff;
	   line-height: 30px;
	 }

	 .web__main-item--mine {
	   text-align: right;
	   padding-left: 0;
	   padding-right: 60px;
	 }

	 .web__main-item--mine .web__main-user {
	   left: auto;
	   right: 3px;
	 }

	 .web__main-item--mine .web__main-user cite {
	   left: auto;
	   right: 60px;
	   text-align: right;
	 }

	 .web__main-item--mine .web__main-user cite i {
	   padding-left: 0;
	   padding-right: 15px;
	 }

	 .web__main-item--mine .web__main-text {
	   margin-left: 0;
	   text-align: left;
	   background-color: #409eff;
	   color: #fff;
	 }
	 .web__main-text img {
	   max-width: 200px;
	 }
	 .msg{
	 	text-align: center;
	 	width: 100%;
	 }

</style>
