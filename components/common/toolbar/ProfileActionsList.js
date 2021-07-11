import React from 'react';

/** THIRD PARTY */
import {observer} from "mobx-react-lite";

/** HOOKS */
import {useStore} from 'store/store_provider'

/** COMPONENTS */
/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
	root: {}
}))

const ProfileActionsList = observer(function ProfileActionsList() {
	const classes = useStyles();
	const store = useStore();


	return (
		<>
			<div>Profile actions</div>
		</>
	);
})

export default ProfileActionsList