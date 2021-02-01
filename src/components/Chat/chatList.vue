<template>
  <!--对话框-->
  <div class="wrapper" ref="scroller">
    <div class="scroller">
      <div class="web__main" ref="main">
        <div
          class="web__main-item"
          v-for="(item) in list"
          :key="JSON.stringify(item)"
          :class="{'web__main-item--mine':item.mine}"
        >
          <div class="web__main-user">
            <img :src="item.head" @click="bindClick('img',item)" />
            <cite @click="">
              {{item.username}}
              <i>{{dateFormat(item.time)}}</i>
            </cite>
          </div>
          <div class="web__main-text">
            <div class="web__main-arrow"></div>
            <itemTalk v-if="item.message" :text="item.message" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
	/* eslint-disable */
import Scroll from '../../utils/scroll.js'
import itemTalk from './itemTalk'
import {getMessageList,addMessage} from '../../api/chatMG.js'
import {dateFormat, timeAgo, formatData,Format} from "../../utils/webUtils"
export default {
  name: 'JwChat_list',
  components: { itemTalk },
  props:['userIds'],
  data(){
      return{
          list:{},
          currentMsg:'',
          }
  },
  methods: {
	getTalk(){
    let params = {}
    params.userId = this.userIds.userId
    params.withUserId = this.userIds.withUserId
		getMessageList(params).then(response => {
        console.log(response)
		    this.list = response.data
		  })
	},
  //滚动条
  createScroll () {
    const that = this
    const dom = this.$refs.scroller
    this.scroll = new Scroll(dom, {
      click: true,
      scrollbars: true,
      mouseWheel: true,
      preventDefault: false,
      interactiveScrollbars: true,
      hijackInternalLinks: true,
      // useTransform: false,
    });
    },
    scrollRefresh () {
      setTimeout(() => {
        this.scroll && this.scroll.refresh()
        this.scrollRefresh()
      }, 1000);
      return
    },
    //处理时间
    dateFormat(date){
      return dateFormat("YYYY-mm-dd HH:MM:SS",date)
    }
  },
  mounted () {
    this.createScroll()
    this.scrollRefresh()
  },
  created(){
	  this.getTalk()
  }
}
</script>
<style>
.iScrollVerticalScrollbar.iScrollLoneScrollbar {
  z-index: 1 !important;
}
.web__msg--img,
.web__msg--video,
.web__msg--file {
  position: relative;
  max-width: 250px;
  min-width: 200px;
  width: 100%;
  margin: 10px 0;
  border: 1px solid #eee;
  overflow: hidden;
  border-radius: 5px;
  cursor: pointer;
  display: block;
}
.web__msg--img[data-class="iconBox"] {
  max-width: 24px;
  min-width: unset;
  border: none;
  margin: 0;
  vertical-align: bottom;
  display: inline-block;
}
</style>
<style  scoped lang="scss">
.wrapper >>> .iScrollVerticalScrollbar.iScrollLoneScrollbar {
  z-index: 1 !important;
}
.downBtn {
  position: absolute;
  cursor: pointer;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  bottom: 2rem;
  // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  &::before {
    content: "V";
    position: absolute;
    background: rgba(204, 204, 204, 0.2);
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    border-radius: 50%;
    top: 60%;
    left: 50%;
    transform: translateX(-50%);
  }
  span {
    background: #409eff;
    padding: 0.1rem 0.5rem;
    font-size: 0.7rem;
    border-radius: 0.5rem;
    color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.wrapper {
  position: relative;
  width: 525px;
  height: 382px;
  overflow: hidden;

  /* Prevent native touch events on Windows */
  -ms-touch-action: none;

  /* Prevent the callout on tap-hold and text selection */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  /* Prevent text resize on orientation change, useful for web-apps */
  -webkit-text-size-adjust: none;
  -moz-text-size-adjust: none;
  -ms-text-size-adjust: none;
  -o-text-size-adjust: none;
  text-size-adjust: none;
}
.scroller {
  position: absolute;
  width: calc(100% - 1.5rem);
  padding: 0.5rem;
  padding-right: 1.5rem;

  /* Prevent elements to be highlighted on tap */
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  /* Put the scroller into the HW Compositing layer right from the start */
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
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
</style>
