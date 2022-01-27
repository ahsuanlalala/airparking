<template>
  <v-app >
    <Navbar v-if="$route.name !== 'login' "/>
    <v-main >
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";

export default {
  name: "App",

  components: { Navbar },

  data: () => ({
    //
  }),
};
</script>

<style>
@font-face {
  font-family:SoukouMincho;
  src: url('./assets/SoukouMincho.ttf');
}
  *{
    font-family: SoukouMincho 微軟正黑體;
  }
</style>