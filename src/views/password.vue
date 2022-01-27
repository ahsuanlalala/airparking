<template>
  <div>
    <v-container>
      <v-row justify="center" class="mt-16 pt-16">
        <v-col md="6">
          <v-card elevation="2" height="500" style="opacity: 1">
            <h2 class="text-center pt-16 pb-14">變更密碼</h2>
            <v-form ref="changePwd">
              <v-container fluid>
                <v-row justify="center">
                  <v-col cols="12" sm="6" class="pa-0">
                    <v-text-field
                      :rules="rules"
                      label="輸入原密碼"
                      clearable
                      counter="20"
                      autocomplete="off"
                      v-model="exPwd"
                      type="password"
                      maxlength="20"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="12" sm="6" class="pa-0">
                    <v-text-field
                      label="輸入新密碼"
                      :rules="exRules"
                      clearable
                      counter="20"
                      autocomplete="off"
                      v-model="pwdRules"
                      type="password"
                      maxlength="20"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="12" sm="6" class="pa-0">
                    <v-text-field
                      label="再次輸入新密碼"
                      :rules="checkRules.concat(confirmRule)"
                      clearable
                      counter="20"
                      v-model="newPwd"
                      autocomplete="off"
                      type="password"
                      maxlength="20"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="12" sm="6" md="6" class="pt-4">
                    <v-btn
                      block
                      text
                      depressed
                      :loading="loading"
                      style="background-color: #cfd8dc"
                      @click="changePwd()"
                      >儲存變更</v-btn
                    >
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card>
        </v-col>
      </v-row>

      <v-snackbar
        v-model="snackbar"
        :color="this.text === '帳號密碼錯誤' ? 'red' : '#B39DDB'"
        class="ma-10"
        absolute
        right
        width="20"
        ><v-icon class="mb-1">{{ icon }}</v-icon
        ><span class="subtitle-1 pl-2"> {{ text }} </span>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import airport from "../service/airport";
export default {
  data() {
    return {
      text: "",
      exPwd: "",
      pwdRules: "",
      newPwd: "",
      loading: false,
      password: "password",
      snackbar: false,
      rules: [
        (v) => !!v || "必填",
        (v) => !v || /\w{6,20}/.test(v) || "請輸入6~20個字",
      ],
      exRules: [
        (v) => !!v || "必填",
        (v) => !v || /\w{6,20}/.test(v) || "請輸入6~20個字",
      ],
      checkRules: [(v) => !!v || "密碼不相符"],
    };
  },
  computed: {
    confirmRule() {
      return () => this.pwdRules === this.newPwd || "密碼不相符";
    },
    icon() {
      return this.text === "帳號密碼錯誤"
        ? "mdi-alert-circle-outline"
        : "mdi-check-circle-outline";
    },
  },

  methods: {
    resetFForm() {
      this.$refs.changePwd.reset();
    },

    async changePwd() {
      this.loading = true;
      const id = localStorage.getItem("id");
      console.log(id);
      const PwdData = (
        await airport.password(id, {
          userPwd: this.exPwd,
          newUserPwd: this.newPwd,
        })
      ).data;
      this.loading = false;
      this.snackbar = true;
      this.text = PwdData.message;
      this.resetFForm();
    },
  },
};
</script>