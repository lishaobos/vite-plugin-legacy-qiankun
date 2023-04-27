import { Plugin } from 'vite';

type PluginOptions = {
    name: string;
    devSandbox?: boolean;
};
type Lifecyle = {
    bootstrap(): Promise<any> | void;
    mount(props: any): Promise<any> | void;
    unmount(props: any): Promise<any> | void;
    update?(props: any): Promise<any> | void;
};
type MicroApp = Partial<{
    publicPath: string;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__: string;
    __POWERED_BY_QIANKUN__: string;
    lifecyle: Lifecyle;
}>;
declare const convertVariable: (code: string, from: string, to: string) => string;
declare const getMicroApp: (appName: string) => MicroApp;
declare const createLifecyle: (name: string, lifecyle: Lifecyle) => void;
declare const createCtx: ({ name, devSandbox }: PluginOptions) => {
    devTransform: (code: string, id?: string) => string;
    devTransformIndexHtml: (html: string) => string;
    proTransformIndexHtml: (html: string) => string;
};
declare const legacyQiankun: (options: PluginOptions) => Plugin[];

export { convertVariable, createCtx, createLifecyle, getMicroApp, legacyQiankun };
