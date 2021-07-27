const protocol = 'http'
const host = 'localhost'
const host_port = 5000
const api_version = 'v1'

const base_url = `${protocol}://${host}:${host_port}/api/${api_version}`;

const base_settings = {
	env: {
		HOST: host,
		HOST_PORT: host_port,
		BASE_URL: base_url,
		LOGIN_URL: `${base_url}/auth/login`,
		REGISTER_URL: `${base_url}/auth/register`,
		REFRESH_TOKEN_URL: `${base_url}/auth/refresh-tokens`,
		FORGOT_PASS_URL: `${base_url}/auth/forgot-password`,
		CHANGE_PASS_URL: `${base_url}/auth/change-password`,
		RESET_PASS_URL: `${base_url}/auth/reset-password`,
		SEND_VERIFICATION_EMAIL_URL: `${base_url}/auth/send-verification-email`,
		VERIFY_EMAIL_URL: `${protocol}://${base_url}/auth/verify-email`,
	},
	i18n: {
		locales: ['ru', 'kk'],
		defaultLocale: 'ru',
	},
}

let settings;
if(process.env.NODE_ENV === 'development'){
	settings = base_settings;
}else{
	const withPWA = require('next-pwa')
	const runtimeCaching = require('next-pwa/cache')

	settings = withPWA({
		...base_settings,
		pwa: {
			dest: 'public',
			runtimeCaching,
		}
	})
}

module.exports = settings;