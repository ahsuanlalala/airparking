<template>
  <v-dialog v-model="plateDialog.click" width="700">
    <v-card class="pb-5">
      <v-card-title style="background-color: #cfd8dc" class="display-1"
        >車籍資訊</v-card-title
      >
      <v-card-text class="pb-1">
        <v-row>
          <v-col class="pb-0 mt-4" sm="4" md="5">
            <v-text-field
              clearable
              label="輸入新增車號"
              outlined
              dense
              autocomplete="off"
              placeholder="ABC-123"
              v-model="Pinfo"
              :rules="[prules]"
            ></v-text-field>
          </v-col>
          <v-col
            ><v-btn
              text
              class="pb-0 mt-5 blue-grey lighten-4"
              @click="createPlate()"
              >新增</v-btn
            ></v-col
          >
        </v-row>
        <v-data-table
          :loading="pDataLoad"
          :headers="headers"
          :items="plateTable"
          :items-per-page="5"
          class="elevation-0 pa-5"
          :footer-props="{ 'items-per-page-text': '每頁資料數' }"
          loading-text="加載中"
          no-data-text="尚無資料"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <!-- 編輯按鈕 -->
            <v-btn @click="updatePlate(item)" class="mr-2" outlined small
              >修改</v-btn
            >
            <!-- 刪除按鈕 -->
            <v-btn @click="deletePlate(item)" outlined small>刪除</v-btn>
          </template>
          <template v-slot:[`item.plate`]="plateTable">
            <v-edit-dialog :return-value.sync="plateTable.item.plate">
              {{ plateTable.item.plate }}
              <template v-slot:input>
                <v-text-field
                  v-model="plateTable.item.plate"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
        </v-data-table>
        <span style="color: red">*點擊車牌可變更，輸入完後ENTER再按修改*</span>
      </v-card-text>
    </v-card>
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
  </v-dialog>
</template>

<script>
import airport from "../service/airport";
export default {
  props: ["plateDialog", "plateTable", "ppid", "pphone", "pDataLoad"],

  data() {
    return {
      snackbar: false,
      text: "",
      userId: "",
      Pinfo: "",
      prules: (v) => !v || /\w{1,4}-\w{1,4}/.test(v) || "車牌必須含有 ' - '",
      headers: [
        {
          text: "車牌號碼",
          align: "center",
          sortable: false,
          value: "plate",
        },
        { text: "功能", align: "center", value: "actions", sortable: false },
      ],
    };
  },

  computed: {
    icon() {
      return this.text === ("系統錯誤" || "新增失敗")
        ? "mdi-alert-circle-outline"
        : "mdi-check-circle-outline";
    },
    color() {
      return this.text === ("系統錯誤" || "新增失敗") ? "red" : "#B39DDB";
    },
  },

  methods: {
    async createPlate() {
      const cPlateData = (
        await airport.cPlate({
          plate: `${this.Pinfo.toUpperCase()}`,
          userId: `${this.ppid}`,
          phone: `${this.pphone}`,
        })
      ).data;
      this.text = cPlateData.message;
      this.snackbar = true;
      this.$emit("searchPlate", { userId: `${this.ppid}` });
    },

    async updatePlate(item) {
      const plateId = item.plateId;
      console.log(plateId);
      const uPlateData = (await airport.uPlate(plateId, item)).data;
      this.text = uPlateData.message;
      console.log(uPlateData.message);
      this.snackbar = true;
      this.$emit("searchPlate", item);
      // this.plateDialog.click = false;
    },
    async deletePlate(item) {
      const platee = item.plate;
      const plateId = item.plateId;
      const yes = confirm(`確定刪除 ${platee} 此車號?`);
      if (yes) {
        const dPlateData = (
          await airport.dPlate(plateId,{
            data: item,
          })
        ).data;
        this.text = dPlateData.message;
        this.snackbar = true;
        this.$emit("searchPlate", item);
      }
    },
  },
};
</script>