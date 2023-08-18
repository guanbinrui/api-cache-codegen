const { processApis } = require('../dist/cli'); // Use require instead of import

describe('processApis', () => {
    it('should process APIs correctly', async () => {
        const mockConfig = {
            $schema: '...',
            version: 1,
            list: [
                {
                    $schema: '...',
                    input: 'https://example.com/api.json',
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
});
