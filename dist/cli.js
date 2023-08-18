#!/usr/bin/env node
'use strict';
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            );
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.processApis = void 0;
const commander_1 = require('commander');
const promises_1 = __importDefault(require('fs/promises'));
const path_1 = __importDefault(require('path'));
const child_process_1 = require('child_process');
const node_fetch_1 = __importDefault(require('node-fetch'));
const jsonschema_1 = require('jsonschema');
/**
 * Fetches and caches the API data based on the provided configuration.
 * @param apiConfig The configuration for the API to be fetched and cached.
 */
function fetchAndCache(apiConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)(apiConfig.input);
            const data = yield response.json();
            const outputPath = path_1.default.resolve(
                process.cwd(),
                `${apiConfig.output}${apiConfig.generator.key}.json`
            );
            if (apiConfig.generator.src) {
                // Execute the custom generator script
                const customGeneratorOutput = (0, child_process_1.execSync)(
                    `node ${apiConfig.generator.src}`
                ).toString();
                yield promises_1.default.writeFile(
                    outputPath,
                    customGeneratorOutput
                );
            } else {
                yield promises_1.default.writeFile(
                    outputPath,
                    JSON.stringify(data, null, 2)
                );
            }
            console.log(
                `API '${apiConfig.generator.key}' fetched and cached successfully.`
            );
        } catch (error) {
            console.error(
                `An error occurred while processing API '${apiConfig.generator.key}':`,
                error
            );
        }
    });
}
/**
 * Processes a list of APIs based on the provided configuration.
 * @param config The configuration containing the list of APIs to be processed.
 */
function processApis(config) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const apiConfig of config.list) {
            yield fetchAndCache(apiConfig);
        }
    });
}
exports.processApis = processApis;
// Define the main command
commander_1.program
    .version(require('./package.json').version)
    .description('API Cache Code Generation CLI');
// Define a subcommand for processing APIs
commander_1.program
    .command('process')
    .description('Fetch and cache APIs based on config')
    .option(
        '-c, --config <path>',
        'Path to the config file',
        './.cache-codegen.json'
    )
    .action((options) =>
        __awaiter(void 0, void 0, void 0, function* () {
            try {
                const configPath = path_1.default.resolve(
                    process.cwd(),
                    options.config
                );
                const configContent = yield promises_1.default.readFile(
                    configPath,
                    'utf8'
                );
                const config = JSON.parse(configContent);
                // Load and validate JSON schema
                const validator = new jsonschema_1.Validator();
                const schemaPath = path_1.default.resolve(
                    process.cwd(),
                    config.$schema
                );
                const schemaContent = yield promises_1.default.readFile(
                    schemaPath,
                    'utf8'
                );
                const schema = JSON.parse(schemaContent);
                const validationResult = validator.validate(config, schema);
                if (!validationResult.valid) {
                    console.error(
                        'Invalid configuration:',
                        validationResult.errors
                    );
                    return;
                }
                yield processApis(config);
            } catch (error) {
                console.error('An error occurred:', error);
            }
        })
    );
// Parse the command line arguments if the script is being run directly
if (require.main === module) {
    commander_1.program.parse(process.argv);
}
