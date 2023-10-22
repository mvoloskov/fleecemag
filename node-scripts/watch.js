import { watch } from 'chokidar'
import serve from 'serve-handler'
import { createServer } from 'http'
import { networkInterfaces } from 'os'
import { generateArticles, generatePages, moveAssets } from './build.js'

const getIp = () => {
	const interfaces = Object.values(networkInterfaces())
	for (const x of interfaces) for (const { address } of x) if (address.startsWith('192')) return address
}

const has = (string, substrings) => {
	for (const substring of substrings) if (string.includes(substring)) return true
}

const watcher = watch(['articles', 'assets', 'templates'], { ignoreInitial: true })
watcher.on('all', (_event, path) => {
	if (has(path, ['assets'])) moveAssets()
	if (has(path, ['articles', 'article.njk', 'articles.njk', 'page.njk', 'macros.njk'])) generateArticles()
	if (has(path, ['auth.njk', 'index.njk', 'page.njk', 'macros.njk'])) generatePages()
})

const server = createServer((req, res) => serve(req, res, { public: 'public', cleanUrls: true }))
server.listen(3000, () => console.log(new Date(), `http://localhost:3000, http://${getIp()}:3000`))
