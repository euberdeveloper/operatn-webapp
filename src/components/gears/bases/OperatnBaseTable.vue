<template>
  <v-data-table
    v-model="internalSelectedValues"
    :headers="handledColumns"
    :items="values"
    :item-key="itemKey"
    :show-select="showSelect"
    :sort-by="sortBy"
    :search="search"
    :group-by.sync="aggregateBy"
    :multi-sort="multiSort"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-container class="pa-0 fill-height fluid d-flex" fluid>
          <v-toolbar-title class="mr-4" v-if="$vuetify.breakpoint.mdAndUp">{{ title }}</v-toolbar-title>
          <v-text-field class="flex" v-model="search" label="Cerca" dense solo outlined clearable hide-details prepend-inner-icon="mdi-magnify" />
        </v-container>
      </v-toolbar>
    </template>

    <template v-for="column of handledColumns" v-slot:[getHeaderSlotName(column.value)]>
      <span :key="`header-${column.value}`">
        <span>{{ column.text }} </span>
        <v-btn icon x-small title="aggrega" @click="aggregateBy = column.value" class="ml-1" v-if="column.groupable">
          <v-icon x-small>mdi-layers-triple</v-icon>
        </v-btn>
      </span>
    </template>

    <template v-for="column of handledColumns" v-slot:[getItemSlotName(column.value)]="{ item, value, index }">
      <span :key="`item-${column.value}-${index}`" v-if="column.value !== '_actions'">
        <span v-if="!column.editable">
          <v-icon class="mr-3" v-if="column.itemIcon">{{ column.itemIconHandler ? column.itemIconHandler(value) : value }}</v-icon>
          <span v-if="column.itemText !== false">{{ column.itemTextHandler ? column.itemTextHandler(value) : value }}</span>
        </span>
        <v-edit-dialog :large="$vuetify.breakpoint.xs" @cancel="column.onEditCancel(item)" @close="column.onEditClose(item)" @save="column.onEditSave(item)" @open="column.onEditOpen(item)" v-else>
          <span>
            <v-icon class="mr-3" v-if="column.itemIcon">{{ column.itemIconHandler ? column.itemIconHandler(value) : value }}</v-icon>
            <span v-if="column.itemText !== false">{{ column.itemTextHandler ? column.itemTextHandler(value) : value }}</span>
          </span>
          <template v-slot:input>
            <v-select
              class="mb-4"
              v-model="internalUpdateBody[column.value]"
              :label="column.editInput.label"
              :hint="column.editInput.hint"
              :rules="column.editInput.rules || []"
              :items="column.editInput.items || []"
              single-line
              v-if="column.editInput.type == 'select' && internalUpdateBody"
            />
            <v-text-field
              class="mb-4"
              v-model="internalUpdateBody[column.value]"
              :type="column.editInput.type"
              :label="column.editInput.label"
              :hint="column.editInput.hint"
              :rules="column.editInput.rules || []"
              :counter="column.editInput.counter"
              single-line
              v-else-if="internalUpdateBody"
            />
          </template>
        </v-edit-dialog>
      </span>
      <span :key="`item-${column.value}-${index}`" v-else>
        <v-icon small color="primary" class="mx-1" @click="column.actions.onEdit(item)" v-if="column.actions && column.actions.onEdit">mdi-pencil</v-icon>
        <v-icon small color="error" class="mx-1" @click="column.actions.onDelete(item)" v-if="column.actions && column.actions.onDelete">mdi-delete</v-icon>
      </span>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { DataTableHeader, InputValidationRule } from "vuetify";

export interface Column<T = any> extends DataTableHeader {
  editable?: boolean;
  onEditCancel?: (value: T) => void | Promise<void>;
  onEditClose?: (value: T) => void | Promise<void>;
  onEditSave?: (value: T) => void | Promise<void>;
  onEditOpen?: (value: T) => void | Promise<void>;
  editInput?: {
    type?: string;
    label?: string;
    hint?: string;
    counter?: boolean;
    items?: string[];
    rules?: InputValidationRule[];
  };
  itemText?: boolean;
  itemIcon?: boolean;
  itemTextHandler?: (value: any) => string;
  itemIconHandler?: (value: any) => string;
}

export interface Actions<T = any> {
  onEdit?: (value: T) => void | Promise<void>;
  onDelete?: (value: T) => void | Promise<void>;
}

type HandledColumn<T = any> = Column<T> & { actions: Actions<T> };

@Component({
  model: {
    prop: "selectedValues",
    event: "selected",
  },
})
export default class OperatnBaseTable extends Vue {
  /* PROPS */

  @Prop({ type: String, required: true })
  private title!: string;

  @Prop({ type: Array, required: true })
  private columns!: Column[];

  @Prop({ type: Object, required: false })
  private actions?: Actions;

  @Prop({ type: Array, required: true })
  private selectedValues!: any[];

  @Prop({ type: Array, required: true })
  private values!: any[];

  @Prop({ type: String, required: true })
  private itemKey!: string;

  @Prop({ type: Boolean, default: false })
  private showSelect!: boolean;

  @Prop({ type: String, required: false })
  private sortBy?: string;

  @Prop({ type: Boolean, default: false })
  private multiSort!: boolean;

  @Prop({ validator: (v) => typeof v === "object" || v === null, required: true })
  private updateBody!: any;

  /* DATA */

  private search: string | null = null;
  private aggregateBy: string | null = null;

  /* COMPUTED */

  get internalSelectedValues(): any {
    return this.selectedValues;
  }
  set internalSelectedValues(value: any) {
    this.$emit("selected", value);
  }

  get internalUpdateBody(): any {
    return this.updateBody;
  }
  set internalUpdateBody(value: any) {
    this.$emit("update:update-body", value);
  }

  get handledColumns(): (HandledColumn | Column)[] {
    return [
      ...this.columns,
      ...(this.actions
        ? [
            {
              text: "Azioni",
              value: "_actions",
              sortable: false,
              actions: {
                onEdit: this.actions.onEdit,
                onDelete: this.actions.onDelete,
              },
            },
          ]
        : []),
    ];
  }

  /* METHODS */

  getHeaderSlotName(name: string): string {
    return `header.${name}`;
  }
  getItemSlotName(name: string): string {
    return `item.${name}`;
  }
}
</script>