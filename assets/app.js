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

window.subscribe = async e => {
	e.preventDefault()
	const submitButton = document.querySelector('[data-submit-button]')
	const formStatus = document.querySelector('[data-form-status]')
	submitButton.setAttribute('aria-busy', 'true')
	formStatus.innerText = ''
	const formData = new FormData(e.target)
	const { status } = await fetch('https://formcarry.com/s/qaY3xdswOK', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
		body: JSON.stringify(Object.fromEntries(formData)),
	})
	submitButton.removeAttribute('aria-busy')
	if (status < 399) {
		formStatus.innerText = 'Done!'
		e.target.reset()
	} else {
		formStatus.innerText = 'Failed. Try again?'
	}
}
