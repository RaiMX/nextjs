import React from 'react';

/** COMPONENTS */
import {useStore} from 'store/store_provider'
import * as CONSTANTS from "../../CONSTANTS";

/** THIRD PARTY */
import {observer} from "mobx-react-lite";
import {FormattedMessage} from 'react-intl';

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import {Checkbox, FormControl, FormControlLabel, Grid, TextField} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
	root: {},
	formControl: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		marginLeft: theme.spacing(3),
		minWidth: 120,
		width: '95%'
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}))


const NumberFieldProperties = observer(function NumberFieldProperties({entity_code, entity_properties}) {
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
					<TextField
						label={<FormattedMessage defaultMessage={'Ширина отображаемого поля ввода'}/>}
						value={entity_properties.field_width || 1000}
						type={'number'}
						onChange={(e) => {
							blanksStore.setEntityProperty(entity_code, 'field_width', Number(e.target.value));
						}}
					/>
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
			<Grid item xs={12} md={12}>
				<FormControl className={classes.formControl}>
					<TextField
						label={<FormattedMessage defaultMessage={'Описание поля'}/>}
						value={entity_properties.description || ''}
						onChange={(e) => {
							blanksStore.setEntityProperty(entity_code, 'description', e.target.value);
						}}
					/>
				</FormControl>
			</Grid>
		</Grid>
	);
})

export default NumberFieldProperties