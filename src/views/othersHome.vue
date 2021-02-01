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
        <el-header>他的文章</el-header>
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
			  <p>欢迎来访</p>
		  </el-header>
		  <el-main>
			 <div>
			   <el-avatar icon="el-icon-user-solid" :src="admin.head"></el-avatar>
			  <p>{{admin.motto}}</p>
				<p>
				  {{admin.username}}
			  </p>
			 </div>
			<div>
				  <span>粉丝：<el-button type="text" @click="fansList(fansFormInline)">{{fans}}</el-button></span>
				  <span>关注：<el-button type="text" @click="followList(followFormInline)">{{follow}}</el-button></span>
				  <span>获赞：<el-button type="text" >{{praise}}</el-button></span><br />
				  <span>访问：<el-button type="text" >{{viewer}}</el-button></span>
				  <span>排名：<el-button type="text" @click="orderList">{{order}}</el-button></span>
				  <p>
					  <el-button v-show=attention icon="el-icon-star-off" @click="addAttention">关注</el-button>
					  <el-button v-show=delAttention icon="el-icon-star-on" @click="deleteAttention">取消关注</el-button>
					  <el-button v-show=black icon="el-icon-circle-plus" @click="addBlack">拉黑</el-button>
					   <el-button v-show=delBlack icon="el-icon-remove" @click="deleteBlack">取消拉黑</el-button>
             <!--私信-->
             <p class="message">
               <el-col :span="12">
                  <div class="msg">
               		<div class="msg">
               		<el-row class="block-col-2">
               		  <el-col :span="12">
               		   <el-button icon="el-icon-message" @click="handleCommand2" >私信</el-button>
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
             </p>


				  </p>
			 </div>
		  </el-main>
		</el-container>
	</div>
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
		    </el-table>
			<Pagination v-bind:child-msg="followpageparm" @callFather="followcallFather"></Pagination>
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
  </div>
</template>

