<template>
  <nav class="container flex flex-row justify-start lg:justify-center items-center pt-4 lg:pt-8 pb-8 px-6 lg:px-4 mx-auto z-10">
    <button @click="menuClickHandler()" class="block lg:hidden mr-8" type="button" aria-label="Open Menu">
      <span class="gg-menu"></span>
    </button>
    <router-link :to="{name: 'home'}" v-blur class="focus:shadow-none">
      <img src="@/assets/logo.svg" v-blur class="hover:opacity-75 pb-3" alt="recept0r logo" width="160">
    </router-link>
    <div class="hidden lg:flex flex-row justify-center items-center flex-grow">
      <router-link
        :to="{name: 'home'}"
        v-blur
        class="block lg:inline-block font-bold text-lg text-blue-500 rounded-lg hover:bg-gray-500 px-4 py-2 mx-4"
      >Home</router-link>
      <router-link
        :to="{name: 'about'}"
        v-blur
        class="block lg:inline font-bold text-lg text-blue-500 rounded-lg hover:bg-gray-500 px-4 py-2 mx-4"
      >About</router-link>
      <router-link
        v-if="loggedIn"
        :to="{name: 'mine'}"
        v-blur
        class="block lg:inline font-bold text-lg text-blue-500 rounded-lg hover:bg-gray-500 px-4 py-2 mx-4"
      >My Recipes</router-link>
      <router-link
        v-if="loggedIn"
        :to="{name: 'create'}"
        v-blur
        class="block lg:inline font-bold text-lg text-blue-500 rounded-lg hover:bg-gray-500 px-4 py-2 mx-4"
      >&plus;Create</router-link>
    </div>
    <nav-auth class="hidden lg:block" />
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "navbar",
  components: {
    'NavAuth': () => import('@/components/NavAuth.vue')
  },
  computed: {
    ...mapGetters('app',['menuOpen']),
    ...mapGetters('user',['loggedIn']),
    currentPage() {
      return this.$route.name; //use this to mark the active link in the navigation
    }
  },
  methods: {
    ...mapActions("app", ["toggleMenu"]),
    menuClickHandler() {
      let newState = !this.menuOpen
      this.toggleMenu(newState);
    }
  }
};
</script>

<style lang="postcss">
  .gg-menu,
  .gg-menu::after,
  .gg-menu::before {
    @apply relative block bg-blue-500;
    width: 20px;
    height: 2px;
  }
  .gg-menu::after,
  .gg-menu::before {
    content: "";
    position: absolute;
    top: -6px
  }
  .gg-menu::after {
    top: 6px
  }
</style>