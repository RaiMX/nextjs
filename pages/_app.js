import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Router from 'next/router';

/** COMPONENTS */
import {AppProvider, AppContext, AppDispatchContext} from 'providers/app_provider';
import MainToolbar from 'components/common/toolbar/MainToolbar';
import MainSidebar from "components/common/sidebar/MainSidebar";

/** THIRD PARTY */
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NProgress from 'nprogress';
import 'public/css/nprogress.css';

/** MATERIAL */
import {ThemeProvider, makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from 'components/theme/theme';
import '@fontsource/roboto';
import {Container} from '@material-ui/core';


//NProgress.configure({ showSpinner: publicRuntimeConfig.NProgressShowSpinner });

Router.onRouteChangeStart = () => {
    // console.log('onRouteChangeStart triggered');
    NProgress.start();
};

Router.onRouteChangeComplete = () => {
    // console.log('onRouteChangeComplete triggered');
    NProgress.done();
};

Router.onRouteChangeError = () => {
    // console.log('onRouteChangeError triggered');
    NProgress.done();
};

const useStyles = makeStyles((theme) => ({
    appBarSpacer: theme.mixins.toolbar,
    container: {
        height: `calc(100% - 0px)`,
        paddingTop: theme.spacing(0),
        paddingBottom: theme.spacing(0),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}))

export default function MyApp(props) {
    const classes = useStyles();
    const {Component, pageProps} = props;

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>ТРА</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
                <meta charSet="utf-8"/>
                <link rel="stylesheet" type="text/css" href="/css/nprogress.css"/>
            </Head>

            <AppProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <MainToolbar/>
                    <MainSidebar/>
                    <div className={classes.appBarSpacer}/>
                    <Container maxWidth="xl" className={classes.container + ' pages-content'}>
                        <Component {...pageProps} />
                    </Container>
                </ThemeProvider>
            </AppProvider>

            <ToastContainer/>

        </React.Fragment>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};
