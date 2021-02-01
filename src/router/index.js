import Vue from 'vue'
import Router from 'vue-router'
import tourist from '../views/tourist.vue'
import login from '../views/login.vue'
import editArticle from '../views/editArticle.vue'
import allVisible from '../views/allVisible.vue'
import articleDetail from '../views/articleDetail.vue'
import othersHome from '../views/othersHome.vue'
import Comment from '../components/Comment.vue'
import NewMessage from '../components/NewMessage.vue'
Vue.use(Router)

export default new Router({
	mode: 'history',
  routes: [
    {
      path: '/',
      name: 'tourist',
      component: tourist
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/editArticle',
      name: 'writeArticle',
      component: editArticle
    },
	{
	  path: '/editArticle/:articleId',
	  name: 'editArticle',
	  component: editArticle
	},
    {
      path: '/articleDetail:articleId',
      name: 'articleDetail',
      component: articleDetail
    },
    {
      path: '/allVisible',
      name: 'allVisible',
      component: allVisible
    },
	{
		path: '/othersHome/:adminId',
		name: 'othersHome',
		component: othersHome
	},
	{
		path: '/Comment',
		name: 'Comment',
		component: Comment
	},
	{
		path: '/NewMessage',
		name: 'NewMessage',
		component: NewMessage
	}
  ]
})
