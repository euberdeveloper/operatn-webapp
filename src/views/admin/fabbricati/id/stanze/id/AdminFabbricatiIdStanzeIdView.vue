<template>
  <stanza-id :isRoot="false" :sid="+sid" :fid="+fid" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import StanzaId from "@/components/pages/fabbricati/stanza/StanzaId.vue";

@Component({
  components: {
    StanzaId,
  },
})
export default class AdminFabbricatiCodiceStanzeIdView extends Vue {
  /* PROPS */

  @Prop({ type: String, required: true })
  fid!: string;

  @Prop({ type: String, required: true })
  sid!: string;
}
</script>