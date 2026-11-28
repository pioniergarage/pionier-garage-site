import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:http';

const collections = new Set(['events', 'startups']);

const server = createServer((request, response) => {
    const url = new URL(request.url, 'http://127.0.0.1');
    const match = /^\/api\/collections\/([^/]+)\/records$/.exec(url.pathname);

    response.setHeader('Content-Type', 'application/json');
    if (request.method !== 'GET' || !match || !collections.has(match[1])) {
        response.writeHead(404).end(
            JSON.stringify({
                message: `No build fixture for ${request.method} ${url.pathname}`,
            })
        );
        return;
    }

    response.end(
        JSON.stringify({
            page: Number(url.searchParams.get('page') || 1),
            perPage: Number(url.searchParams.get('perPage') || 500),
            totalItems: 0,
            totalPages: 0,
            items: [],
        })
    );
});

async function build() {
    try {
        await once(server.listen(0, '127.0.0.1'), 'listening');
        const child = spawn(
            process.execPath,
            [process.env.npm_execpath, 'run', 'build'],
            {
                env: {
                    ...process.env,
                    PUBLIC_POCKETBASE_URL: `http://127.0.0.1:${server.address().port}`,
                },
                stdio: 'inherit',
            }
        );
        const [exitCode] = await once(child, 'exit');
        process.exitCode = exitCode ?? 1;
    } finally {
        server.close();
    }
}

build().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
