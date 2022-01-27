<template>
  <v-navigation-drawer app width="230" class="blue-grey lighten-3" permanent>
    <v-row class="text-center">
      <v-col class="mt-5">
        <v-avatar size="70">
          <v-img
            src="https://upload.wikimedia.org/wikipedia/commons/6/68/China_Airlines_Lineup_TPE.jpg"
          ></v-img>
        </v-avatar>
        <h3 class="my-3 font-weight-bold" style="color: #1a237e">
          歡迎✨{{ userName }}🛫
        </h3>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-list class="pt-5">
      <v-list-item-group>
        <div v-for="(link, j) in links" :key="j">
          <!-- 無子項目 -->
          <v-list-item v-if="link.sub.length == 0" :to="link.route">
            <v-list-item-icon>
              <v-icon class="white--text ml-4">{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="white--text title">{{
              link.text
            }}</v-list-item-title>
          </v-list-item>

          <!-- 子項目 -->
          <v-list-group
            v-else
            class="text-center white--text"
          >
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon class="white--text ml-4">{{ link.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="white--text title">{{
                link.text
              }}</v-list-item-title>
            </template>

            <v-list-item
              v-for="(title, i) in link.sub"
              :key="i"
              class=""
              :to="title.route"
            >
              <v-list-item-title class="white--text title">{{
                title.text
              }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </div>
      </v-list-item-group>
    </v-list>

    <template v-slot:append>
      <div class="pl-14 pb-10">
        <v-btn text @click="logout()" class="body-1">
          <v-icon>mdi-logout-variant</v-icon>登出系統
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>


<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      permission: localStorage.getItem("permission"),
      links: [
        {
          icon: "mdi-shield-home-outline",
          text: "月租管理",
          sub: [],
          route: "/",
        },
        {
          icon: "mdi-shield-lock-outline",
          text: "密碼變更",
          sub: [],
          route: "/password",
        },
        {
          icon: "mdi-file-chart",
          text: "報表",
          sub: [{ text: "b報表", route: "/report/" }],
          route: "/report",
        },
      ],
    };
  },

  computed: {
    ...mapGetters(["userName"]),
  },

  mounted() {
    this.permi();
  },

  methods: {
    ...mapMutations(["clear"]),
    permi() {
      if (this.permission !== "1") {
        this.links.splice(1, 0, {
          icon: "mdi-shield-account-outline",
          text: "帳號管理",
          sub: [],
          route: "/member",
        });
      }
    },
    logout() {
      this.clear();
      localStorage.clear();
      this.$router.push("login");
    },
  },
};
</script>