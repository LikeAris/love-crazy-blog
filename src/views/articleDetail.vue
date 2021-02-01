<template>
  <div>
	  <div class="info">
		  <el-avatar icon="el-icon-user-solid" :src="articleDetail.head"></el-avatar>
		  <span><el-link v-show=linkDisabled type="primary" disabled>{{articleDetail.username}}</el-link></span>
		  <span><el-link v-show=linkAble type="primary" @click="visit">{{articleDetail.username}}</el-link></span>
	  </div>
    <div class="blog">
		<h2>{{articleDetail.title}}</h2>
		 <el-divider></el-divider>
		<div v-html="articleDetail.text"></div>
	</div>
	<div class="operator">
		<el-button v-show=praise icon="el-icon-circle-check" @click="addPra">点赞</el-button>
		 <el-button v-show=delPraise icon="el-icon-success" @click="delPra">取消赞</el-button>
		 <el-button v-show=collection icon="el-icon-star-off" @click="addCol">收藏</el-button>
		 <el-button v-show=delCollection icon="el-icon-star-on" @click="delCol">取消收藏</el-button>
	</div>
	<Comment :ids="ids" ref="select"></Comment>
  </div>
</template>

<script>
import{
	getArticleDetail,
	isCollection,
	isPraise,
	addCollection,
	deleteCollection,
	praiseArticle,
	delPraise,
	increasePraise,
	decreasePraise,
	increaseViews
}from '../api/userMG.js'
import Comment from '../components/Comment.vue'
export default{
	name:'articleDetail',
	components:{Comment},
	data(){
		return{
			linkDisabled:false,
			linkAble:false,
			articleId:0,
			praise:false,
			delPraise:false,
			collection:false,
			delCollection:false,
			viewer:{
				id:""
			},
			articleDetail:{
				title:"",
				text:"",
				userId:"",
				head:"",
				username:""
			},
			ids:{
				articleId:0,
				authorId:0,
				viewerId:0
			}
		}
	},
	methods:{
		isCol(){
			isCollection(this.viewer.id, this.articleId).then(res => {
				if(res.data.data > 0){
					this.delCollection = true
					this.collection = false
				}else{
					this.collection = true
					this.delCollection = false
				}
			})
		},
		isPra(){
			isPraise(this.viewer.id, this.articleId).then(res => {
				if(res.data.data > 0){
					this.delPraise = true
					this.praise = false
				}else{
					this.praise = true
					this.delPraise = false
				}
			})
		},
		addCol(){
				addCollection(this.viewer.id, this.articleId).then(res => {
					if(res.data.data > 0){
						this.$message({
						  type: 'success',
						  message: res.data.msg
						})
					}else{
						this.$message.error("操作失败")
					}
					this.isCol()
				})
		},
		delCol(){
				deleteCollection(this.viewer.id, this.articleId).then(res => {
					if(res.data.data > 0){
						this.$message({
						  type: 'success',
						  message: res.data.msg
						})
					}else{
						this.$message.error("操作失败")
					}
					this.isCol()
				})
		},
		addPra(){
			praiseArticle(this.viewer.id, this.articleId).then(res => {
				if(res.data.data > 0){
					increasePraise(this.articleId)
					this.$message({
					  type: 'success',
					  message: res.data.msg
					})
				}else{
					this.$message.error("操作失败")
				}
				this.isPra()
			})
		},
		delPra(){
			delPraise(this.viewer.id, this.articleId).then(res => {
				if(res.data.data > 0){
					decreasePraise(this.articleId)
					this.$message({
					  type: 'success',
					  message: res.data.msg
					})
				}else{
					this.$message.error("操作失败")
				}
				this.isPra()
			})
		},
		visit(){
			if(this.viewer.id == this.articleDetail.userId){
				this.$message({
				  type: 'info',
				  message: "这是你自己"
				})
			}else{
				const {href} = this.$router.resolve({name: "othersHome", params:{adminId: this.articleDetail.userId}});
				window.open(href, '_blank')
			}
		},
		handleClick() {
		    this.$refs.select.getComments(this.articleId);
		},
	},
	created() {
		this.articleId = this.$route.params.articleId
		increaseViews(this.articleId)
		if(localStorage.getItem('user') != null){
			this.viewer.id = JSON.parse(localStorage.getItem('user')).id
			this.ids.viewerId = JSON.parse(localStorage.getItem('user')).id
			this.linkAble = true
			this.isCol()
			this.isPra()
		}else{
			this.linkDisabled = true
		}
		getArticleDetail(this.articleId).then(res => {
		    this.articleDetail.title = res.data.data.title
			this.articleDetail.text = res.data.data.text
			this.articleDetail.head = res.data.data.head
			this.articleDetail.username = res.data.data.username
			this.articleDetail.userId = res.data.data.userId
			this.ids.authorId = res.data.data.userId
			this.ids.articleId = this.articleId
			this.handleClick()
		})
		
	}
}
</script>

<style>
	.blog{
		 box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		 width: 75%;
		 min-height: 500px;
		 margin: auto;
	}
	.info{
		margin: auto;
		margin-top: 30px;
		width: 75%;
	}
	h2{
		text-align: center;
	}
	.operator{
		text-align: center;
		margin-top: 20px;
	}
</style>
