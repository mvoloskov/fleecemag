const root = document.documentElement
const mediaDark = window.matchMedia('(prefers-color-scheme: dark)').matches

let savedTheme = window.localStorage.getItem('theme')
if (!savedTheme) {
	savedTheme = mediaDark ? 'dark' : 'light'
	window.localStorage.setItem('theme', savedTheme)
}

const darkMode = () => {
	root.classList.add('dark')
	window.localStorage.setItem('theme', 'dark')
}

const lightMode = () => {
	root.classList.remove('dark')
	window.localStorage.setItem('theme', 'light')
}

if (savedTheme === 'dark') darkMode()
else lightMode()

setTimeout(() => {
	const root = document.documentElement
	root.style.setProperty('--bg-transition', 'background var(--transition-duration)')
	root.style.transition = 'var(--root-transition)'
})

window.toggleTheme = () => {
	const isDark = root.classList.contains('dark')
	if (isDark) lightMode()
	else darkMode()
}
