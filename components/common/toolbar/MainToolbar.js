import React from 'react';

/** COMPONENTS */
import {AppContext, AppDispatchContext} from "providers/app_provider";
import LanguageSwitcher from "./LanguageSwitcher";

/** MATERIAL */
import clsx from 'clsx';
import {
    makeStyles, AppBar, Toolbar, Tooltip, IconButton, Typography, Badge,
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


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

export default function MainToolbar() {
    const classes = useStyles();

    const app_context = React.useContext(AppContext);
    const {setAppConf} = React.useContext(AppDispatchContext);

    return (
        <AppBar position="absolute" className={clsx(classes.appBar)}>
            <Toolbar className={classes.toolbar} variant={"dense"}>
                <Tooltip title="Меню">
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setAppConf(conf => ({...conf, sidebar_open: true}))}
                        className={clsx(classes.menuButton, app_context.sidebar_open && classes.menuButtonHidden)}
                    >
                        <MenuIcon/>
                    </IconButton>
                </Tooltip>

                <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                    Page Name
                </Typography>

                <LanguageSwitcher/>

                {/*<Typography*/}
                {/*    onMouseOver={handleProfileShow}*/}
                {/*>*/}
                {/*    {token_info?.last_name && token_info.last_name + ' '}*/}
                {/*    {token_info?.first_name && token_info.first_name.charAt(0) + '. '}*/}
                {/*    {token_info?.middle_name && token_info.middle_name.charAt(0) + '. '}*/}
                {/*    ({token_info?.username && token_info.username})*/}
                {/*</Typography>*/}

                {/*<Tooltip title="Обучение на странице">*/}
                {/*    <IconButton color="inherit" onClick={() => startTour()}>*/}
                {/*        <HelpOutlineIcon/>*/}
                {/*    </IconButton>*/}
                {/*</Tooltip>*/}

                {/*<Tooltip title="Уведомления">*/}
                {/*    <IconButton color="inherit" onClick={handleNotificationsShow}>*/}
                {/*        <Badge badgeContent={notifications_unread_count} color="secondary">*/}
                {/*            <NotificationsIcon/>*/}
                {/*        </Badge>*/}
                {/*    </IconButton>*/}
                {/*</Tooltip>*/}

                {/*<Tooltip title="Выйти">*/}
                {/*    <IconButton color="inherit" onClick={() => logout()}>*/}
                {/*        <ExitToAppIcon/>*/}
                {/*    </IconButton>*/}
                {/*</Tooltip>*/}

                {/*<Popover*/}
                {/*    open={open_profile}*/}
                {/*    anchorEl={profile_anchor}*/}
                {/*    onClose={handleProfileClose}*/}
                {/*    anchorOrigin={{*/}
                {/*        vertical: 'bottom',*/}
                {/*        horizontal: 'right',*/}
                {/*    }}*/}
                {/*    transformOrigin={{*/}
                {/*        vertical: 'top',*/}
                {/*        horizontal: 'right',*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <React.Fragment>*/}
                {/*        <List component="nav">*/}
                {/*            <ListItem button dense*/}
                {/*                      onClick={() => history.push('/change-password')}*/}
                {/*            >*/}
                {/*                <ListItemText primary={"Изменить пароль"}/>*/}
                {/*            </ListItem>*/}
                {/*        </List>*/}
                {/*    </React.Fragment>*/}
                {/*</Popover>*/}

                {/*<Popover*/}
                {/*    open={open_notifications}*/}
                {/*    anchorEl={notifications_anchor}*/}
                {/*    onClose={handleNotificationsClose}*/}
                {/*    anchorOrigin={{*/}
                {/*        vertical: 'bottom',*/}
                {/*        horizontal: 'right',*/}
                {/*    }}*/}
                {/*    transformOrigin={{*/}
                {/*        vertical: 'top',*/}
                {/*        horizontal: 'right',*/}
                {/*    }}*/}
                {/*>*/}
                {/*    {unread_notifications.length === 0 ? <Box style={{padding: '10px'}}><Typography>Новые уведомления отсутствуют</Typography></Box> :*/}
                {/*        <React.Fragment>*/}
                {/*            <List style={{minWidth: '500px', maxWidth: '500px'}}>*/}

                {/*                <Link*/}
                {/*                    style={{marginLeft: '20px'}}*/}
                {/*                    component="button"*/}
                {/*                    variant="body2"*/}
                {/*                    onClick={() => {*/}
                {/*                        markAllAsRead()*/}
                {/*                            .then(() => {*/}
                {/*                                getUnreadCount().then(count => setNotificationsUnreadCount(count))*/}
                {/*                                getUnreadNotifications().then(items => {*/}
                {/*                                    setUnreadNotifications(items);*/}
                {/*                                })*/}
                {/*                            })*/}
                {/*                            .catch(error => console.log(error))*/}
                {/*                    }}*/}
                {/*                >*/}
                {/*                    Отметит все как "прочитано"*/}
                {/*                </Link>*/}


                {/*                {unread_notifications.map((item, index) => {*/}
                {/*                    return (*/}
                {/*                        <ListItem key={item.id} role={undefined} dense>*/}
                {/*                            <ListItemText primary={item.verb}/>*/}

                {/*                            <ListItemSecondaryAction>*/}
                {/*                                {item.description !== undefined || item.description !== '' || item.description !== 'NULL' ? (*/}
                {/*                                    <IconButton edge="end" aria-label="view-results"*/}
                {/*                                                onClick={() => {*/}
                {/*                                                    markAsRead(item.id)*/}
                {/*                                                        .then(() => {*/}
                {/*                                                            getUnreadCount().then(count => setNotificationsUnreadCount(count))*/}
                {/*                                                            getUnreadNotifications().then(items => {*/}
                {/*                                                                setUnreadNotifications(items);*/}
                {/*                                                            })*/}
                {/*                                                        })*/}
                {/*                                                        .catch(error => console.log(error))*/}

                {/*                                                    const meta = JSON.parse(item.description);*/}
                {/*                                                    if (meta?.request_id) {*/}
                {/*                                                        history.push('/face-detect?request_ids[]=' + meta.request_id)*/}
                {/*                                                    }*/}
                {/*                                                }}>*/}
                {/*                                        <VisibilityIcon/>*/}
                {/*                                    </IconButton>*/}
                {/*                                ) : null}*/}

                {/*                                <IconButton edge="end" aria-label="mark-as-read"*/}
                {/*                                            onClick={() => {*/}
                {/*                                                markAsRead(item.id)*/}
                {/*                                                    .then(() => {*/}
                {/*                                                        getUnreadCount().then(count => setNotificationsUnreadCount(count))*/}
                {/*                                                        getUnreadNotifications().then(items => {*/}
                {/*                                                            setUnreadNotifications(items);*/}
                {/*                                                        })*/}
                {/*                                                    })*/}
                {/*                                                    .catch(error => console.log(error))*/}
                {/*                                            }}>*/}
                {/*                                    <DoneAllIcon/>*/}
                {/*                                </IconButton>*/}
                {/*                            </ListItemSecondaryAction>*/}
                {/*                        </ListItem>*/}
                {/*                    )*/}
                {/*                })}*/}
                {/*            </List>*/}

                {/*        </React.Fragment>*/}
                {/*    }*/}

                {/*</Popover>*/}

            </Toolbar>
        </AppBar>
    )
}