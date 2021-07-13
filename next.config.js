const protocol = 'http'
const host = 'localhost'
const host_port = 5000
const api_version = 'v1'

module.exports = {
	env: {
		HOST: host,
		HOST_PORT: host_port,
		BASE_URL: `${protocol}://${host}:${host_port}/${api_version}`,
		LOGIN_URL: `${protocol}://${host}:${host_port}/${api_version}/auth/login`,
		REGISTER_URL: `${protocol}://${host}:${host_port}/${api_version}/auth/register`,
		REFRESH_TOKEN_URL: `${protocol}://${host}:${host_port}/${api_version}/auth/refresh-tokens`,
		FORGOT_PASS_URL: `${protocol}://${host}:${host_port}/${api_version}/auth/forgot-password`,
		RESET_PASS_URL: `${protocol}://${host}:${host_port}/${api_version}/auth/reset-password`,
		SEND_VERIFICATION_EMAIL_URL: `${protocol}://${host}:${host_port}/${api_version}/auth/send-verification-email`,
		VERIFY_EMAIL_URL: `${protocol}://${host}:${host_port}/${api_version}/auth/verify-email`,
	},
	i18n: {
		locales: ['ru', 'kk'],
		defaultLocale: 'ru',
	},
}