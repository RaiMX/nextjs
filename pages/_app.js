import React from 'react';
import PropTypes from 'prop-types';

import {useRouter} from 'next/router';

/** COMPONENTS */
import {STATIC_ROUTES} from "utils/CONSTANTS";
import {AppProvider} from 'providers/app_provider';
import Layout from 'layout/Layout';
import {StoreProvider} from 'store/store_provider'
import Login from "./login";
import Register from "./register";

/** THIRD PARTY */
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'public/css/nprogress.css';
import {IntlProvider} from 'react-intl';


/** MATERIAL */
import {ThemeProvider} from '@material-ui/core/styles';
import theme from 'components/theme/theme';
import '@fontsource/roboto';


//NProgress.configure({ showSpinner: publicRuntimeConfig.NProgressShowSpinner });

// Router.onRouteChangeStart = () => {
//     // console.log('onRouteChangeStart triggered');
//     NProgress.start();
// };
//
// Router.onRouteChangeComplete = () => {
//     // console.log('onRouteChangeComplete triggered');
//     NProgress.done();
// };
//
// Router.onRouteChangeError = () => {
//     // console.log('onRouteChangeError triggered');
//     NProgress.done();
// };

const languages = {
	ru: require('content/locales/ru.json'),
	kk: require('content/locales/kk.json')
};

export default function MyApp({Component, pageProps}) {
	/** LOCALIZATION */
	const {locale, defaultLocale, pathname} = useRouter();
	const [shortLocale] = locale ? locale.split("-") : ["ru"];

	const messages = React.useMemo(() => {
		switch (shortLocale) {
			case "ru":
				return languages.ru;
			case "kk":
				return languages.kk;
			default:
				return languages.ru;
		}
	}, [shortLocale]);

	/** END LOCALIZATION */

	React.useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles);
		}

	}, []);


	return (
		<React.Fragment>
			<StoreProvider {...pageProps}>
				<AppProvider>
					<ThemeProvider theme={theme}>
						<IntlProvider
							locale={shortLocale}
							messages={messages}
							onError={() => null}
						>
							{
								[`${shortLocale}${STATIC_ROUTES.LOGIN}`, STATIC_ROUTES.LOGIN].indexOf(pathname) > -1 ? <Login/>
									: [`${shortLocale}${STATIC_ROUTES.REGISTER}`, STATIC_ROUTES.REGISTER].indexOf(pathname) > -1 ? <Register/>
									: <Layout Component={Component} pageProps={pageProps}/>
							}

						</IntlProvider>
					</ThemeProvider>
				</AppProvider>
			</StoreProvider>

			<ToastContainer autoClose={10000}/>

		</React.Fragment>
	);
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
};
