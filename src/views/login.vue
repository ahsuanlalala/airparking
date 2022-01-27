<template>
  <div class="abcde">
    <v-container>
      <v-row justify="center" class="mt-16 pt-16">
        <v-col md="6">
          <v-card elevation="2" height="500" style="opacity: 1">
            <h2 class="text-center pt-16 pb-16">CHINA AIR</h2>
            <v-form>
              <v-container>
                <v-row justify="center">
                  <v-col cols="12" sm="6" class="pa-0">
                    <v-text-field
                      prepend-inner-icon="mdi-baby-face-outline"
                      v-model="acc"
                      label="使用者帳號"
                      autocomplete="off"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <v-container fluid>
                <v-row justify="center">
                  <v-col cols="12" sm="6" class="pa-0">
                    <v-text-field
                      prepend-inner-icon="mdi-lock"
                      v-model="pwd"
                      label="使用者密碼"
                      autocomplete="off"
                      :type="password"
                      @keydown.enter="getUser()"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="12" sm="6" md="6" class="pa-2">
                    <v-btn
                      block
                      text
                      depressed
                      style="background-color: #cfd8dc"
                      @click="getUser()"
                      :loading="loading"
                      >登入</v-btn
                    >
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="12" sm="5" md="3">
          <v-alert color="red" type="error" class="text-center" v-model="waring"
            >帳號密碼錯誤</v-alert
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import airport from "../service/airport";
export default {
  data() {
    return {
      acc: "",
      pwd: "",
      loading: false,
      show: false,
      waring: false,
      password: "password",
    };
  },

  methods: {
    async getUser() {
      this.loading = true;
      const result = await airport.login({
        userAcc: this.acc,
        userPwd: this.pwd,
      });
      if (!result.data.error) {
        this.loading = false;
        const Acc = this.acc;
        localStorage.setItem("userAcc", Acc);
        const Pwd = this.pwd;
        localStorage.setItem("userPwd", Pwd);
        const id = result.data.id;
        localStorage.setItem("id", id);
        const permi = result.data.permi;
        localStorage.setItem("permission", permi);
        const userName = result.data.name;
        localStorage.setItem("userName", userName);
        this.$store.commit("setUserName", userName);
        console.log(result.data);
        this.$router.push({ path: "/" }); //記錄完後導到主頁
      } else {
        this.waring = true;
        this.loading = false;
      }
    },
  },
};
</script>

<style>
.abcde {
  background-size: 100% 100%;
  background-position: center;
  background-image: url("../assets/HAHA.png");
  height: 100vh;
}
</style>