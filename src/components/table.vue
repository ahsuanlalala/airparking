<template>
  <div>
    <v-row class="pt-0 pl-14 mt-0">
      <v-col sm="6" md="3" class="pr-0">
        <v-text-field
          label="輸入名稱"
          outlined
          clearable
          dense
          hide-details
          autocomplete="off"
          v-model="info"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn
          depressed
          style="background-color: #b0bec5"
          class="white--text"
          @click="searchId()"
          >查詢用戶名稱</v-btn
        >
      </v-col>
      <v-col class="d-flex justify-end pr-0" md="2"></v-col>
      <!--上傳按鈕 -->
      <v-col class="d-flex justify-end pr-15 pl-0" md="2">
        <import2 />
      </v-col>
      <!-- 下載按鈕 -->
      <v-col class="d-flex justify-end pr-15 pl-0" md="2">
        <export2 :detailTable="detailTable" />
      </v-col>
    </v-row>
    <!-- 資料表 -->
    <v-data-table
      :loading="dataLoad"
      :headers="headers"
      :items="detailTable"
      :items-per-page="10"
      class="elevation-0 pa-16"
      :footer-props="{ 'items-per-page-text': '每頁資料數' }"
      no-data-text="尚無資料"
      loading-text="加載中"
    >
      <!-- 新增按鈕 -->
      <template v-slot:top>
        <v-row
          ><v-col class="d-flex justify-end"
            ><v-btn
              depressed
              style="background-color: #b0bec5"
              class="white--text"
              @click="dialog = true"
              >新增</v-btn
            ></v-col
          ></v-row
        >
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="mr-2" @click="searchPlate(item)">mdi-car-info</v-icon>
        <!-- 編輯按鈕 -->
        <v-icon class="mr-2" @click="editItem(item)">mdi-account-edit</v-icon>
        <!-- 刪除按鈕 -->
        <v-icon @click="deleteItem(item)">mdi-trash-can</v-icon>
      </template>
    </v-data-table>
    <template>
      <!-- 跳出視窗 -->
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="800" persistent>
          <v-card class="pb-5">
            <!-- 視窗標頭 -->
            <v-card-title style="background-color: #cfd8dc">
              <span class="display-1">{{ formTitle }}</span>
              <v-spacer></v-spacer>
              <!-- 關閉視窗按鈕 -->
              <v-btn large text @click="close()" class="font-weight-bold" icon>
                <v-icon>mdi-close-thick</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="pb-1">
              <v-row>
                <v-col class="pb-0 mt-4">
                  <v-text-field
                    label="用戶姓名"
                    outlined
                    dense
                    autocomplete="off"
                    v-model="editedItem.contact"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-1">
                  <v-text-field
                    label="連絡電話"
                    outlined
                    dense
                    autocomplete="off"
                    :rules="rules"
                    counter
                    maxlength="10"
                    v-model="editedItem.phone"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-1">
                  <v-text-field
                    label="戶號/地址"
                    outlined
                    dense
                    autocomplete="off"
                    v-model="editedItem.suit"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <!-- 選擇起始時間 -->
                <v-col class="py-1">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="date_start"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="editedItem['date_start']"
                        label="起始日"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        prepend-inner-icon="mdi-calendar"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="editedItem['date_start']"
                      no-title
                      scrollable
                      @input="menu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- 波浪 -->
                <span class="display-1">~</span>
                <!-- 選擇到期時間 -->
                <v-col class="py-1">
                  <v-menu
                    ref="menu2"
                    v-model="menu2"
                    :close-on-content-click="false"
                    :return-value.sync="date_end"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="editedItem['date_end']"
                        label="到期日"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        prepend-inner-icon="mdi-calendar"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="editedItem['date_end']"
                      no-title
                      scrollable
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <!-- 開放類型/時段唯讀 -->
              <template v-if="this.$route.params.monthType === 'A'">
                <v-row v-for="normal in normals" :key="normal.text">
                  <v-col class="py-1">
                    <v-text-field
                      :value="normal.text"
                      outlined
                      dense
                      disabled
                    ></v-text-field>
                  </v-col>
                </v-row>
              </template>
              <template v-else-if="this.$route.params.monthType === 'B'">
                <v-row v-for="vacation in vacations" :key="vacation.text">
                  <v-col class="py-1">
                    <v-text-field
                      :value="vacation.text"
                      outlined
                      dense
                      disabled
                    ></v-text-field>
                  </v-col>
                </v-row>
              </template>
              <template v-else-if="this.$route.params.monthType === 'C'">
                <v-row v-for="business in businesss" :key="business.text">
                  <v-col class="py-1">
                    <v-text-field
                      :value="business.text"
                      outlined
                      dense
                      disabled
                    ></v-text-field>
                  </v-col>
                </v-row>
              </template>
              <!-- 備註 -->
              <v-row>
                <v-col class="py-1">
                  <v-textarea
                    outlined
                    label="備註"
                    autocomplete="off"
                    v-model="editedItem.remarks"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-1">
                  <v-text-field
                    v-model="editedItem.updated"
                    dense
                    disabled
                    label="最後更新時間"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <!-- 儲存按鈕 -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                class="font-weight-bold blue-grey lighten-4 subtitle-1"
                @click="save()"
                >儲存</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <!-- 再次確認視窗 -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline text-center">
          <v-spacer></v-spacer>確定刪除此用戶及該用戶所有車輛?
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            class="font-weight-bold blue-grey lighten-4 subtitle-1"
            @click="deleteItemConfirm()"
            >確定</v-btn
          >
          <v-btn
            text
            outlined
            class="font-weight-bold lighten-4 subtitle-1"
            @click="closeDelete()"
            >取消</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :color="color"
      class="ma-10"
      absolute
      right
      width="20"
      ><v-icon class="mb-1">{{ icon }}</v-icon
      ><span class="subtitle-1 pl-2"> {{ text }} </span>
    </v-snackbar>

    <plateTable
      :plateDialog="plateDialog"
      :plateTable="plateTable"
      @searchPlate="searchPlate"
      :ppid="ppid"
      :pphone="pphone"
      :pDataLoad="pDataLoad"
    />
  </div>
