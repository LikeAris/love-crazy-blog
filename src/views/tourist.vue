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
        <el-header>首页</el-header>
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
			  <p><el-link type="primary" href="/login">登录</el-link></p>
		  </el-header>
		  <el-main>
			  <el-avatar icon="el-icon-user-solid"></el-avatar>
			  <p>游客用户</p>
		  </el-main>
		</el-container>
	</div>
  </div>
</template>

<script>
	// 导入请求方法
	import {
		touristVisible,
		getAllLables,
	} from "../api/userMG.js"
	import Pagination from '../components/Pagination.vue'
  export default{
    data(){
      return{
        lables:{},
        articleList:{},
        formInline: {
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
	    touristVisible(parameter).then(res => {
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
	    this.getdata(this.formInline)
	  },
	  handleQuery(){
		  this.getdata(this.formInline)
	  },
	  resetQuery(){
		  this.formInline.title = ''
		  this.formInline.username = ''
	  }
    },
	components: {
	  Pagination
	},
    created() {
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
</style>
