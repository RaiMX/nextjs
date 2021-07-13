import React from 'react';

/** COMPONENTS */

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
	container: {
		height: `calc(100% - 70px)`,
		paddingTop: theme.spacing(0),
		paddingBottom: theme.spacing(0),
		paddingLeft: theme.spacing(0),
		paddingRight: theme.spacing(0),
	},
}))

export default function Index() {
	const classes = useStyles();

	return (
		<>
			<div>Главная страница</div>
		</>
	);
}
