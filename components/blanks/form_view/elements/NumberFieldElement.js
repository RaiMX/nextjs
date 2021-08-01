import React from 'react';

/** COMPONENTS */
import {useStore} from 'store/store_provider'

/** THIRD PARTY */
import {observer} from "mobx-react-lite";

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {FormControl, Grid, TextField} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
	root: {},
	formControl: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		marginLeft: theme.spacing(3),
		minWidth: 120,
		width: '95%'
	},
}))

const NumberFieldElement = observer(function NumberFieldElement({entity_props}) {
	const classes = useStyles();
	const {blanksStore} = useStore();

	const [value, setValue] = React.useState(entity_props?.value?.value ? entity_props.value.value : undefined);

	React.useEffect(() => {
		if (blanksStore.entities_props[entity_props.code]['value']) {
			setValue(blanksStore.entities_props[entity_props.code]['value']['value']);
		}
	}, [blanksStore.entities_props[entity_props.code]['value']])

	return (
		<Grid
			container
			direction="row"
			justify="flex-start"
			alignItems="flex-start"
			style={{borderBottom: '1px dashed #ccc'}}
		>
			<Grid item xs={12} md={6}>
				<Typography style={{paddingTop: '8px'}}>{entity_props.description}</Typography>
			</Grid>
			<Grid item xs={12} md={6}>
				<FormControl className={classes.formControl}>
					<TextField
						error={entity_props?.allow_null === false && (value === undefined || value === '')}
						// label={entity_props?.allow_null === false && (value === undefined || value === '') ? 'Обязательно' : ''}
						type={'number'}
						size="small"
						style={{marginTop: -5, marginLeft: 5, marginRight: 5}}
						value={value || ''}
						onChange={(e) => {
							blanksStore.setEntityValue(entity_props.code, {
								value: e.target.value
							})
						}}
					/>
				</FormControl>
			</Grid>
		</Grid>
	);
})

export default NumberFieldElement