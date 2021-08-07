import React from 'react';

/** COMPONENTS */
import * as CONSTANTS from "components/blanks/CONSTANTS";
import { useStore } from 'store/store_provider'

/** THIRD PARTY */
import { observer } from "mobx-react-lite";

/** MATERIAL */
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Tooltip, InputAdornment, IconButton } from "@material-ui/core";
import ScheduleIcon from '@material-ui/icons/Schedule';

import ruLocale from "date-fns/locale/ru";
import DateFnsUtils from '@date-io/date-fns';
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
} from '@material-ui/pickers';


const useStyles = makeStyles((theme) => ({
	root: {}
}))

function TextFieldWithTooltip({ title, ...props }) {
	return (
		<Tooltip title={title} placement={"bottom"}>
			<TextField {...props} />
		</Tooltip>
	)
}

const DateFieldDecorator = observer(function DateFieldDecorator({ entity_props }) {
	const classes = useStyles();
	const { blanksStore } = useStore();

	const buildTime = value => {
		const hours = value.split(':')[0];
		const minutes = value.split(':')[1];
		const time = (new Date()).setHours(hours, minutes, 0);
		return time;
	}

	const [value, setValue] = React.useState(entity_props?.value?.value ? buildTime(entity_props.value.value) : undefined)

	React.useEffect(() => {
		if (blanksStore.entities_props[entity_props.code]['value']) {
			setValue(buildTime(blanksStore.entities_props[entity_props.code]['value']['value']));
		}
	}, [blanksStore.entities_props[entity_props.code]['value']])

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
			<KeyboardTimePicker
				ampm={false}
				placeholder="09:00"
				mask="__:__"
				size="small"
				variant="inline"
				margin="normal"
				value={value || null}
				title={entity_props.description || null}
				TextFieldComponent={TextFieldWithTooltip}
				onChange={(_date) => {
					// Ignore date part
					blanksStore.setEntityValue(entity_props.code, {
						value: ("0" + _date.getHours()).slice(-2) + ':' + ("0" + _date.getMinutes()).slice(-2)
					})
				}}
				keyboardIcon={<ScheduleIcon />}
				KeyboardButtonProps={{
					'aria-label': 'change time',
				}}
				error={entity_props?.allow_null === false && (value === undefined || value === '')}
				style={{ width: '72pt', marginTop: 0, marginLeft: 5, marginRight: 5 }}
				
			/>
		</MuiPickersUtilsProvider>
	);
})

export default DateFieldDecorator