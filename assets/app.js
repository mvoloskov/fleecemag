const root = document.documentElement
const mediaDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const toggleDarkTheme = document.querySelector('[data-toggle-dark-theme]')

let savedTheme = window.localStorage.getItem('theme')
if (!savedTheme) {
	savedTheme = mediaDark ? 'dark' : 'light'
	window.localStorage.setItem('theme', savedTheme)
}

const darkMode = () => {
	root.classList.add('dark')
	toggleDarkTheme.innerText = 'Light theme'
	window.localStorage.setItem('theme', 'dark')
}

const lightMode = () => {
	root.classList.remove('dark')
	toggleDarkTheme.innerText = 'Dark theme'
	window.localStorage.setItem('theme', 'light')
}

if (savedTheme === 'dark') darkMode()
else lightMode()

toggleDarkTheme.onclick = () => {
	const isDark = root.classList.contains('dark')
	if (isDark) lightMode()
	else darkMode()
}
