import React from 'react';
import Head from 'next/head';

/** COMPONENTS */
import {AppContext, AppDispatchContext} from 'providers/app_provider';
import MainToolbar from 'components/common/toolbar/MainToolbar';
import MainSidebar from "components/common/sidebar/MainSidebar";

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Container} from '@material-ui/core';
import {IntlProvider} from "react-intl";

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

    const {app_conf} = React.useContext(AppContext);

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
                <Component {...pageProps} />
            </Container>
        </React.Fragment>
    );
}