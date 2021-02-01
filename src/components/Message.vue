<template>
  <div class="chatPage" :style="setStyle">
    <div class="taleBox" ref="scrollNode">
      <chatList
        :list="taleList"
        :userIds="userIds"
        @click="bindEvent"
        :config="chatListConfig"
        :key="reload"
      />
    </div>
    <div class="toolBox">
      <tools :tools="toolConfig" class="tools" @emoji="bindEmoji">
        <slot name="tools" slot="tools" />
      </tools>
      <EnterBox @submit="enter" @deleteHistory="deleteHistory" v-model="msg" />
    </div>
  </div>
</template>

<script>
import EnterBox from './chat/enterBox.vue'
import chatList from './chat/chatList.vue'
import tools from './chat/tools.vue'
import {addMessage,delMessage} from '../api/chatMG'
export default {
  name: "JwChat",
  components: { EnterBox, chatList, tools },
  props: {
    uids:{
      default:''
      },
    taleList: {
      type: Array,
      default: () => ([])
    },
    scroll: {
      type: Number,
      default: -1
    },
    height: {
      default: '500px'
    },
    width: {
      default: '550px'
    },
    value: {
      default: ''
    },
    scrollType: {
      default: ''
    },
    toolConfig: {
      type: Object,
      default: () => ({
        show: ['file', 'video', 'img'],
        callback: Function
      })
    },
    config: {}
  },
  data () {
    return {
      msg: '',
      scrollToButton: false,
      reload:'',
      userIds:{
        userId : 0,
        withUserId : 0
      }
    }
  },
  watch: {
    scroll (newVal) {
      if (typeof (newVal) === 'number') {
        this.setScroll(newVal)
      }
    },
    value: {
      handler () {
        this.msg = this.value;
      },
      immediate: true
    },
    msg: {
      handler () {
        this.$emit('input', this.msg);
      },
      immediate: true
    },
    scrollToButton (newVal) {
      if (newVal) {
        setTimeout(() => {
          this.scrollToButton = false
        }, 0);
      }
    }
  },
  computed: {
    setStyle () {
      let height = this.height
      let width = this.width
      if (`${height}`.match(/\d$/)) {
        height += 'px'
      }
      if (`${width}`.match(/\d$/)) {
        width += 'px'
      }
      const style = { height, width }
      return style
    },
    talkHeight () {
      let height = this.height
      if (`${height}`.match(/\d$/)) {
        height -= 140
      } else
        height = `calc(${height} - 140px)`
      return height
    },
    chatListConfig () {
      const { width, talkHeight: height, scrollToButton, scrollType, config: { historyConfig = {} } = {} } = this
      return { width, height, scrollToButton, scrollType, historyConfig }
    }
  },
  methods: {
    bindEvent (play) {
      this.$emit('clickTalk', play)
    },
    bindEmoji (emoji) {
      this.msg += emoji
    },
    enter (msg) {
      let params = {}
      params.adminId = this.userIds.userId
      params.withUserId = this.userIds.withUserId
      params.message = msg
      addMessage(params).then(response => {
          console.log(response)
        });
      this.reload = new Date().getTime()
    },
    deleteHistory(){
      let params = {}
      params.userId = this.userIds.userId
      params.withUserId = this.userIds.withUserId
      this.$confirm('确定要清空聊天记录吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMessage(params).then(response => {
          this.reload = new Date().getTime()
          if (response.code == 200) {
            this.$message({
              type: 'success',
              message: '聊天记录已清空'
            })
          }else{
            this.$message({
              type: 'error',
              message: '服务器错误，清空失败'
            })
          }
        });
      })
    },
    toButton () {
      this.scrollToButton = !this.scrollToButton
    }
  },
  created(){
    this.userIds.userId = this.uids.userId,
    this.userIds.withUserId = this.uids.withUserId
  }
}
</script>
<style lang="scss" scoped>
.chatPage {
  margin: 0 auto;
  position: relative;
  background: #fff;
  overflow: hidden;
}
.taleBox {
  height: calc(100% - 140px);
  min-height: 100px;
  overflow: hidden;
}
.toolBox {
  height: 140px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>
