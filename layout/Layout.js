import React from 'react';
import Head from 'next/head';

import {useRouter} from "next/router";

/** COMPONENTS */
import {AppContext} from 'providers/app_provider';
import MainToolbar from 'components/common/toolbar/MainToolbar';
import MainSidebar from "components/common/sidebar/MainSidebar";

/** THIRD PARTY */

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Container} from '@material-ui/core';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";


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

export default function Layout({Component, pageProps}) {
	const classes = useStyles();

	const router = useRouter();
	const {app_conf} = React.useContext(AppContext);

	const [page_loading, setPageLoading] = React.useState(false);

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

		return () => {
			router.events.off('routeChangeStart', handlePageLoadStarted)
			router.events.off('routeChangeComplete', handlePageLoadCompleted)
			router.events.off('routeChangeError', handlePageLoadCompleted)
		}

	}, [])

	return (
		<React.Fragment>
			<Head>
				<title>{app_conf.route_name}</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
				<meta charSet="utf-8"/>
				<link rel="stylesheet" type="text/css" href="/css/nprogress.css"/>
			</Head>
			<CssBaseline/>

			{app_conf.toolbar_show ? (
				<React.Fragment>
					<div className={classes.appBarSpacer}/>
					<MainToolbar/>
				</React.Fragment>
			) : null}

			<MainSidebar/>

			<Container maxWidth="xl" className={classes.container + ' pages-content'}>
				{page_loading ? (
					<Container maxWidth="sm">
						<Box my={4}>
							<Typography variant="h4" component="h1" gutterBottom>
								Загрузка страницы
							</Typography>
						</Box>
					</Container>
				) : <Component {...pageProps} />}
			</Container>
		</React.Fragment>
	);
}