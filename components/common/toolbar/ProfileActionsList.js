import React from 'react';
import Router from 'next/router';

/** THIRD PARTY */
import {observer} from "mobx-react-lite";

/** HOOKS */
import {useStore} from 'store/store_provider'

/** COMPONENTS */
import {STATIC_ROUTES} from "utils/CONSTANTS";
import {logout} from "utils/auth";

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import {ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper} from "@material-ui/core";
import {FormattedMessage} from "react-intl";


const useStyles = makeStyles((theme) => ({
	root: {}
}))

const ProfileActionsList = observer(function ProfileActionsList({user_info, open, anchor, onClose}) {
	const classes = useStyles();
	const store = useStore();

	const handleProfileClose = () => {
		onClose()
	}

	const routeToUserProfile = () => {
		handleProfileClose();
		Router.push(STATIC_ROUTES.USER);
	}

	return (
		<Popper open={open} anchorEl={anchor} role={undefined} transition disablePortal>
			{({TransitionProps, placement}) => (
				<Grow
					{...TransitionProps}
					style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
				>
					<Paper>
						<ClickAwayListener onClickAway={handleProfileClose}>
							<MenuList autoFocusItem={open} id="menu-list-grow">
								<MenuItem disabled>{user_info?.user?.name && user_info.user.name}</MenuItem>
								<MenuItem onClick={routeToUserProfile}><FormattedMessage defaultMessage="Личный кабинет"/></MenuItem>
								<MenuItem onClick={logout}><FormattedMessage defaultMessage="Выйти"/></MenuItem>
							</MenuList>
						</ClickAwayListener>
					</Paper>
				</Grow>
			)}
		</Popper>
	);
})

export default ProfileActionsList