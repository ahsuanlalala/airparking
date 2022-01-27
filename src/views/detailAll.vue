<template>
  <div>
    <v-row>
      <v-col class="pl-6 pr-0 mt-3 d-flex align-center">
        <v-btn depressed icon x-large class="pl-0 mt-0" @click="goBack()">
          <v-icon class="display-1">mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="display-1 pl-5">All Plate</span>
      </v-col>
    </v-row>
    <v-row class="pt-3 pl-14 mt-0">
      <v-col sm="6" md="3" class="pr-0">
        <v-text-field
          label="輸入車牌"
          outlined
          clearable
          dense
          hide-details
          autocomplete="off"
          v-model="pInfo"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn
          depressed
          style="background-color: #b0bec5"
          class="white--text"
          @click="searchOne()"
          >loook</v-btn
        >
      </v-col>
    </v-row>
    <v-data-table
      :loading="dataLoad"
      :headers="headers"
      :items="AllTable"
      :items-per-page="10"
      class="elevation-0 pa-16"
      :footer-props="{ 'items-per-page-text': '每頁資料數' }"
      no-data-text="尚無資料"
      loading-text="加載中"
    >
      <template v-slot:[`item.contact`]="{ item }">
        <a @click="goUser(item)">
          {{ item.contact }}
        </a>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import airport from "../service/airport";

export default {
  data() {
    return {
      dataLoad: true,
      pInfo: "",
      AllTable: [],
      date_start: this.$moment().format("YYYY-MM-DD"),
      date_end: this.$moment().format("YYYY-MM-DD"),
      headers: [
        {
          text: "車牌",
          align: "start",
          sortable: false,
          value: "plate",
        },
        { text: "用戶名稱", value: "contact", align: "start" },
        { text: "聯絡電話", value: "phone", align: "start" },
        { text: "戶號/地址", value: "suit", align: "start" },
        { text: "到期日", value: "date_end", align: "start" },
      ],
    };
  },

  mounted() {
    this.searchOne();
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goUser(item) {
      this.$router.push({
        name: "detail",
        params: { monthType: `${item.monthType}` },
        query: { contact: `${item.contact}` },
      });
    },

    async searchOne() {
      const result = await airport.sAllPlate(this.pInfo);
      this.AllTable = result.data;
      this.dataLoad = false;
    },
  },
};
</script>