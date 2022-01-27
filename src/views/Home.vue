<template>

    <v-container fill-height fluid>
      <v-card class="mx-auto" width="1100">
        <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-item-action>
            <v-icon class="ml-4 mr-1 display-1">{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="display-1 my-7">{{ link.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-container>
    
</template>

<script>


export default {
  data() {
    return {
      links: [
        { icon: "mdi-arrow-right-circle", text: "1-A組", route: "/detail/A" },
        { icon: "mdi-arrow-right-circle", text: "1-B組", route: "/detail/B" },
        { icon: "mdi-arrow-right-circle", text: "1-C組", route: "/detail/C" },
        { icon: "mdi-arrow-right-circle", text: "all", route: "/detail/all"}
      ],
    };
  },
};
</script>