<script>
	// 导入请求方法
	import {
		touristVisible,
		getAllLables,
		showAdminArticle,
		fansCount,
		followCount,
		praiseCount,
		viewerCount,
		getOrder,
		getFansList,
		getAttentionList,
		getOrderList,
		addViewer,
		getUserInfo,
		isBlack,
		isAttention,
		addBlack,
		deleteBlack,
		addAttention,
		deleteAttention
	} from "../api/userMG.js"
	import Pagination from '../components/Pagination.vue'
  import itemTalk from '../components/Chat/itemTalk'
  import {getNewMessage} from '../api/chatMG'
  import Message from '../components/Message.vue'
  export default{
	name:"othersHome",
    data(){
      return{
		  fansListVisible:false,
		  followListVisible:false,
		  orderListVisible:false,
		  black:false,
		  delBlack:false,
		  attention:false,
		  delAttention:false,
      dialogVisible:false,
      hackReset:false,
		  fans:0,
		  follow:0,
		  praise:0,
		  viewer:0,
		  order:"无",
		  fansL:{},
		  followL:{},
		  orderL:{},
		 admin:{},
        lables:{},
        articleList:{},
        formInline: {
		  adminId:"",
		  viewerId:"",
          page: 1,
          limit: 5,
		  title: "",
		  username: "",
		  lableId: ""
        },
		pageparm: {
		  currentPage: 1,
		  pageSize: 5,
		  total: 0
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
    users:{
      userId:0,
      withUserId:0,
    }
      }
    },
    methods:{
      lableClick(lableId){
        this.formInline.lableId = lableId;
		this.getdata(this.formInline)
      },
	  getdata(parameter) {
	    this.loading = true
	    showAdminArticle(parameter).then(res => {
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
	  addBlack(){
		  this.$confirm('拉黑之后将取消你们所有的粉丝关注关系，是否继续', '提示', {
		            confirmButtonText: '确定',
		            cancelButtonText: '取消',
		            type: 'warning'
		          }).then(() => {
					  addBlack(this.formInline.viewerId, this.formInline.adminId).then(res => {
						if(res.data.code == 200){
						this.attention = true
						this.delAttention = false
						this.fansCount(this.formInline.adminId)
						this.getdata(this.formInline)
						 this.black = false
						 this.delBlack = true
						 this.$message({
						   type: 'success',
						   message: '拉黑成功'
						 });
					 }else{
						 this.$message.error("拉黑失败")
					 }
					  })
				  }).catch(() => {
		            this.$message({
		              type: 'info',
		              message: '已取消拉黑'
		            });
		          });
	  },
	  deleteBlack(){
		  deleteBlack(this.formInline.viewerId, this.formInline.adminId).then(res => {
				  if(res.data.code == 200){
					  this.black = true
					  this.delBlack = false
					 this.$message({
					   type: 'success',
					   message: res.data.msg
					 });
				  }else{
					this.$message.error(res.data.msg)
				  }
		  })
	  },
	  addAttention(){
		  if(this.delBlack == true){
			  this.$message.error("请先解除黑名单关系")
		  }else{
			addAttention(this.formInline.viewerId, this.formInline.adminId).then(res => {
			  if(res.data.code == 200){
				  this.attention = false
				  this.delAttention = true
				  this.fansCount(this.formInline.adminId)
				  this.getdata(this.formInline)
				  this.$message({
					type: 'success',
					message: res.data.msg
				  });
			  }else{
				  this.$message.error(res.data.msg)
			  }
			  })
		  }
	  },
	  deleteAttention(){
		 deleteAttention(this.formInline.adminId, this.formInline.viewerId).then(res => {
			 if(res.data.code == 200){
			  this.attention = true
			  this.delAttention = false
			  this.fansCount(this.formInline.adminId)
				this.getdata(this.formInline)
			  this.$message({
				type: 'success',
				message: res.data.msg
			  });
			 }else{
			 	this.$message.error(res.data.msg)
			 }
			 })
	  },
	  // 分页插件事件
	  callFather(parm) {
	    this.formInline.page = parm.currentPage
	    this.formInline.limit = parm.pageSize
	    this.getdata(this.formInline)
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
	  handleQuery(){
		  this.getdata(this.formInline)
	  },
	  resetQuery(){
		  this.formInline.title = ''
		  this.formInline.username = ''
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
    handleCommand2() {
      this.users.withUserId = this.formInline.adminId
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
     Message,
     itemTalk
	},
	created() {
		const viewer = JSON.parse(localStorage.getItem('user'))
		this.formInline.viewerId = viewer.id
		this.formInline.adminId = this.$route.params.adminId
		this.fansFormInline.userId = this.$route.params.adminId
		 this.followFormInline.userId = this.$route.params.adminId
		addViewer(this.formInline.adminId, this.formInline.viewerId)
		getUserInfo(this.formInline.adminId).then(res => {
			this.admin = res.data.data
      this.users.withUserId = this.formInline.adminId
      this.users.userId = viewer.id
		})
	},
    mounted() {
	isBlack(this.formInline.viewerId, this.formInline.adminId).then(res => {
			if(res.data.data > 0){
				this.delBlack = true
			}else{
				this.black = true
			}
	})
	isAttention(this.formInline.viewerId, this.formInline.adminId).then(res => {
		if(res.data.data > 0){
			this.delAttention = true
		}else{
			this.attention = true
		}
	})
	 this.fansCount(this.formInline.adminId)
	 this.followCount(this.formInline.adminId)
	 this.praiseCount(this.formInline.adminId)
	 this.viewerCount(this.formInline.adminId)
	 this.getOrder(this.formInline.adminId)
     this.getdata(this.formInline)
	 this.getAllLables()

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
  .tag{
  	margin-left: 10px;
  }
  .right{
  	text-align: center;
  }
  .time{
  	float: right;
  }

  .el-dropdown-link {
      cursor: pointer;
      color: #409EFF;
    margin: auto;
    text-align: center;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
    .demonstration {
      display: block;
      color: #8492a6;
      font-size: 14px;
      margin-bottom: 20px;
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
  .message{
    text-align: center;
    margin: auto;
    padding-left: 70px;
  }
</style>
