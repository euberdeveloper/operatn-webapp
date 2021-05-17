<template>
  <contratti-email-firma :token="token" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ContrattiEmailFirma from "@/components/pages/contratti/email-firma/ContrattiEmailFirma.vue";

@Component({
  components: {
    ContrattiEmailFirma,
  },
})
export default class ContrattiEmailTokenFirmaView extends Vue {
  /* PROPS */

  @Prop({ type: String, required: true })
  token!: string;
}
</script>
