import { watch } from 'chokidar'
import { generateArticles, generatePages, moveAssets } from './build.js'
import serve from 'serve-handler'
import { createServer } from 'http'

const has = (string, substrings) => {
	for (const substring of substrings) if (string.includes(substring)) return true
}

const watcher = watch(['articles', 'assets', 'templates'], { ignoreInitial: true })
watcher.on('all', (_event, path) => {
	if (has(path, ['assets'])) moveAssets()
	if (has(path, ['articles', 'article.njk', 'articles.njk', 'page.njk', 'macros.njk'])) generateArticles()
	if (has(path, ['auth.njk', 'index.njk', 'page.njk', 'macros.njk'])) generatePages()
})

const server = createServer(async (req, res) => {
	await serve(req, res, {
		public: 'public',
		cleanUrls: true,
		trailingSlash: false,
	})
})

server.listen(3000, () => console.log('http://localhost:3000'))
