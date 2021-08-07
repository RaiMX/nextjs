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

const UserMenu = observer(function UserMenu({ user, open, anchor, onClose}) {
	const classes = useStyles();
	const store = useStore();

	const handleClose = () => {
		onClose()
	}

	if(!template) return null;

	return (
		<Popper style={{zIndex: 1000 }} open={open} anchorEl={anchor} role={undefined} transition disablePortal>
			{({TransitionProps, placement}) => (
				<Grow
					{...TransitionProps}
					style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
				>
					<Paper>
						<ClickAwayListener onClickAway={handleClose}>
							<MenuList autoFocusItem={open} id="admin-user-menu-list-grow">
								<MenuItem >{user.id}</MenuItem>
								<MenuItem onClick={logout}><FormattedMessage defaultMessage="Выйти"/></MenuItem>
							</MenuList>
						</ClickAwayListener>
					</Paper>
				</Grow>
			)}
		</Popper>
	);
})

export default UserMenu