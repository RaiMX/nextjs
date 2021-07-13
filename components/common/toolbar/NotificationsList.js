import React from 'react';

/** THIRD PARTY */
import {observer} from "mobx-react-lite";

/** HOOKS */
import {useStore} from 'store/store_provider'

/** COMPONENTS */
/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import {Popover} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
	root: {}
}))

const NotificationsList = observer(function NotificationsList({user_info, open, anchor, onClose}) {
	const classes = useStyles();
	const store = useStore();

	const handleNotificationsClose = () => {
		onClose();
	}

	return (
		<Popover
			open={open}
			anchorEl={anchor}
			onClose={handleNotificationsClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
		>
			<div>Notification list</div>

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

		</Popover>
	);
})

export default NotificationsList