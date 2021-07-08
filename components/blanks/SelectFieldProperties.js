import React from 'react';

/** COMPONENTS */
import {useStore} from 'store/store_provider'
import * as CONSTANTS from "./CONSTANTS";

/** THIRD PARTY */
import {observer} from "mobx-react-lite";
import {FormattedMessage} from 'react-intl';

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {Grid, MenuItem, FormControl, FormControlLabel, InputLabel, Select, TextField, Checkbox} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
	root: {},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
		width: '95%'
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}))


const SelectFieldProperties = observer(function SelectFieldProperties({entity_code, entity_properties}) {
	const classes = useStyles();
	const {blanksStore} = useStore();

	return (
		<Grid
			container
			direction="row"
			justify="flex-start"
			alignItems="flex-start"
		>
			<Grid item xs={12} md={12}>
				<FormControl className={classes.formControl}>
					<TextField
						disabled={true}
						label={<FormattedMessage defaultMessage={'Тип'}/>}
						defaultValue={CONSTANTS.FIELD_TYPES.find(x => x.code === entity_properties.type).label}
					/>
				</FormControl>
			</Grid>
			<Grid item xs={12} md={12}>
				<FormControl className={classes.formControl}>
					<InputLabel id="list-name-label"><FormattedMessage defaultMessage={'Название списка'}/></InputLabel>
					<Select
						labelId="list-name-label"
						value={entity_properties.list_code || ''}
						fullWidth
						onChange={(e) => {
							blanksStore.setEntityProperty(entity_code, 'list_code', e.target.value);
						}}
					>
						{blanksStore.select_lists_names.map((list, index) => (
							<MenuItem key={index} value={list.code}>{list.label}</MenuItem>
						))}
					</Select>
				</FormControl>
			</Grid>
			<Grid item xs={12} md={12}>
				<FormControl className={classes.formControl}>
					<FormControlLabel
						control={<Checkbox
							checked={entity_properties.allow_null || false}
							onChange={(e) => {
								blanksStore.setEntityProperty(entity_code, 'allow_null', e.target.checked);
							}}
							color="primary"
						/>}
						label="Разрешить пустое значение"
					/>

				</FormControl>
			</Grid>
		</Grid>
	);
})

export default SelectFieldProperties