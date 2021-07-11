import React from 'react';

/** COMPONENTS */
import {useStore} from 'store/store_provider'

/** THIRD PARTY */
import {observer} from "mobx-react-lite";

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import {TextField, Tooltip} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
	root: {}
}))

const TextFieldDecorator = observer(function TextFieldDecorator({entity_props}) {
	const classes = useStyles();
	const {blanksStore} = useStore();

	const [value, setValue] = React.useState(entity_props?.value?.value ? entity_props.value.value : undefined)

	React.useEffect(() => {
		if (blanksStore.entities_props[entity_props.code]['value']) {
			setValue(blanksStore.entities_props[entity_props.code]['value']['value']);
		}
	}, [blanksStore.entities_props[entity_props.code]['value']])

	return (
		<Tooltip title={entity_props.description || null} placement="right-end">
			<TextField
				error={entity_props?.allow_null === false && (value === undefined || value === '')}
				// label={entity_props?.allow_null === false && (value === undefined || value === '') ? 'Обязательно' : ''}
				multiline
				size="small"
				style={{width: value?.length * 9 + 20 || 200, maxWidth: 1000, marginTop: -5, marginLeft: 5, marginRight: 5}}
				value={value || ''}
				// helperText={entity_props.description || null}
				onChange={(e) => {
					blanksStore.setEntityValue(entity_props.code, {
						value: e.target.value
					})
				}}
			/>
		</Tooltip>

	);
})

export default TextFieldDecorator