import Vue from 'vue';
import Router from 'vue-router';

// import views
const About = () => import("@/views/About.vue" /* webpackChunkName: "About" */);
const Create = () => import("@/views/Create.vue" /* webpackChunkName: "Create" */);
const Home = () => import("@/views/Home.vue" /* webpackChunkName: "Home" */);
const Mine = () => import("@/views/MyRecipes.vue" /* webpackChunkName: "Mine" */);
const Recipe = () => import("@/views/Recipe.vue" /* webpackChunkName: "Recipe" */);
//import FourOFour from '@/views/404.vue';

import store from '@/store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/mine',
      name: 'mine',
      component: Mine,
      beforeEnter: (to, from, next) => {
         if(!store.state.user.currentUser) { //get stored user state from vuex store
          router.push({ name: 'home' });
        } else {
          return next();
        }
      }
    },
    {
      path: '/create',
      name: 'create',
      component: Create,
      beforeEnter: (to, from, next) => {
         if(!store.state.user.currentUser) { //get stored user state from vuex store
          router.push({ name: 'home' });
        } else {
          return next();
        }
      }
    },
    {
      path: '/recipe/:id/:refId',
      name: 'recipe',
      component: Recipe
    },
    {
      path: '*',
      name: '404*',
      //component: FourOFour,
      beforeEnter: () => {
        return router.push({ name: 'home' }); //redirect invalid calls home for now
      }
    }
  ],
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
});

router.beforeEach((to, from, next) => {
  if(store.state.app.menuOpen) {
    store.dispatch('app/toggleMenu', false);
  }
  if(store.state.recipe.filterActive) {
    store.dispatch('recipe/clearFilter');
  }
  return next();
});

export default router;