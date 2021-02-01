<template>
    <div class="main">
        <!--发表评论-->
        <div v-clickoutside="hideReplyBtn" @click="inputFocus" class="my-reply">
            <el-avatar class="header-img" :size="40" :src="userHead?userHead: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'"></el-avatar>
            <div class="reply-info" >
                <div
                tabindex="0"
                contenteditable="true"
                id="replyInput"
                spellcheck="false"
                placeholder="既然来了,那就留下点什么吧..."
                class="reply-input"
                @focus="showReplyBtn"
                @input="onDivInput($event)"
                >
                </div>
            </div>
            <div class="reply-btn-box" v-show="btnShow">
                <el-button class="reply-btn" size="medium" @click="sendComment" type="primary">发表评论</el-button>
            </div>
        </div>
        <!--获取评论列表-->
        <div v-for="(item,i) in comments" :key="i" class="author-title reply-father">
            <el-avatar class="header-img" :size="40" :src="item.fromUserHead ? item.fromUserHead : 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'"></el-avatar>
            <div class="author-info">
                <span class="author-name">{{item.fromUsername}}</span>
                <span v-show="item.adminComment == 1 ? true:false">(作者)</span>
                <span class="author-time">{{timeAgo(dateFormat(item.time))}}</span>
            </div>
            <div class="icon-btn">
                <span @click="showReplyInput(i,item)"><i class="iconfont el-icon-s-comment"></i></span>
            </div>
            <div class="talk-box">
                <p>
                    <span class="reply">{{item.comment}}</span>
                </p>
                <div  v-show="item.inputShow" class="my-reply my-comment-reply">
                      <el-avatar class="header-img" :size="40" :src="myHeader"></el-avatar>
                      <div class="reply-info" >
                          <div tabindex="0" contenteditable="true" spellcheck="false" placeholder="输入评论..."   @input="onDivInput($event)"  class="reply-input reply-comment-input"></div>
                      </div>
                      <div class=" reply-btn-box">
                          <el-button class="reply-btn" size="medium" @click="cancelSend(item)" >取消</el-button>
                          <el-button class="reply-btn" size="medium" @click="sendCommentReply(item)" type="primary">发表评论</el-button>
                      </div>
                </div>
            </div>
            <div class="reply-box">
                <div v-for="(reply,j) in item.replyComments" :key="j" class="author-title">
                    <el-avatar class="header-img" :size="40" :src="reply.fromUserHead?reply.fromUserHead:'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'"></el-avatar>
                    <div class="author-info">
                        <span class="author-name">{{reply.fromUsername}}</span>
                        <span  v-show="reply.adminComment == 1 ? true:false">(作者)</span>
                        <span class="author-time">{{timeAgo(dateFormat(reply.time))}}</span>
                    </div>
                    <div class="icon-btn">
                        <span @click="showReplyInput(j,reply)"><i class="iconfont el-icon-s-comment"></i></span>
                    </div>
                    <div class="talk-box">
                        <p>
                            <span>回复</span>
                            <span class="author-name" style="font-weight: bold;"> {{reply.toUsername}}:</span>
                            <span class="reply">{{reply.comment}}</span>
                        </p>
                         <div  v-show="reply.inputShow" class="my-reply my-comment-reply">
                               <el-avatar class="header-img" :size="40" :src="myHeader"></el-avatar>
                               <div class="reply-info" >
                                   <div tabindex="0" contenteditable="true" spellcheck="false" placeholder="输入评论..."   @input="onDivInput($event)"  class="reply-input reply-comment-input"></div>
                               </div>
                               <div class=" reply-btn-box">
                                 <el-button class="reply-btn" size="medium" @click="cancelSend(item)" >取消</el-button>
                                   <el-button class="reply-btn" size="medium" @click="sendCommentReply(reply)" type="primary">发表评论</el-button>
                               </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getCommentList,addComment} from '../api/commentMG';
