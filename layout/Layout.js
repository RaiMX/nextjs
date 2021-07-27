import React from 'react';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';

/** COMPONENTS */
import { STATIC_ROUTES } from "utils/CONSTANTS";
import { AppContext } from 'providers/app_provider';
import MainToolbar from 'components/common/toolbar/MainToolbar';
import MainSidebar from "components/common/sidebar/MainSidebar";
import { checkTokens } from "utils/auth";

/** THIRD PARTY */
/** MATERIAL */
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Container } from '@material-ui/core';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

//check if you are on the client (browser) or server
const isBrowser = () => typeof window !== "undefined";

const useStyles = makeStyles((theme) => ({
	appBarSpacer: theme.mixins.toolbar,
	container: {
		height: `calc(100% - 0px)`,
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(0),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},
}))

export default function Layout({ Component, pageProps }) {
	const classes = useStyles();

	const router = useRouter();
	const { app_conf, user_info } = React.useContext(AppContext);

	const [page_loading, setPageLoading] = React.useState(false);
	const [is_authenticated, setIsAuthenticated] = React.useState(true);

	const handlePageLoadStarted = (url) => {
		// console.log('page started', url)
		setPageLoading(true);
	}

	const handlePageLoadCompleted = (url) => {
		setPageLoading(false);
	}

	React.useEffect(() => {
		router.events.on('routeChangeStart', handlePageLoadStarted);
		router.events.on('routeChangeComplete', handlePageLoadCompleted)
		router.events.on('routeChangeError', handlePageLoadCompleted)

		checkTokens().then(_is_authenticated => {
			setIsAuthenticated(_is_authenticated);
		})

		return () => {
			router.events.off('routeChangeStart', handlePageLoadStarted)
			router.events.off('routeChangeComplete', handlePageLoadCompleted)
			router.events.off('routeChangeError', handlePageLoadCompleted)
		}

	}, [])

	React.useEffect(() => {
		if (isBrowser() && !is_authenticated) {
			Router.push(STATIC_ROUTES.LOGIN)
		}
	}, [is_authenticated])

	return (
		<React.Fragment>
			<Head>
				<title>{app_conf.route_name}</title>
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
				/>
				<meta charSet="utf-8" />

				{process.env.NODE_ENV === 'production' ? (
					<>
						<link rel="manifest" href="/manifest.json" />
						<link
							href="/icons/favicon-16x16.png"
							rel="icon"
							type="image/png"
							sizes="16x16"
						/>
						<link
							href="/icons/favicon-32x32.png"
							rel="icon"
							type="image/png"
							sizes="32x32"
						/>
						<link rel="apple-touch-icon" href="/apple-icon.png"></link>
					</>
				) : null}

				<link rel="stylesheet" type="text/css" href="/css/nprogress.css" />
			</Head>
			<CssBaseline />

			{app_conf.toolbar_show ? (
				<React.Fragment>
					<div className={classes.appBarSpacer} />
					<MainToolbar />
				</React.Fragment>
			) : null}

			<MainSidebar />

			<Container maxWidth="xl" className={classes.container + ' pages-content'}>
				{
					page_loading ? (
						<Container maxWidth="sm">
							<Box my={4}>
								<Typography variant="h4" component="h1" gutterBottom>
									Загрузка страницы
								</Typography>
							</Box>
						</Container>
					)
						: is_authenticated ? <Component {...pageProps} />
							: <div></div>
				}
			</Container>
		</React.Fragment>
	);
}