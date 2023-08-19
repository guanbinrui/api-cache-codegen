interface GeneratorConfig {
    src?: string;
    key: string;
    ttl: number;
}
interface ApiConfig {
    $schema?: string;
    input: string;
    output: string;
    generator: GeneratorConfig;
}
interface Config {
    $schema: string;
    version: number;
    list: ApiConfig[];
}
/**
 * Processes a list of APIs based on the provided configuration.
 * @param config The configuration containing the list of APIs to be processed.
 */
export declare function processApis(config: Config): Promise<void>;
export {};
