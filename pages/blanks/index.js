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

const Index = observer(function Index() {
	const classes = useStyles();
	const store = useStore();


	return (
		<>
			<div>TEXT</div>
		</>
	);
})

export default Index