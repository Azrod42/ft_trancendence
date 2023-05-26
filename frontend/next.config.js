/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
  	experimental: {
    	appDir: true,
	},
}

module.exports = nextConfig

module.exports = {
	env: {
		AUTH42_LINK1: 'https://api.intra.42.fr/oauth/authorize?client_id=',
		AUTH42_LINK2: '&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fauth%2Fcallback&response_type=code',
		AUTH42_UID: 'u-s4t2ud-aa5d8309b6b27376450bca3448b574204c7acdda1ce41b13633cbbe4ac91dc90'
	},
};