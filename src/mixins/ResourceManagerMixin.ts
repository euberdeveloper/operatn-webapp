/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, Vue } from "vue-property-decorator";
import { ActionTypes } from "@/store";

@Component
export default class ResourceManagerMixin<TupleType = any, CreateType = any, UpdateType = any, IdType = number> extends Vue {
    /* DATA */

    protected values: TupleType[] = [];

    protected selectedValues: TupleType[] = [];
    private internalBackupValue: TupleType | null = { a: 0 } as any;

    protected showCreateDialog = false;
    protected createBodyValid = false;
    protected createBody: CreateType | null = null;

    protected showEditDialog = false;
    protected updateBodyValid = false;
    protected updateBody: UpdateType | null = null;
    protected updateId: IdType | null = null;

    /* COMPUTED */

    get backupValue(): TupleType | null {
        return this.internalBackupValue;
    }
    set backupValue(value: TupleType | null) {
        this.internalBackupValue = value ? { ...value } : null;
    }

    /* THINGS THAT WILL BE OVERRIDEN */

    protected getIdFromValue(value: TupleType): IdType {
        const val: any = value;
        return val.id;
    }

    protected askDeleteText = 'Sei sicuro di voler eliminare questo elemento?';
    protected askDeleteMultipleText = 'Sei sicuro di voler eliminare gli elementi selezionati?';
    protected deleteHandler(_id: IdType, _isMultiple: boolean): Promise<void> | void { }

    protected async createHandler(value: CreateType): Promise<IdType> {
        const val: any = value;
        return val.id as IdType;
    }
    protected updateHandler(_id: IdType, _value: UpdateType, _isTableEdit: boolean): Promise<void> | void { }

    protected updateBodyFromValue(value: TupleType): UpdateType | Promise<UpdateType> {
        const val: any = value;
        return val as UpdateType;
    }
    protected tupleValueFromCreateBody(_id: IdType, body: CreateType): TupleType | Promise<TupleType> {
        const res: any = body;
        return res as TupleType;
    }
    protected tupleValueFromUpdateBody(_id: IdType, body: UpdateType, _backupValue?: TupleType): TupleType | Promise<TupleType> {
        const res: any = body;
        return res as TupleType;
    }

    /* METHODS */

    askDelete(value: TupleType): void {
        this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
            text: this.askDeleteText,
            callback: async (answer) => {
                if (answer) {
                    try {
                        const id = this.getIdFromValue(value);
                        await this.deleteHandler(id, false);
                        const index = this.values.findIndex((v) => this.getIdFromValue(v) === this.getIdFromValue(value));
                        this.values.splice(index, 1);
                    }
                    catch (error) { }
                }
            },
        });
    }

    askDeleteMultiple(): void {
        this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
            text: this.askDeleteText,
            callback: async (answer) => {
                if (answer) {
                    for (const val of [...this.selectedValues]) {
                        const id = this.getIdFromValue(val);

                        try {
                            await this.deleteHandler(id, true);
                        }
                        catch (error) {
                            continue;
                        }

                        const index = this.values.findIndex((v) => this.getIdFromValue(v) === this.getIdFromValue(val));
                        this.values.splice(index, 1);

                        const indexSelectedValue = this.selectedValues.findIndex((v) => this.getIdFromValue(v) === this.getIdFromValue(val));
                        if (indexSelectedValue !== -1) {
                            this.selectedValues.splice(indexSelectedValue, 1);
                        }
                    }
                }
            },
        });
    }

    openCreate(): void {
        this.createBodyValid = false;
        this.showCreateDialog = true;
    }
    async closeCreate(save: boolean): Promise<void> {
        if (!save) {
            this.createBody = null;
            this.showCreateDialog = false;
            return;
        }

        if (this.createBodyValid && this.createBody) {
            try {
                const id = await this.createHandler(this.createBody);
                this.values.push(await this.tupleValueFromCreateBody(id, this.createBody))
                this.createBody = null;
                this.showCreateDialog = false;
            }
            catch (error) { }
        }
    }


    async prepareUpdateBody(value: TupleType): Promise<void> {
        this.backupValue = value;
        this.updateBody = await this.updateBodyFromValue(value);
        this.updateId = this.getIdFromValue(value);
    }
    sprepareUpdateBody(): void {
        this.updateBody = null;
        this.updateId = null;
        this.backupValue = null
    }
    async openEdit(value: TupleType): Promise<void> {
        await this.prepareUpdateBody(value);
        this.updateBodyValid = false;
        this.showEditDialog = true;
    }
    async closeEdit(save: boolean): Promise<void> {
        if (!save) {
            this.sprepareUpdateBody();
            this.showEditDialog = false;
            return;
        }

        if (this.updateBodyValid && this.updateBody && this.updateId) {
            try {
                await this.updateHandler(this.updateId, this.updateBody, false);
            }
            catch (error) {}

            try {
                const index = this.values.findIndex((v) => this.getIdFromValue(v) === this.updateId);
                this.values.splice(index, 1, await this.tupleValueFromUpdateBody(this.updateId, this.updateBody, this.backupValue as TupleType));

                this.sprepareUpdateBody();
                this.showEditDialog = false;
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    async updateValue(): Promise<void> {
        if (this.updateBody && this.updateId !== null) {
            const updateBody = this.updateBody;
            const updateId = this.updateId;
            const backupValue = this.backupValue;

            try {
                await this.updateHandler(updateId, updateBody, true);
                const index = this.values.findIndex((v) => this.getIdFromValue(v) === updateId);
                this.values.splice(index, 1, await this.tupleValueFromUpdateBody(updateId, updateBody, backupValue as TupleType));
            } catch (error) { console.error(error) }

        }
    }
}