import React from 'react'
import {useRouter} from 'next/router'

/** COMPONENTS */
import {AppContext, AppDispatchContext} from "providers/app_provider";
import MainMenu from "../menu/MainMenu";

/** THIRD PARTY */
import {FormattedMessage} from 'react-intl';

/** MATERIAL */
import clsx from 'clsx';
import {makeStyles, Drawer, IconButton, Divider} from "@material-ui/core";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        height: '20px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: 'fit-content',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        height: `calc(100% - 70px)`,
        paddingTop: theme.spacing(0),
        paddingBottom: theme.spacing(0),
        paddingLeft: theme.spacing(0),
        paddingRight: theme.spacing(0),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: '100%',
    },
}));


export default function MainSidebar() {
    const classes = useStyles();

    const router = useRouter()
    const app_context = React.useContext(AppContext);
    const {setAppConf} = React.useContext(AppDispatchContext);

    const menu = [{
        name: <FormattedMessage defaultMessage="О Нас"/>,
        to: '/about'
    }]

    React.useEffect(() => {
        setAppConf(conf => ({...conf, sidebar_open: false}));
    }, [router.pathname]);

    return (
        <Drawer
            variant="temporary"
            classes={{
                paper: clsx(classes.drawerPaper),
            }}
            open={app_context.sidebar_open}
            onClose={() => setAppConf(conf => ({...conf, sidebar_open: false}))}
        >
            <div className={classes.toolbarIcon}>
                <IconButton onClick={() => setAppConf(conf => ({...conf, sidebar_open: false}))}>
                    <ChevronLeftIcon/>
                </IconButton>
            </div>
            <Divider/>
            <MainMenu menu_items={menu}/>
        </Drawer>
    )
}