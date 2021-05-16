<template>
  <v-card>
    <v-card-title class="headline primary white--text">{{ title }}</v-card-title>
    <v-card-text>
      <slot name="description">
        <v-subheader class="px-0 mt-md-4 mb-md-0 mt-8 mb-4 text-subtitle-1" v-if="description">{{ description }}</v-subheader>
      </slot>
    </v-card-text>

    <!-- TABLE -->
    <operatn-base-table
      :title="tableTitle"
      v-model="internalTableSelectedValues"
      :columns="tableColumns"
      :actions="tableActions"
      :groupHeaders="tableGroupHeaders"
      :values="tableValues"
      :itemKey="tableItemKey"
      :sortBy="tableSortBy"
      :showSelect="tableShowSelect"
      :multiSort="tableMultiSort"
      :updateBody.sync="internalTableUpdateBody"
      v-if="showTable"
    />

    <!-- PLUS FAB BUTTON -->
    <v-fab-transition v-if="showActionButton && !isSelecting" key="plus">
      <v-btn color="primary" @click="fabCreateClick" fab large fixed bottom right>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <!-- DELETE FAB BUTTON -->
    <v-fab-transition v-else-if="showActionButton" key="delete">
      <v-btn color="error" @click="fabDeleteClick" fab large fixed bottom right>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-fab-transition>

    <!-- CREATE DIALOG -->
    <operatn-action-dialog
      :title="createDialogTitle"
      :width="dialogWidth"
      :widthMobile="dialogWidthMobile"
      v-model="internalCreateDialogShow"
      :disabled="createDialogDisabled"
      @cancel="createDialogCancel"
      @confirm="createDialogConfirm"
    >
      <slot />
    </operatn-action-dialog>

    <!-- EDIT DIALOG -->
    <operatn-action-dialog
      :title="editDialogTitle"
      :width="dialogWidth"
      :widthMobile="dialogWidthMobile"
      v-model="internalEditDialogShow"
      :disabled="editDialogDisabled"
      @cancel="editDialogCancel"
      @confirm="editDialogConfirm"
    >
      <slot name="editDialog" />
    </operatn-action-dialog>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseTable, { Actions, Column, GroupHeaders } from "@/components/gears/bases/OperatnBaseTable.vue";

export { Actions, Column, GroupHeaders } from "@/components/gears/bases/OperatnBaseTable.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseTable,
  },
})
export default class OperatnBaseResourceManager extends Vue {
  /* PROPS */

  @Prop({ type: String, required: true })
  private title!: string;

  @Prop({ type: String, required: false })
  private description?: string;

  @Prop({ type: Boolean, default: true })
  private showTable!: boolean;

  @Prop({ type: String, required: true })
  private tableTitle!: string;

  @Prop({ type: Array, required: true })
  private tableColumns!: Column[];

  @Prop({ type: Object, required: true })
  private tableActions!: Actions;

  @Prop({ type: Object, required: false })
  private tableGroupHeaders?: GroupHeaders;

  @Prop({ type: Array, required: true })
  private tableSelectedValues!: any[];

  @Prop({ type: Array, required: true })
  private tableValues!: any[];

  @Prop({ type: String, required: true })
  private tableItemKey!: string;

  @Prop({ type: Boolean, default: false })
  private tableShowSelect!: boolean;

  @Prop({ type: String, required: false })
  private tableSortBy?: string;

  @Prop({ type: Boolean, default: false })
  private tableMultiSort!: boolean;

  @Prop({ validator: (v) => typeof v === "object" || v === null, required: true })
  private tableUpdateBody!: any;

  @Prop({ type: String, required: true })
  private createDialogTitle!: string;

  @Prop({ type: Boolean, default: false })
  private createDialogShow!: boolean;

  @Prop({ type: Boolean, required: true })
  private createDialogDisabled!: boolean;

  @Prop({ type: String, required: true })
  private editDialogTitle!: string;

  @Prop({ type: Boolean, default: false })
  private editDialogShow!: boolean;

  @Prop({ type: Boolean, required: true })
  private editDialogDisabled!: boolean;

  @Prop({ type: Boolean, default: true })
  private showActionButton!: boolean;

  @Prop({ type: String, required: false })
  dialogWidth?: string;

  @Prop({ type: String, required: false })
  dialogWidthMobile?: string;

  /* GETTERS AND SETTERS */

  get internalTableSelectedValues(): any[] {
    return this.tableSelectedValues;
  }
  set internalTableSelectedValues(value: any[]) {
    this.$emit("update:tableSelectedValues", value);
  }

  get internalTableUpdateBody(): any {
    return this.tableUpdateBody;
  }
  set internalTableUpdateBody(value: any) {
    this.$emit("update:table-update-body", value);
  }

  get internalCreateDialogShow(): boolean {
    return this.createDialogShow;
  }
  set internalCreateDialogShow(value: boolean) {
    this.$emit("update:createDialogShow", value);
  }

  get internalEditDialogShow(): boolean {
    return this.editDialogShow;
  }
  set internalEditDialogShow(value: boolean) {
    this.$emit("update:editDialogShow", value);
  }

  get isSelecting(): boolean {
    return this.internalTableSelectedValues.length > 0;
  }

  /* METHODS */

  fabCreateClick(): void {
    this.$emit("fabCreateClick");
  }
  fabDeleteClick(): void {
    this.$emit("fabDeleteClick");
  }

  createDialogCancel(): void {
    this.$emit("createDialogCancel");
  }
  createDialogConfirm(): void {
    this.$emit("createDialogConfirm");
  }

  editDialogCancel(): void {
    this.$emit("editDialogCancel");
  }
  editDialogConfirm(): void {
    this.$emit("editDialogConfirm");
  }
}
</script>