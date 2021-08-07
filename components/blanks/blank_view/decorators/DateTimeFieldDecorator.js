import React from 'react';

/** COMPONENTS */
import * as CONSTANTS from "components/blanks/CONSTANTS";
import { useStore } from 'store/store_provider'

/** THIRD PARTY */
import { observer } from "mobx-react-lite";

/** MATERIAL */
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Tooltip } from "@material-ui/core";

import ruLocale from "date-fns/locale/ru";
import DateFnsUtils from '@date-io/date-fns';
import {
	MuiPickersUtilsProvider,
	KeyboardDateTimePicker
} from '@material-ui/pickers';


const useStyles = makeStyles((theme) => ({
	root: {}
}))

function TextFieldWithTooltip({title, ...props}) {
	return (
		<Tooltip title={title} placement={"bottom"}>
			<TextField {...props} />
		</Tooltip>
	)
}

const DateFieldDecorator = observer(function DateFieldDecorator({ entity_props }) {
	const classes = useStyles();
	const { blanksStore } = useStore();

	const [value, setValue] = React.useState(entity_props?.value?.value ? entity_props.value.value : undefined)

	React.useEffect(() => {
		if (blanksStore.entities_props[entity_props.code]['value']) {
			setValue(blanksStore.entities_props[entity_props.code]['value']['value']);
		}
	}, [blanksStore.entities_props[entity_props.code]['value']])

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
			<KeyboardDateTimePicker
				size="small"
				variant="inline"
				ampm={false}
				format="dd.MM.yyyy HH:mm"
				margin="normal"
				value={value || null}
				title={entity_props.description || null}
				TextFieldComponent={TextFieldWithTooltip}
				onChange={(_date) => {
					blanksStore.setEntityValue(entity_props.code, {
						value: _date
					})
				}}
				KeyboardButtonProps={{
					'aria-label': 'change date',
				}}
				error={entity_props?.allow_null === false && (value === undefined || value === '')}
				style={{ width: '137pt', marginTop: 0, marginLeft: 5, marginRight: 5 }}
			/>
		</MuiPickersUtilsProvider>
	);
})

export default DateFieldDecorator