import React from 'react';

/** COMPONENTS */
import {useStore} from 'store/store_provider'

/** THIRD PARTY */
import {observer} from "mobx-react-lite";

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {FormControl, Grid, MenuItem, Select} from "@material-ui/core";


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

const SelectFieldElement = observer(function SelectFieldElement({entity_props}) {
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
			style={{borderBottom: '1px dashed #ccc', paddingTop: 10}}
		>
			<Grid item xs={12} md={6}>
				<Typography style={{paddingTop: '8px'}}>{entity_props.description}</Typography>
			</Grid>
			<Grid item xs={12} md={6}>
				<FormControl className={classes.formControl}>
					<Select
						value={value || ''}
						autoWidth
						size="small"
						style={{marginTop: -10, marginLeft: 5, marginRight: 5}}
						onChange={(e) => {
							blanksStore.setEntityValue(entity_props.code, {
								value: e.target.value
							})
						}}
					>
						{blanksStore.select_lists[entity_props.list_code] && blanksStore.select_lists[entity_props.list_code]['values'].map((list, index) => (
							<MenuItem key={index} value={list.id}>{list.name}</MenuItem>
						))}
					</Select>
				</FormControl>
			</Grid>
		</Grid>
	);
})

export default SelectFieldElement