<template>
  <div>
    <v-container>
      <v-row>
        <v-col class="pl-3 mt-0 d-flex align-center">
          <v-btn depressed icon x-large class="pl-0 mt-0" @click="goBack()">
            <v-icon class="display-1">mdi-arrow-left-circle</v-icon>
          </v-btn>
          <template v-if="this.$route.params.monthType === 'A'">
            <span class="display-1 pl-5">1-A</span>
          </template>
          <template v-else-if="this.$route.params.monthType === 'B'">
            <span class="display-1 pl-5">1-B</span>
          </template>
          <template v-else-if="this.$route.params.monthType === 'C'">
            <span class="display-1 pl-5">1-C</span>
          </template>
        </v-col>
      </v-row>
    </v-container>

    <table123 :headers="headers" />
  </div>
</template>

<script>
import table123 from "../components/table";

export default {
  components: { table123 },
  data() {
    return {
      headers: [
        {
          text: "用戶名稱",
          align: "start",
          sortable: false,
          value: "contact",
        },
        { text: "pacaId", value: "pacaId", align: "start" },
        { text: "聯絡電話", value: "phone", align: "start" },
        { text: "戶號/地址", value: "suit", align: "start" },
        { text: "到期日", value: "date_end", align: "start" },
        { text: "車輛數", value: "plate_count", align: "start" },
        { text: "功能", value: "actions", sortable: false, align: "start" },
      ],
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
