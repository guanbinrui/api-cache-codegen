import { it, expect } from 'vitest';
import { processApis } from '../cli';

it('should process APIs correctly', async () => {
    const mockConfig = {
        $schema: '...',
        version: 1,
        list: [
            {
                $schema: '...',
                input: 'https://jsonplaceholder.typicode.com/todos/1',
                output: './cache_generated/',
                generator: {
                    src: './generate_or_fetch_something.js',
                    key: 'api',
                    ttl: 1800,
                },
            },
        ],
    };

    // Mock any necessary functions or modules here

    await expect(processApis(mockConfig)).resolves.not.toThrow();
});
