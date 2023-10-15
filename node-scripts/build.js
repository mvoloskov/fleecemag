import fs from 'fs'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import nunjucks from 'nunjucks'

const currentYear = new Date().getFullYear()

const getReadtime = text => {
	const wordsPerMinute = 200
	const words = text.split(/\s+/).length
	const readtime = Math.ceil(words / wordsPerMinute)
	return Math.max(readtime, 1)
}

const md = new MarkdownIt({ html: true, typographer: true })
const getNjk = () =>
	nunjucks.configure('templates', {
		autoescape: true,
		trimBlocks: true,
		lstripBlocks: true,
	})

export const generateArticles = () => {
	const njk = getNjk()

	const articleFiles = fs.readdirSync('articles')
	const articles = []

	articleFiles.forEach(filename => {
		const article = fs.readFileSync(`articles/${filename}`, { encoding: 'utf8' })
		const { data, content } = matter(article)
		const html = md.render(content)
		const name = filename.split('.')[0]
		articles.push({ ...data, content, href: `/articles/${name}.html` })
		const [year] = name.split('-')
		const readtime = `~${getReadtime(content)} min.`
		const result = njk.render('article.njk', { year, readtime, html, currentYear, ...data })
		fs.writeFileSync(`public/articles/${name}.html`, result, { flag: 'w+' })
	})

	const articlesPage = njk.render('articles.njk', { articles, currentYear })
	fs.writeFileSync(`public/articles/index.html`, articlesPage, { flag: 'w+' })
	console.log(new Date(), 'Articles built')
}

export const generatePages = () => {
	const njk = getNjk()
	const index = njk.render('index.njk', { currentYear })
	fs.writeFileSync(`public/index.html`, index, { flag: 'w+' })

	const auth = njk.render('auth.njk', { currentYear })
	fs.writeFileSync(`public/auth.html`, auth, { flag: 'w+' })
	console.log(new Date(), 'Static pages generated')
}

export const moveAssets = () => {
	fs.cpSync('assets', 'public/assets', { recursive: true })
	console.log(new Date(), 'Assets moved')
}

generateArticles()
generatePages()
moveAssets()

/*
import chokidar from 'chokidar'
import { generateArticles } from './generateArticles.mjs'
import { generateProjects } from './generateProjects.mjs'
import { includesMultiple } from './lib.mjs'
import { generateIndex, reloadAssets } from './misc.mjs'

const watcher = chokidar.watch(['articles', 'assets', 'data', 'templates'], {
	ignoreInitial: true,
})

watcher.on('all', (_event, path) => {
	if (includesMultiple(path, ['projects.yaml', 'templates/projects.mustache']))
		return generateProjects()
	if (includesMultiple(path, ['data/articles', 'templates/article'])) return generateArticles()
	if (includesMultiple(path, ['templates/index'])) return generateIndex()
	if (includesMultiple(path, ['assets'])) return reloadAssets()
})


import fs from 'fs'
import matter from 'gray-matter'
import { render, md } from './lib.mjs'

export const generateArticles = () => {
	const articles = fs.readdirSync('data/articles')
	const sortedArticles = [...articles].sort().reverse()

	// extract article data
	const articlesData = sortedArticles.map(filename => {
		const article = fs.readFileSync(`data/articles/${filename}`, {
			encoding: 'utf8',
		})

		// content
		const { data: frontmatter, content } = matter(article)
		const html = md.render(content)

		// date
		const [name] = filename.split('.')
		const tuple = name.split('-')
		let date = [tuple[0], tuple[1], tuple[2]].join('-')

		// title
		const basicTitleLower = tuple.slice(3).join(' ')
		const basicTitle = basicTitleLower.charAt(0).toUpperCase() + basicTitleLower.slice(1)
		const realTitle = frontmatter.title
		const title = realTitle || basicTitle

		// href
		let href = `/articles/${name}.html`
		const path = `public/articles/${name}.html`

		const { comingSoon } = frontmatter

		if (comingSoon) {
			date = '--[SOON]--'
			href = '#'
		}

		return { ...frontmatter, comingSoon, html, date, title, href, path }
	})

	if (!fs.existsSync('public/articles')) fs.mkdirSync(`public/articles`)

	// generate individual pages
	const one = fs.readFileSync(`templates/article.mustache`, {
		encoding: 'utf8',
	})
	articlesData.forEach(article => {
		const { path, comingSoon } = article
		if (comingSoon) return
		const output = render(one, { ...article })
		fs.writeFileSync(path, output, { flag: 'w' })
	})

	// generate index.html for articles
	const all = fs.readFileSync(`templates/articles.mustache`, {
		encoding: 'utf8',
	})
	const output = render(all, { articles: articlesData })
	fs.writeFileSync(`public/articles/index.html`, output, { flag: 'w' })
}


import MarkdownIt from 'markdown-it'
import mustache from 'mustache'
import hljs from 'highlight.js'

export const md = new MarkdownIt({
	html: true,
	typographer: true,
	highlight: (str, language) => {
		if (language && hljs.getLanguage(language)) {
			return hljs.highlight(str, { language }).value
		}
		return ''
	},
})

export const render = (template, data) =>
	mustache.render(template, data, null, {
		escape: x => x,
	})

export const calculateAge = birthday => {
	var ageDifMs = Date.now() - birthday
	var ageDate = new Date(ageDifMs)
	return Math.abs(ageDate.getUTCFullYear() - 1970)
}

export const includesMultiple = (string, substrings) => {
	for (let i = 0; i < substrings.length; i++) {
		const substring = substrings[i]
		if (string.includes(substring)) return true
	}
	return false
}
*/
