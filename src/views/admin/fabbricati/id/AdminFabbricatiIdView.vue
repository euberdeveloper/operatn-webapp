<template>
  <fabbricati-id :isRoot="false" :fid="+fid" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import FabbricatiId from "@/components/pages/fabbricati/fabbricato/FabbricatiId.vue";

@Component({
  components: {
    FabbricatiId,
  },
})
export default class AdminFabbricatiIdView extends Vue {
  /* PROPS */

  @Prop({ type: String, required: true })
  fid!: string;
}
</script>