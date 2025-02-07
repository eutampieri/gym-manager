export interface ListData {
    headers: Headers,
    actions: Array<Action>,
    data: Array<RowData>,
}

export type Headers = Array<Header>;
export interface Header {
    key: string,
    name: string,
    link?: (d: RowData) => string,
}
export interface Action {
    action: (data: any) => void,
    label: string,
    colour: string,
}

export type RowData = {
    [key: string]: string | Array<string>;
};
