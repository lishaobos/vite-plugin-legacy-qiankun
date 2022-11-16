declare type Lifecyle = {
    bootstrap<T>(): T;
    mount<T>(): T;
    unmount<T>(): T;
};
declare type PluginOptions = {
    name: string;
};

declare const getMicroApp: (appName: string) => any;
declare const createLifecyle: (name: string, lifecyle: Lifecyle) => void;
declare const legacyQiankun: ({ name }: PluginOptions) => ({
    name: string;
    enforce: string;
    apply: string;
    transformIndexHtml: (html: string) => string;
    transform: (code: string, id: string) => string;
} | {
    name: string;
    enforce: string;
    apply: string;
    transformIndexHtml: (html: string) => string;
    transform?: undefined;
})[];

export { createLifecyle, getMicroApp, legacyQiankun };
