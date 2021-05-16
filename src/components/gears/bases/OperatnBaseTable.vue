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
    :class="['operatn-base-table', elevationClass]"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-container class="pa-0 fill-height fluid d-flex" fluid>
          <v-toolbar-title class="mr-4" v-if="$vuetify.breakpoint.mdAndUp">{{ title }}</v-toolbar-title>
          <slot name="header">
            <v-text-field class="flex" v-model="search" label="Cerca" dense solo outlined clearable hide-details prepend-inner-icon="mdi-magnify" />
          </slot>
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

    <template v-slot:group.header="{ group, groupBy, isOpen, headers, toggle, remove }">
      <td :colspan="headers.length">
        <v-btn @click="toggle" icon>
          <v-icon>{{ isOpen ? "mdi-minus" : "mdi-plus" }}</v-icon>
        </v-btn>
        <span class="mr-2">{{ groupHeaders && groupHeaders.keyHandler ? groupHeaders.keyHandler(groupBy[0]) : groupBy[0] }}:</span>
        <span>{{ groupHeaders && groupHeaders.valueHandler ? groupHeaders.valueHandler(group, groupBy[0]) : group }}</span>
        <v-btn @click="remove" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </td>
    </template>

    <template v-for="column of handledColumns" v-slot:[getItemSlotName(column.value)]="{ item, value, index }">
      <span :key="`item-${column.value}-${index}`" v-if="column.value !== '_actions'">
        <span v-if="!column.editable">
          <v-icon class="mr-3" :color="column.itemIconColour ? column.itemIconColour(value) : ''" v-if="column.itemIcon">{{
            column.itemIconHandler ? column.itemIconHandler(value) : value
          }}</v-icon>
          <span v-if="column.itemText !== false">{{ column.itemTextHandler ? column.itemTextHandler(value) : value }}</span>
        </span>
        <v-edit-dialog
          :large="$vuetify.breakpoint.xs"
          @cancel="column.onEditCancel(item)"
          @close="column.onEditClose(item)"
          @save="column.onEditSave(item)"
          @open="column.onEditOpen(item)"
          v-else
        >
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
              :item-text="column.editInput.itemText"
              :item-value="column.editInput.itemValue"
              :clearable="column.editInput.clearable"
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
              :clearable="column.editInput.clearable"
              single-line
              v-else-if="internalUpdateBody"
            />
          </template>
        </v-edit-dialog>
      </span>
      <span :key="`item-${column.value}-${index}`" v-else>
        <v-icon small color="success" class="mx-1" @click="column.actions.onView(item, index)" v-if="column.actions && column.actions.onView && column.actions.showView(item)"
          >mdi-eye</v-icon
        >
        <v-icon small color="primary" class="mx-1" @click="column.actions.onEdit(item, index)" v-if="column.actions && column.actions.onEdit && column.actions.showEdit(item)"
          >mdi-pencil</v-icon
        >
        <v-icon
          small
          color="error"
          class="mx-1"
          @click="column.actions.onDelete(item, index)"
          v-if="column.actions && column.actions.onDelete && column.actions.showDelete(item)"
          >mdi-delete</v-icon>
        <template v-if="column.actions && column.actions.others">
        <v-icon
          v-for="(action, index) of actions.others"
          :key="`${action.icon}_${index}`"
          small
          :color="action.color"
          class="mx-1"
          @click="action.action(item, index)"
          >{{action.icon}}</v-icon
        >
        </template>
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
    clearable?: boolean;
    items?: any[];
    itemText?: string;
    itemValue?: string;
    rules?: InputValidationRule[];
  };
  itemText?: boolean;
  itemIcon?: boolean;
  itemTextHandler?: (value: any) => string;
  itemIconHandler?: (value: any) => string;
  itemIconColour?: (value: any) => string;
}

export interface Actions<T = any> {
  onEdit?: (value: T, index: number) => void | Promise<void>;
  onDelete?: (value: T, index: number) => void | Promise<void>;
  onView?: (value: T, index: number) => void | Promise<void>;

  showEdit?: (value: T, index: number) => boolean;
  showDelete?: (value: T, index: number) => boolean;
  showView?: (value: T, index: number) => boolean;

  others?: { icon: string; color?: string; action: (value: T, index: number) => void | Promise<void> }[];
}

export interface GroupHeaders {
  keyHandler?: (key: string) => string;
  valueHandler?: (value: string, key: string) => string;
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

  @Prop({ type: Object, required: false })
  private groupHeaders?: GroupHeaders;

  @Prop({ type: Array, default: () => [] })
  private selectedValues!: any[];

  @Prop({ type: Array, required: true })
  private values!: any[];

  @Prop({ type: String, required: false })
  private itemKey?: string;

  @Prop({ type: Boolean, default: false })
  private showSelect!: boolean;

  @Prop({ type: String, required: false })
  private sortBy?: string;

  @Prop({ type: Boolean, default: false })
  private multiSort!: boolean;

  @Prop({ validator: (v) => typeof v === "object" || v === null, required: false })
  private updateBody?: any;

  @Prop({ type: Number, default: 1 })
  private elevation!: number;

  /* DATA */

  private search: string | null = null;
  private aggregateBy: string | null = null;

  /* COMPUTED */

  get elevationClass(): string {
    return `elevation-${this.elevation}`;
  }

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
                onView: this.actions.onView,
                showEdit: this.actions.showEdit ?? (() => !!this.actions?.onEdit),
                showDelete: this.actions.showDelete ?? (() => !!this.actions?.onDelete),
                showView: this.actions.showView ?? (() => !!this.actions?.onView),
                others: this.actions?.others
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

<style lang="scss" scoped>
.operatn-base-table ::v-deep {
  th {
    white-space: nowrap;
  }
}
</style>