import {dateFormat, timeAgo, formatData,Format} from "../utils/webUtils";
const clickoutside = {
    // 初始化指令
    bind(el, binding, vnode) {
    function documentHandler(e) {
    // 这里判断点击的元素是否是本身，是本身，则返回
        if (el.contains(e.target)) {
            return false;
        }
    // 判断指令中是否绑定了函数
        if (binding.expression) {
            // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
            binding.value(e);
        }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.vueClickOutside = documentHandler;
    document.addEventListener('click', documentHandler);
    },
    update() {},
    unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener('click', el.vueClickOutside);
    delete el.vueClickOutside;
  },
};
export default {
    name:'ArticleComment',
	props:["ids"],
    data(){
        return{
            btnShow:false,
            index:'0',
            myHeader:'https://ae01.alicdn.com/kf/Hd60a3f7c06fd47ae85624badd32ce54dv.jpg',
            inputShow:false,
            comments:[],
            replyComments:[],
            userHead:'',
            toId:-1
            }
    },
    directives: {clickoutside},
    methods: {
      getComments(params){
        getCommentList(params).then(response => {
            this.comments = response.data;
            for( var i=0;i<this.comments.length;i++){
              this.comments[i].inputShow = false;
                for( var j=0;j<this.comments[i].replyComments.length;j++){
                  this.comments[i].replyComments[j].inputShow = false
                }
            }
            console.log(this.comments)
          })
        },
        inputFocus(){
            var replyInput = document.getElementById('replyInput');
            replyInput.style.padding= "8px 8px"
            replyInput.style.border ="2px solid blue"
            replyInput.focus()
        },
        showReplyBtn(){
            this.btnShow = true
        },
        hideReplyBtn(){
            this.btnShow = false
            replyInput.style.padding= "10px"
            replyInput.style.border ="none"
        },
        showReplyInput(i,o){
            this.$set(o,o.inputShow,true);
            o.inputShow = true;
        },
        cancelSend(o){
          this.$set(o,o.inputShow,false)
          o.inputShow=false
          this.getComments(this.articleId);
        },
        sendComment(){
            if(!this.replyComment){
                 this.$message({
                    showClose: true,
                    type:'warning',
                    message:'评论不能为空'
                })
            }else{
                let params = {};
                params.articleId = this.ids.articleId;
                params.commentUserId = this.ids.viewerId;
                params.comment = this.replyComment;
                if (this.ids.viewerId == this.ids.authorId) {
                  params.adminComment = 1;
                } else{
                  params.adminComment = 0;
                }
                addComment(params).then(response => {
                    if (response.code == 200) {
                      this.$message({
                        title: '成功',
                        message: "发表成功~",
                        type: 'success',
                        offset: 100
                      });
                    } else {
                      this.$message.error({
                        title: '错误',
                        message: response.msg,
                        offset: 100
                      });
                    }
                    this.getComments(this.ids.articleId);
                  });
            }
        },
        sendCommentReply(o){
            if(!this.replyComment){
                 this.$message({
                    showClose: true,
                    type:'warning',
                    message:'评论不能为空'
                })
            }else{
                let params = {};
                params.articleId = this.ids.articleId;
                params.commentUserId = this.ids.viewerId;
                params.comment = this.replyComment;
                params.toCommentId = o.id;
                if (this.ids.viewerId == this.ids.authorId) {
                  params.adminComment = 1;
                } else{
                  params.adminComment = 0;
                }
                addComment(params).then(response => {
                  console.log(response)
                    if (response.code == 200) {
					this.$message({
						  type: 'success',
						  message: res.data.msg
						})
					}else{
						this.$message.error("评论失败")
					}
                    this.getComments(this.ids.articleId);
                  });
               this.$set(o,o.inputShow,false)
            }
        },
        onDivInput: function(e) {
            this.replyComment = e.target.innerHTML;
        },
        //处理时间格式
        /**
         * dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
         * @param dateTimeStamp
         * @returns {string}
         */
        Format() {
          return Format()
         },
        dateFormat(date) {
          return dateFormat("YYYY-mm-dd HH:MM:SS",date)
          },
        timeAgo(dateTimeStamp) {
          return timeAgo(dateTimeStamp)
        }
    },
	created() {
	  this.getComments(this.ids.articleId)
	},
}
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="stylus" scoped>
  .main
    width 75%
    margin auto
    background-color antiquewhite
    .my-reply
     padding 10px
     width 100%

    .header-img
        display inline-block
        float left
        vertical-align top


    .reply-info
        display inline-block
        margin-left 5px
        width 90%
        @media screen and (max-width:1200px) {
            width 80%
        }
        .reply-input
            min-height 20px
            line-height 22px
            padding 10px 10px
            color #ccc
            background-color #fff
            border-radius 5px
            &:empty:before
                content attr(placeholder)
            &:focus:before
                content none
            &:focus
                padding 8px 8px
                border 2px solid blue
                box-shadow none
                outline none
    .reply-btn-box
        height 25px
        margin 10px 20px
        .reply-btn
            position relative
            float right
            margin-right 15px
.my-comment-reply

    .reply-input
        width flex
.author-title:not(:last-child)
    border-bottom: 1px solid rgba(178,186,194,.3)
.author-title
    padding 10px
    .header-img
        display inline-block
        vertical-align top
    .author-info
        display inline-block
        margin-left 5px
        width 60%
        .author-name
            color #000
            font-size 20px
            font-weight bold
        .author-time
            margin-left:50px
            font-size 14px
     .commentBtn
        float right
        font-size 20px
        padding 0px
    .icon-btn
        width 30%
        padding 0 !important
        float right
        @media screen and (max-width : 1200px){
            width 20%
            padding 7px
        }
        >span
            cursor pointer
        .iconfont
            margin 0 5px
    .talk-box
        margin-left 50px
        margin-top 10px
        margin-bottom 10px
        >p
           margin 0
        .reply
            font-size 16px
            color #000
    .reply-box
        margin 20px 0 0 50px
        background-color beige
</style>
