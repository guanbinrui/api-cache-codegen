#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import fetch from 'node-fetch';
import { Validator } from 'jsonschema';

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
 * Fetches and caches the API data based on the provided configuration.
 * @param apiConfig The configuration for the API to be fetched and cached.
 */
async function fetchAndCache(apiConfig: ApiConfig) {
    try {
        const response = await fetch(apiConfig.input);
        const data = await response.json();
        const outputPath = path.resolve(
            process.cwd(),
            `${apiConfig.output}${apiConfig.generator.key}.json`
        );

        if (apiConfig.generator.src) {
            // Execute the custom generator script
            const customGeneratorOutput = execSync(
                `node ${apiConfig.generator.src}`
            ).toString();
            await fs.writeFile(outputPath, customGeneratorOutput);
        } else {
            await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
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
}

/**
 * Processes a list of APIs based on the provided configuration.
 * @param config The configuration containing the list of APIs to be processed.
 */
export async function processApis(config: Config) {
    for (const apiConfig of config.list) {
        await fetchAndCache(apiConfig);
    }
}

// Define the main command
program
    .version(require('./package.json').version)
    .description('API Cache Code Generation CLI');

// Define a subcommand for processing APIs
program
    .command('process')
    .description('Fetch and cache APIs based on config')
    .option(
        '-c, --config <path>',
        'Path to the config file',
        './.cache-codegen.json'
    )
    .action(async (options) => {
        try {
            const configPath = path.resolve(process.cwd(), options.config);
            const configContent = await fs.readFile(configPath, 'utf8');
            const config: Config = JSON.parse(configContent);

            // Load and validate JSON schema
            const validator = new Validator();
            const schemaPath = path.resolve(process.cwd(), config.$schema);
            const schemaContent = await fs.readFile(schemaPath, 'utf8');
            const schema = JSON.parse(schemaContent);
            const validationResult = validator.validate(config, schema);

            if (!validationResult.valid) {
                console.error(
                    'Invalid configuration:',
                    validationResult.errors
                );
                return;
            }

            await processApis(config);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    });

// Parse the command line arguments if the script is being run directly
if (require.main === module) {
    program.parse(process.argv);
}
