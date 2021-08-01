import React from 'react';

/** COMPONENTS */
import { useStore } from 'store/store_provider'

/** THIRD PARTY */
import { observer } from "mobx-react-lite";

/** MATERIAL */
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { FormControl, Grid, TextField } from "@material-ui/core";

import ruLocale from "date-fns/locale/ru";
import DateFnsUtils from '@date-io/date-fns';
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from '@material-ui/pickers';


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

const DateFieldElement = observer(function DateFieldElement({ entity_props }) {
	const classes = useStyles();
	const { blanksStore } = useStore();

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
			style={{ borderBottom: '1px dashed #ccc' }}
		>
			<Grid item xs={12} md={6}>
				<Typography style={{ paddingTop: '8px' }}>{entity_props.description}</Typography>
			</Grid>
			<Grid item xs={12} md={6}>
				<FormControl className={classes.formControl}>
					<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
						<KeyboardDatePicker
							autoOk
							size="small"
							disableToolbar
							variant="inline"
							format="dd.MM.yyyy"
							margin="normal"
							value={value || null}
							title={entity_props.description || null}
							onChange={(_date) => {
								blanksStore.setEntityValue(entity_props.code, {
									value: _date
								})
							}}
							KeyboardButtonProps={{
								'aria-label': 'change date',
							}}
							error={entity_props?.allow_null === false && (value === undefined || value === '')}
							style={{ marginTop: -5, marginLeft: 5, marginRight: 5 }}
						/>
					</MuiPickersUtilsProvider>
				</FormControl>
			</Grid>
		</Grid>
	);
})

export default DateFieldElement