<template>
  <div class="msg">
<el-row class="block-col-2">
  <el-col :span="12">
    <el-dropdown trigger="click" @command="handleCommand">
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
</template>

<script>
import itemTalk from './Chat/itemTalk'
import {getNewMessage} from '../api/chatMG'
import Message from './Message.vue'
export default {
  name:'NewMessage',
  components: { itemTalk,Message },
  props:['userId'],
  data () {
    return {
      list:[],
      users:{
        userId:0,
        withUserId:0,
      },
      dialogVisible: false,
      hackReset:false,
    }
  },
  methods: {
    handleCommand(command) {
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

    }
  },
  created() {
	this.users.userId = this.userId
    this.getNewMessage(this.users.userId)
  },
}
</script>

<style>
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
</style>
