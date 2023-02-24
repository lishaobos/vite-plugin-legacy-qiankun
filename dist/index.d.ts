import { Plugin } from 'vite';

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
declare const legacyQiankun: ({ name }: PluginOptions) => Plugin[];

export { createLifecyle, getMicroApp, legacyQiankun };
