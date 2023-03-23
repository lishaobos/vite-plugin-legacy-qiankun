import { Plugin } from 'vite';

type PluginOptions = {
    name: string;
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
declare const getMicroApp: (appName: string) => MicroApp;
declare const createLifecyle: (name: string, lifecyle: Lifecyle) => void;
declare const legacyQiankun: ({ name }: PluginOptions) => Plugin[];

export { createLifecyle, getMicroApp, legacyQiankun };
