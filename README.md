# API Cache Code Generation CLI

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/guanbinrui/api-cache-codegen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A CLI tool to fetch and cache APIs as static files.

## Installation

```bash
npm install -g api-cache-codegen
```

## Usage

```bash
api-cache-process -c config.json
```

Replace `api-cache-process` with the actual command to run the CLI tool and `config.json` with the path to your configuration file.

## Configuration

Create a JSON configuration file, e.g., `config.json`, with the following structure:

```json
{
    "$schema": "https://raw.githubusercontent.com/guanbinrui/api-cache-codegen/main/schema.json",
    "version": 1,
    "list": [
        {
            "$schema": "https://raw.githubusercontent.com/guanbinrui/api-cache-codegen/main/schema.json",
            "input": "https://example.com/api.json",
            "output": "./cache_generated/",
            "generator": {
                "src": "./generate_or_fetch_something.js",
                "key": "api",
                "ttl": 1800
            }
        }
    ]
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
