<template>
  <!-- v-model="newSigner.ppl" -->

  <v-autocomplete
    v-model="internalValue"
    :items="items"
    :search-input.sync="searchPpl"
    class="mx-4"
    flat
    label="Persona"
    item-text="Description"
    item-value="id"
    solo-inverted
    clearable
    placeholder="Nome Cognome"
    no-filter
    v-bind="$attrs"
  >
    <template v-slot:append-item>
      <v-chip v-if="canLoadMore" v-intersect="onScrollToBottom">Caricamento...</v-chip>
    </template>
  </v-autocomplete>
</template>
<script>
import Vue from 'vue';
export default {
  name: 'UserSelect',
  props: ['value', 'start-date', 'end-date'],
  data() {
    return {
      users: [],
      searchPpl: '',
      page: 0,
      canLoadMore: false,
    };
  },
  computed: {
    internalValue: {
      get() {
        return this.$props.value
      },
      set(v) {
        this.$emit("input", v)
      }
    },
    items() {
      let usrs = this.users
      if (usrs.length === 0 && this.internalValue != null && Object.keys(this.internalValue).length > 0)
        usrs = [this.internalValue]
      return usrs.map(entry => {
        const Description = `ID:${entry.id} ${entry.cognome.trim()} ${entry.nome.trim()} ${entry.sesso.trim()} DN:${new Date(
          entry.data_nascita
        ).toLocaleDateString("it-IT")}`;
        return Object.assign({}, entry, { Description })
      })
    }
  },
  watch: {
    searchPpl(val) {
      if (!val || val.trim() == "" || !!this.model) return;
      val = val.trim();
      this.page = 0;
      this.search();
    },
    page(val) {
      if (val == 0) return;
      this.search();
    },
    value(val) {
      if (val && this.users.length == 0){
        this.users = [val]
      }
    }
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    onScrollToBottom(entries, observer) {
      if (entries[0].intersectionRatio > 0) {
        this.page++;
      }
    },
    search() {
      Vue.prototype.$api
        .get(`/person?search=${this.searchPpl}&page=${this.page}${(this.startDate && this.endDate)?`&startDate=${this.startDate}&endDate=${this.endDate}`:''}&pagesize=50`)
        .then(
          result => {
            this.canLoadMore = result.data.length >= 50;
            if (this.page == 0) this.users = result.data;
            else
              result.data.forEach(element => {
                this.users.push(element);
              });
          },
          error => console.log(error)
        );
    }
  }
};
</script>