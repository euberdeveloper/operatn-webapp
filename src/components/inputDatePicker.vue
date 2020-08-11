<template>
  <v-menu
    ref="menu1"
    v-model="menu1"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="dateFormatted"
        prepend-icon="mdi-calendar"
        v-on="on"
        v-bind:value="value"
        v-bind="$attrs"
        placeholder="dd/mm/aaaa"
        @blur="update"
      ></v-text-field>
    </template>
    <v-date-picker v-bind="$attrs" v-model="date" no-title @input="menu1 = false"></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: ["value"],
  data() {
    return {
      menu1: false,
      date: this.$props.value,
      dateFormatted: this.formatDate(this.$props.value),
    };
  },
  computed: {
    computedDateFormatted: {
      get() {
        if (this.date === "") return "";
        return this.formatDate(new Date(this.date));
      }
    }
  },
  watch: {
    // menu1(v) {
    //   v && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"))
    // },
    date(v, prev) {
      this.dateFormatted = this.formatDate(v);
      if (!v || v == prev) return;
      this.$emit("input", v);
    },
    value(v) {
      this.date = v;
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return "";
      if (typeof date == "string") {
        if (date.indexOf("-") !== -1) {
          const [year, month, day] = date.split("-");
          return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
        } else {
          const [day, month, year] = date.split("/");
          return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
        }
      }
      return date.toLocaleDateString("it-IT");
    },
    parseDate(date) {
      if (!date) return null;
      const [day, month, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    update() {
      this.date = this.parseDate(this.dateFormatted);
    }
  }
};
</script>