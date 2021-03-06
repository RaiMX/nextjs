import React from 'react';

/** THIRD PARTY */

/** COMPONENTS */
import {AppContext, AppDispatchContext} from "providers/app_provider";
import LanguageSwitcher from "./LanguageSwitcher";
import NotificationsList from "./NotificationsList";
import ProfileActionsList from "./ProfileActionsList";


/** MATERIAL */
import clsx from 'clsx';
import {AppBar, Badge, IconButton, makeStyles, Toolbar, Tooltip, Typography,} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';


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
		marginRight: '20px',
	},
	spacer: {
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

	const {app_conf, user_info} = React.useContext(AppContext);
	const {setAppConf} = React.useContext(AppDispatchContext);

	const [notifications_anchor, setNotificationsAnchor] = React.useState(null);
	const [profile_anchor, setProfileAnchor] = React.useState(null);

	const open_notifications = Boolean(notifications_anchor);
	const open_profile = Boolean(profile_anchor);

	const handleNotificationsShow = (e) => {
		setNotificationsAnchor(e.currentTarget);
	}
	const handleNotificationsClose = (e) => {
		setNotificationsAnchor(null);
	}

	const handleProfileShow = (e) => {
		setProfileAnchor(e.currentTarget);
	}

	const handleProfileClose = (e) => {
		setProfileAnchor(null);
	}

	return (
		<AppBar position="absolute" className={clsx(classes.appBar)}>
			<Toolbar className={classes.toolbar} variant={"dense"}>
				<Tooltip title="????????">
					<IconButton
						edge="start"
						color="inherit"
						aria-label="open drawer"
						onClick={() => setAppConf(conf => ({...conf, sidebar_open: true}))}
						className={clsx(classes.menuButton, app_conf.sidebar_open && classes.menuButtonHidden)}
					>
						<MenuIcon/>
					</IconButton>
				</Tooltip>

				<Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
					{app_conf.route_name}
				</Typography>

				<div className={classes.spacer}/>
				<LanguageSwitcher/>

				{/*<Typography*/}
				{/*    onMouseOver={handleProfileShow}*/}
				{/*>*/}
				{/*    {token_info?.last_name && token_info.last_name + ' '}*/}
				{/*    {token_info?.first_name && token_info.first_name.charAt(0) + '. '}*/}
				{/*    {token_info?.middle_name && token_info.middle_name.charAt(0) + '. '}*/}
				{/*    ({token_info?.username && token_info.username})*/}
				{/*</Typography>*/}

				{/*<Tooltip title="???????????????? ???? ????????????????">*/}
				{/*    <IconButton color="inherit" onClick={() => startTour()}>*/}
				{/*        <HelpOutlineIcon/>*/}
				{/*    </IconButton>*/}
				{/*</Tooltip>*/}

				{user_info ? (
					<>
						<Tooltip title="?????????????? ????????????" placement="left">
							<IconButton color="inherit" onClick={handleProfileShow}>
								<AccountCircleIcon/>
							</IconButton>
						</Tooltip>

						<Tooltip title="??????????????????????" placement="left">
							<IconButton color="inherit" onClick={handleNotificationsShow}>
								<Badge badgeContent={3} color="secondary">
									<NotificationsIcon/>
								</Badge>
							</IconButton>
						</Tooltip>

						<ProfileActionsList user_info={user_info} open={open_profile} anchor={profile_anchor} onClose={handleProfileClose}/>
						<NotificationsList user_info={user_info} open={open_notifications} anchor={notifications_anchor} onClose={handleNotificationsClose}/>
					</>
				) : null}

			</Toolbar>
		</AppBar>
	);
}