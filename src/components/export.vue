<template>
  <div>
    <v-btn
      @click="download()"
      depressed
      style="background-color: #b0bec5"
      class="white--text"
      >下載<v-icon right>mdi-download</v-icon></v-btn
    >
  </div>
</template>
<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      nameList: {
        contact: "用戶名稱",
        pacaId: "pacaId",
        phone: "聯絡電話",
        suit: "戶號/地址",
        date_start: "起始日",
        date_end: "到期日",
        plate_count: "車輛數",
        monthType:"月租類型"
      },
    };
  },
  props: ["detailTable"],
  methods: {
    download() {
      const wopts = {
        bookType: "xlsx",
        bookSST: false,
        type: "binary",
        showGridLines: false,
      };
      const wb = { SheetNames: ["coolthing"], Sheets: {}, Props: {} };
      const data = this.detailTable.map((info) => {
        const newInfo = {};
        //  Object.keys可以列出物件的名稱
        Object.keys(this.nameList).forEach((keyName) => {
          // newInfo[nameList[keyName]]等於nameList的所有欄位名稱
          // info[keyName]等於欄位資料
          newInfo[this.nameList[keyName]] = info[keyName];
        });
        return newInfo;
      });
      console.log(data);
      wb.Sheets["coolthing"] = XLSX.utils.json_to_sheet(data);
      //建立二進位制物件寫入轉換好的位元組流
      let tmpDown = new Blob([this.s2ab(XLSX.write(wb, wopts))], {
        type: "application/octet-stream",
      });
      FileSaver.saveAs(tmpDown, "coolthing.xlsx");
      console.log("finish");
    },
    //字串轉字元流
    s2ab(s) {
      if (typeof ArrayBuffer !== "undefined") {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (var i = 0; i != s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      } else {
        let buf = new Array(s.length);
        for (let i = 0; i != s.length; i++) buf[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
    },
  },
};
</script>