<template>
  <div>
    <v-container
      fluid
      class="d-flex justify-center align-center pt-5"
      style="height: 100vh"
    >
      <v-card width="1400">
        <v-btn
          absolute
          right
          class="ma-6 white--text"
          text
          depressed
          style="background-color: #b0bec5"
          @click="newReset()"
          >新增1</v-btn
        >
        <v-data-table
          :loading="dataLoad"
          :headers="headers"
          :items="memberTable"
          :items-per-page="10"
          class="elevation-0 pa-16"
          :footer-props="{ 'items-per-page-text': '每頁資料數' }"
          no-data-text="尚無資料"
          loading-text="加載中"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <!-- 編輯按鈕 -->
            <v-btn @click="updateMember(item)" class="mr-2" outlined small
              >修改</v-btn
            >
            <!-- 刪除按鈕 -->
            <v-btn @click="deleteMember(item)" outlined small>刪除</v-btn>
          </template>
          <template v-slot:[`item.userName`]="memberTable">
            <v-edit-dialog :return-value.sync="memberTable.item.userName">
              {{ memberTable.item.userName }}
              <template v-slot:input>
                <v-text-field
                  v-model="memberTable.item.userName"
                  single-line
                  counter="20"
                  maxlength="20"
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:[`item.userAcc`]="memberTable">
            <v-edit-dialog :return-value.sync="memberTable.item.userAcc">
              {{ memberTable.item.userAcc }}
              <template v-slot:input>
                <v-text-field
                  v-model="memberTable.item.userAcc"
                  single-line
                  counter="20"
                  maxlength="20"
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <div></div>
          <template v-slot:[`item.permission`]="memberTable">
            <v-select
              v-model="memberTable.item.permission"
              single-line
              :items="people"
              :disabled="permission !== '3' ? true : false"
            ></v-select>
          </template>
        </v-data-table>
        <v-row class="pb-6 pl-8"
          ><span style="color: red"
            >*點擊文字可變更，輸入完後ENTER再按修改*</span
          ></v-row
        >
      </v-card>
    </v-container>
    <template>
      <v-dialog v-model="dialog" max-width="400">
        <v-card>
          <v-card-title style="background-color: #cfd8dc">
            <span class="display-1">新增使用者</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="newMem">
              <v-row>
                <v-col class="pb-0 mt-4">
                  <v-text-field
                    label="使用者名稱"
                    outlined
                    dense
                    autocomplete="off"
                    :rules="nameRule"
                    v-model="item.userName"
                    counter="20"
                    maxlength="20"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pb-0">
                  <v-text-field
                    label="使用者帳號"
                    outlined
                    required
                    dense
                    autocomplete="off"
                    v-model="item.userAcc"
                    :rules="rules"
                    counter="20"
                    maxlength="20"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pb-0">
                  <v-text-field
                    label="使用者密碼"
                    required
                    outlined
                    dense
                    autocomplete="off"
                    v-model="item.userPwd"
                    counter="20"
                    :rules="pwdRules"
                    :type="password"
                    maxlength="20"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pb-0">
                  <v-text-field
                    required
                    label="再次確認使用者密碼"
                    outlined
                    dense
                    counter="20"
                    v-model="checkPwd"
                    :rules="checkRules.concat(confirmRule)"
                    :type="password"
                    autocomplete="off"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pb-0" lg="9" md="9">
                  <template>
                    <v-select
                      label="權限等級"
                      end
                      outlined
                      dense
                      :items="people"
                      v-model="item.permission"
                    ></v-select>
                  </template>
                </v-col>
                <v-col>
                  <v-btn
                    text
                    class="font-weight-bold blue-grey lighten-4 subtitle-1"
                    @click="validate()"
                    :loading="loading"
                    >儲存</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
        <v-snackbar
          v-model="errSnackbar"
          color="#F44336"
          class="display-1 ma-10 white-text"
          absolute
          right
          timeout="3000"
          ><h2 class="text-center">請輸入正確資訊</h2></v-snackbar
        >
      </v-dialog>
    </template>
    <v-snackbar
      v-model="snackbar"
      color="#B39DDB"
      class="ma-10"
      absolute
      right
      width="20"
      ><v-icon class="mb-1">mdi-check-circle-outline</v-icon
      ><span class="subtitle-1 pl-2"> {{ text }} </span>
    </v-snackbar>
  </div>
</template>

<script>
import airport from "../service/airport";

export default {
  data() {
    return {
      permission: localStorage.getItem("permission"),
      dataLoad: true,
      errSnackbar: false,
      show: false,
      password: "password",
      checkPwd: "",
      loading: false,
      text: "",
      snackbar: false,
      dialog: false,
      memberTable: [],
      people: [1, 2, 3],
      nameRule: [(v) => !!v || "必填"],
      rules: [
        (v) => !!v || "必填",
        (v) => !v || /\w{6,20}/.test(v) || "請輸入6~20個字",
      ],
      pwdRules: [
        (v) => !!v || "必填",
        (v) => !v || /\w{6,20}/.test(v) || "請輸入6~20個字",
      ],
      checkRules: [(v) => !!v || ""],
      item: {
        userName: "",
        userAcc: "",
        userPwd: "",
      },
      headers: [
        {
          text: "使用者名稱",
          align: "center",
          sortable: false,
          value: "userName",
        },
        { text: "使用者帳號", value: "userAcc", align: "center" },
        {
          text: "權限等級",
          value: "permission",
          sortable: false,
          align: "center",
          width: "150",
        },
        { text: "最後更改時間", value: "updateTime", align: "center" },
        // { text: "功能", value: "actions", sortable: false, align: "center" },
      ],
    };
  },

  computed: {
    //確認密碼相符
    confirmRule() {
      return () => this.item.userPwd === this.checkPwd || "密碼不相符";
    },
  },
  mounted() {
    this.GetMember();
    this.permi();
  },

  methods: {
    permi() {
      if (this.permission === "3") {
        this.headers.push({
          text: "功能",
          value: "actions",
          sortable: false,
          align: "center",
        });
      }
    },

    validate() {
      if (this.$refs.newMem.validate()) {
        this.createMember();
      } else {
        this.errSnackbar = true;
      }
    },
    newReset() {
      this.dialog = true;
      if (this.$refs.newMem) this.$refs.newMem.reset();
    },
    async GetMember() {
      const result = await airport.sAccMember();
      this.memberTable = result.data;
      this.dataLoad = false;
    },
    async createMember() {
      this.loading = true;
      const CmemberData = (await airport.cAccMember(this.item)).data;
      this.loading = false;
      this.dialog = false;
      this.snackbar = true;
      this.text = CmemberData.message;
      this.GetMember();
    },
    async updateMember(item) {
      const memberId = item.id;
      const UmemberData = (
        await airport.uAccMember(memberId,item)
      ).data;
      this.snackbar = true;
      this.text = UmemberData.message;
      this.GetMember();
    },
    async deleteMember(item) {
      const memberId = item.id;
      const DmemberData = (
        await airport.dAccMember(memberId)
      ).data;
      this.snackbar = true;
      this.text = DmemberData.message;
      console.log(this.text);
      this.GetMember();
    },
  },
};
</script>

<style>
.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: 18px !important;
  /* background: #CFD8DC; */
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 16px !important;
}
</style>