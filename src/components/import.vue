<template>
  <div>
    <input type="file" style="display: none" ref="file" @change="getFileData" />

    <v-btn
      depressed
      style="background-color: #b0bec5"
      class="white--text"
      @click="chooseFile()"
      >上傳<v-icon right>mdi-upload</v-icon></v-btn
    >
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
  </div>
</template>

<script>
import airport from "../service/airport";
import XLSX from "xlsx";

export default {
  data() {
    return {
      nameList: {
        用戶名稱: "contact",
        聯絡電話: "phone",
        "戶號/地址": "suit",
        車號:"plate",
        起始日: "date_start",
        到期日: "date_end",
        月租類型: "monthType",
      },
      snackbar:false,
      text: "",
    };
  },
  computed: {
    icon() {
      return this.text === "系統錯誤"
        ? "mdi-alert-circle-outline"
        : "mdi-check-circle-outline";
    },
    color() {
      return this.text === "系統錯誤" ? "red" : "#B39DDB";
    },
  },
  methods: {
    chooseFile() {
      this.$refs.file.dispatchEvent(new MouseEvent("click"));
    },
    getFileData() {
      let params = [];
      const inputFile = this.$refs.file.files[0];
      console.log(inputFile);
      if (inputFile) {
        if (inputFile.name.indexOf(".xlsx") == -1) {
          this.$message.error("檔案型別不正確！", 3);
          return;
        }

        const reader = new FileReader();
        reader.readAsBinaryString(inputFile);
        reader.onload = (e) => {
          var workbook = XLSX.read(e.target.result, { type: "binary" });
          for (let sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              params = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
              console.log("蝦米");
              console.log(params);
              break;
            }
          }
          this.$refs.file.value = null;
          console.log(params);
          //   console.log(this.parseData)
          //   this.batchImport();
          const data = params.map((info) => {
            const newInfo = {};
            //  Object.keys可以列出物件的名稱
            Object.keys(this.nameList).forEach((keyName) => {
              // newInfo[nameList[keyName]]等於nameList的所有欄位名稱
              // info[keyName]等於欄位資料
              newInfo[this.nameList[keyName]] = info[keyName || ""];
            });
            return newInfo;
          });
          console.log(data);
          this.uploadData(data);
        };
      }
    },

    async uploadData(data) {
      console.log(data, 123);
      const cData = (
        await airport.uploadfile({
          info: data,
        })
      ).data;
      console.log(cData.message);
      this.text = cData.message;
      this.snackbar = true;
    },
  },
};
</script>