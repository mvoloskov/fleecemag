import chokidar from 'chokidar'
import { generateArticles, generatePages, moveAssets } from './build.js'

export const includesMultiple = (string, substrings) => {
	for (const substring of substrings) if (string.includes(substring)) return true
}

const watcher = chokidar.watch(['articles', 'assets', 'templates'], {
	ignoreInitial: true,
})

watcher.on('all', (_event, path) => {
	if (includesMultiple(path, ['assets'])) return moveAssets()
	if (includesMultiple(path, ['articles', 'article.njk', 'articles.njk', 'page.njk', 'macros.njk'])) return generateArticles()
	if (includesMultiple(path, ['auth.njk', 'index.njk', 'page.njk', 'macros.njk'])) return generatePages()
})
