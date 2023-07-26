/** @type {import('next').NextConfig} */
const nextConfig = {
	async headers() {
		return [
			{
				// matching all API routes
				source: "/api/:path*",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{ key: "Access-Control-Allow-Origin", value: "http://localhost:4042" }, // replace this your actual origin
					{ key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
					{ key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
				]
			}
		]
	},
	reactStrictMode: false,
  	experimental: {
    	appDir: true,
	},
}

module.exports = nextConfig

module.exports = {
	env: {
		AUTH42_LINK: 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-aa5d8309b6b27376450bca3448b574204c7acdda1ce41b13633cbbe4ac91dc90&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fauth%2Fcallback&response_type=code',
		SITE_URL: 'http://localhost'
	},
};