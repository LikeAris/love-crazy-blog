<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
	  <el-form-item label="摘要" prop="abs">
	    <el-input v-model="ruleForm.abs"></el-input>
	  </el-form-item>
      <el-form-item label="内容" prop="text">
        <mavon-editor v-model="ruleForm.text"></mavon-editor>
      </el-form-item>
	  <el-form-item label="谁可以看见" prop="visible">
		   <el-radio-group v-model="ruleForm.visible">
	      <el-radio :label="0">所有人</el-radio>
	      <el-radio :label="1">仅粉丝</el-radio>
	  	  <el-radio :label="2">仅自己</el-radio>
		   </el-radio-group>
	  </el-form-item>
	  <el-form-item label="谁可以评论" prop="commentable">
		  <el-radio-group v-model="ruleForm.commentable">
	      <el-radio :label='0'>所有人</el-radio>
	      <el-radio :label='1'>仅粉丝</el-radio>
		   </el-radio-group>
	  </el-form-item>
	  <el-form-item label="文章标签" prop="allLables">
		   <el-checkbox-group v-model="ruleForm.lableIds">
	        <el-checkbox :key="lable.id" v-for="lable in allLables" :label="lable.id" name="lable">{{lable.name}}</el-checkbox>
			</el-checkbox-group>
	  </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即发表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入请求方法
import {
getArticleDetail,
writeArticle,
editArticle,
getAllLables
} from "../api/userMG.js"
 export default {
    data() {
      return {
		  user:{},
		  allLables:{},
		  ruleForm: {
		  userId:null,
		  articleId:"",
          title: "",
		  abs: "",
		  text: "",
		  visible: 0,
		  commentable: 0,
		  lableIds:[]
        },
        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
          ],
		  abs: [
		    { required: true, message: '请输入摘要', trigger: 'blur' },
		    { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
		  ],
          sex: [
            { required: true, message: '请选择权限', trigger: 'change' }
          ],
          text: [
            { required: true, message: '请填写文章内容', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
			if(this.ruleForm.articleId){
				editArticle(this.ruleForm).then(res => {
				  if (res.success == false) {
				    this.$message({
				      type: 'info',
				      message: res.msg
				    })
				  } else {
				    this.$message({
				      type: 'success',
				      message: res.msg
				    })
					this.$router.push("/allVisible")
				  }
				})
			}else{
				console.log(this.ruleForm)
				writeArticle(this.ruleForm).then(res => {
				  if (res.success == false) {
				    this.$message({
				      type: 'info',
				      message: res.msg
				    })
				  } else {
				    this.$message({
				      type: 'success',
				      message: res.msg
				    })
					this.$router.push("/allVisible")
				  }
				})
			}
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
	created() {
		this.user = JSON.parse(localStorage.getItem('user'))
		this.ruleForm.userId = this.user.id
		getAllLables().then(res => {
			this.allLables = res.data
		})
		const id = this.$route.params.articleId
		if(id){
			this.ruleForm.articleId = id
			getArticleDetail(this.ruleForm.articleId).then(res => {
			  if (res.success == false) {
			    this.$message({
			      type: 'info',
			      message: res.msg
			    })
			  } else {
			    this.ruleForm.title = res.data.data.title
				this.ruleForm.abs = res.data.data.file
				this.ruleForm.text = res.data.data.text
				this.ruleForm.visible = res.data.data.visible
				this.ruleForm.commentable = res.data.data.commentable
				for(var i = 0; i < res.data.data.lable.length; i++){
					this.ruleForm.lableIds.push(res.data.data.lable[i].id)
				}
			  }
			})
		}
	}
  }
</script>

<style>
</style>
