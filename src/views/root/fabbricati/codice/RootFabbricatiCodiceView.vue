<template>
  <fabbricati-codice isRoot :codice="codice" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import FabbricatiCodice from "@/components/pages/fabbricati/codice/FabbricatiCodice.vue";

@Component({
  components: {
    FabbricatiCodice,
  },
})
export default class RootFabbricatiCodiceView extends Vue {
  /* PROPS */

  @Prop({ type: String, required: true })
  codice!: string;
}
</script>