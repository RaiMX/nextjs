import React from 'react';

/** COMPONENTS */
import {useStore} from 'store/store_provider'
import * as CONSTANTS from "components/blanks/CONSTANTS";

/** THIRD PARTY */
import {observer} from "mobx-react-lite";

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import {MenuItem, Select, Tooltip} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
	root: {}
}))

const SelectFieldDecorator = observer(function SelectFieldDecorator({entity_props}) {
	const classes = useStyles();
	const {blanksStore} = useStore();

	const [value, setValue] = React.useState(entity_props?.value?.value ? entity_props.value.value : undefined)

	React.useEffect(() => {
		if (blanksStore.entities_props[entity_props.code]['value']) {
			setValue(blanksStore.entities_props[entity_props.code]['value']['value']);
		}
	}, [blanksStore.entities_props[entity_props.code]['value']])

	return (
		<Tooltip title={entity_props.description || CONSTANTS.FIELD_TYPES.find(x => x.code === CONSTANTS.TYPE_SELECT_FIELD).label} placement="right-end">
			<Select
				value={value || ''}
				autoWidth
				size="small"
				style={{marginTop: -5, marginLeft: 5, marginRight: 5}}
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
		</Tooltip>
	);
})

export default SelectFieldDecorator