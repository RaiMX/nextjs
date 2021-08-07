import React from 'react';

/** COMPONENTS */
import * as CONSTANTS from "components/blanks/CONSTANTS";
import {useStore} from 'store/store_provider'

/** THIRD PARTY */
import {observer} from "mobx-react-lite";

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import {TextField, Tooltip} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
	root: {}
}))

const NumberFieldDecorator = observer(function NumberFieldDecorator({entity_props}) {
	const classes = useStyles();
	const {blanksStore} = useStore();

	const [value, setValue] = React.useState(entity_props?.value?.value ? entity_props.value.value : undefined)

	React.useEffect(() => {
		if (blanksStore.entities_props[entity_props.code]['value']) {
			setValue(blanksStore.entities_props[entity_props.code]['value']['value']);
		}
	}, [blanksStore.entities_props[entity_props.code]['value']])

	return (
		<Tooltip title={entity_props.description || CONSTANTS.FIELD_TYPES.find(x => x.code === CONSTANTS.TYPE_NUMBER_FIELD).label} placement="bottom">
			<TextField
				type={'number'}
				size="small"
				error={entity_props?.allow_null === false && (value === undefined || value === '')}
				style={{width: value?.length * 9 + 20 || 200, maxWidth: 1000, marginTop: 0, marginLeft: 5, marginRight: 5}}
				value={value || ''}
				onChange={(e) => {
					blanksStore.setEntityValue(entity_props.code, {
						value: e.target.value
					})
				}}
			/>
		</Tooltip>
	);
})

export default NumberFieldDecorator