</template>


<script>
import import2 from "./import";
import export2 from "./export";
import plateTable from "./plate";
import airport from "../service/airport";

export default {
  components: { plateTable, export2, import2 },
  data() {
    return {
      pDataLoad: true,
      dataLoad: true,
      text: "",
      snackbar: false,
      updated: "",
      info: this.$route.query.contact || "",
      dialog: false,
      menu: false,
      menu2: false,
      editedIndex: -1,
      detailTable: [],
      editedId: 0,
      dialogDelete: false,
      plateDialog: { click: false },
      date_start: this.$moment().format("YYYY-MM-DD"),
      date_end: this.$moment().format("YYYY-MM-DD"),
      type: [this.$route.params.monthType],
      plateTable: [],
      ppid: "",
      pphone: "",
      rules: [(v) => v.length <= 10 || "最多10個字"],

      editedItem: {
        contact: "",
        pacaId: "",
        phone: "",
        suit: "",
        date_start: this.$moment().format("YYYY-MM-DD"),
        date_end: this.$moment().format("YYYY-MM-DD"),
        remarks: "",
        updated: this.$moment().format("YYYY-MM-DD hh:mm:ss"),
      },
      defaultItem: {
        contact: "",
        pacaId: "",
        phone: "",
        suit: "",
        date_start: this.$moment().format("YYYY-MM-DD"),
        date_end: this.$moment().format("YYYY-MM-DD"),
        remarks: "",
        updated: this.$moment().format("YYYY-MM-DD hh:mm:ss"),
      },
      normals: [{ text: "平日" }, { text: "07:00~18:00" }],
      vacations: [{ text: "假日" }, { text: "07:00~18:00" }],
      businesss: [{ text: "平/假日" }, { text: "07:00~18:00" }],
    };
  },
  props: ["headers"],

  computed: {
    //視窗標題，預設-1，在-1時是true顯示新增，false顯示編輯
    formTitle() {
      return this.editedIndex === -1 ? "新增用戶資訊" : "編輯用戶資訊";
    },
    icon() {
      return this.text === ("系統錯誤" || "更新失敗")
        ? "mdi-alert-circle-outline"
        : "mdi-check-circle-outline";
    },
    color() {
      return this.text === ("系統錯誤" || "更新失敗") ? "red" : "#B39DDB";
    },
  },

  mounted() {
    this.searchId();
    // this.searchPlate();
  },

  methods: {
    async searchId() {
      const type = this.$route.params.monthType;
      const result = await airport.sMember(type, this.info);
      this.detailTable = result.data;
      this.dataLoad = false;
    },

    async createMem() {
      const type = this.$route.params.monthType;
      const cMemData = (
        await airport.cMember({
          ...this.editedItem,
          monthType: `${type}`,
        })
      ).data;
      this.text = cMemData.message;
      this.snackbar = true;
      this.searchId();
    },
    async updateMem() {
      const userId = this.editedId;
      const uMemData = (await airport.uMember(userId, this.editedItem)).data;
      this.text = uMemData.message;
      this.snackbar = true;
      this.searchId();
    },

    async deleteMem() {
      const userId = this.editedId;
      const dMemDa = (await airport.dMember(userId)).data;
      this.text = dMemDa.message;
      this.snackbar = true;
      this.searchId();
    },

    async searchPlate(item) {
      this.pDataLoad = true;
      this.plateDialog.click = true;
      this.ppid = item.userId;
      this.pphone = item.phone;
      const result = await airport.sPlate(this.ppid);
      this.plateTable = result.data;
      this.pDataLoad = false;
    },

    editItem(item) {
      this.editedIndex = this.detailTable.indexOf(item); //沒東西時indexof為-1
      this.editedItem = { ...item };
      this.editedId = item.userId;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.detailTable.indexOf(item);
      this.editedId = item.userId;
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.deleteMem();
      this.detailTable.splice(this.editedIndex, 1); //從editedIndex開始刪除1個元素
      this.closeDelete();
    },
    close() {
      this.dialog = false; //關閉對話窗
      // nextTick可以在跑完迴圈後，做一次性更新
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false; //關閉對話窗
      // nextTick可以在跑完迴圈後，做一次性更新
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        this.updateMem();
      } else {
        this.createMem();
        this.detailTable.push(this.editedItem);
      }
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.dialog = false;
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