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
	const njk = getNjk() // bump

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
