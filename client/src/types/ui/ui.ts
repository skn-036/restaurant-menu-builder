export type UiTab = {
    tab: string;
    title: string;
};

export declare class TinyEmitter {
    on(event: string, callback: Function, ctx?: any): this;
    once(event: string, callback: Function, ctx?: any): this;
    emit(event: string, ...args: any[]): this;
    off(event: string, callback?: Function): this;
}

export type ConfirmModal = {
    message?: string;
    actionButton?: {
        class?: string;
        text?: string;
        icon?: string;
    };
    returnButton?: {
        class?: string;
        text?: string;
        icon?: string;
    };
};
