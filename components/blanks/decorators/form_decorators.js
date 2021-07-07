import React from "react";

/** COMPONENTS */
import * as CONSTANTS from "../CONSTANTS"
import {useStore} from 'store/store_provider'

/** THIRD PARTY */
import {observer} from 'mobx-react-lite'

/** MATERIAL */
import {TextField, Select, MenuItem} from '@material-ui/core'


const PlaceholderFormComponent = observer(function PlaceholderFormComponent({children, entityKey, contentState}) {
	const {blanksStore} = useStore()

	const entity = contentState.getEntity(entityKey);
	const type = entity.getType();
	const data = entity.getData();

	const entity_props = blanksStore.entities_props[data.code];

	const [value, setValue] = React.useState(entity_props?.value?.value ? entity_props.value.value : undefined)

	React.useEffect(() => {
		if (blanksStore.entities_props[data.code]['value']) {
			setValue(blanksStore.entities_props[data.code]['value']['value']);
		}
	}, [blanksStore.entities_props[data.code]['value']])


	switch (entity_props.type) {
		case CONSTANTS.TYPE_SELECT_FIELD:
			return (
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
					{blanksStore.select_lists[entity_props.list_code]['values'].map((list, index) => (
						<MenuItem key={index} value={list.value}>{list.label}</MenuItem>
					))}
				</Select>
			);
		case CONSTANTS.TYPE_TEXT_FIELD:
			return (
				<TextField
					multiline
					size="small"
					style={{width: data.width || 200, marginTop: -5, marginLeft: 5, marginRight: 5}}
					value={value || ''}
					onChange={(e) => {
						blanksStore.setEntityValue(entity_props.code, {
							value: e.target.value
						})
					}}
				/>
			)
		case CONSTANTS.TYPE_NUMBER_FIELD:
			return (
				<TextField
					type={'number'}
					size="small"
					style={{width: data.width || 200, marginTop: -5, marginLeft: 5, marginRight: 5}}
					value={value || ''}
					onChange={(e) => {
						blanksStore.setEntityValue(entity_props.code, {
							value: e.target.value
						})
					}}
				/>
			)
	}
})

const findPlaceholderEntities = (contentBlock, callback, contentState) => {
	contentBlock.findEntityRanges(
		(character) => {
			const entityKey = character.getEntity();
			return entityKey !== null && contentState.getEntity(entityKey).getType() === 'PLACEHOLDER'
		},
		callback,
	);
};

export const decorators = [
	{
		strategy: findPlaceholderEntities,
		component: PlaceholderFormComponent,
	}
]