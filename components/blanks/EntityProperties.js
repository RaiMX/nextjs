import React from 'react';

/** COMPONENTS */
import {useStore} from 'store/store_provider'
import * as CONSTANTS from "./CONSTANTS"

/** THIRD PARTY */
import {observer} from "mobx-react-lite";
import {FormattedMessage} from 'react-intl';

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {Grid, MenuItem, Select, TextField} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
	root: {}
}))

const EntityProperties = observer(function EntityProperties() {
	const classes = useStyles();
	const {blanksStore} = useStore();

	const [entity_code, setEntityCode] = React.useState(null);
	const [entity_properties, setEntityProperties] = React.useState(null);

	const [entity_type, setEntityType] = React.useState(null);

	const [list_code, setListCode] = React.useState(null);

	React.useEffect(() => {
		setEntityProperties(blanksStore.entities_props[blanksStore.selected_entity_code])
		setEntityCode(blanksStore.selected_entity_code);
	}, [blanksStore.selected_entity_code])

	React.useEffect(() => {
		setEntityProperties(blanksStore.entities_props[blanksStore.selected_entity_code])
	}, [blanksStore.entities_props[blanksStore.selected_entity_code]])

	React.useEffect(() => {
		if (entity_properties) {
			if (entity_properties.type !== entity_type) {
				setEntityType(entity_properties.type);
			}
			if (entity_properties?.list_code !== list_code) {
				setListCode(entity_properties.list_code);
			}
		}
	}, [entity_properties])

	return entity_code ? (
		<Grid
			container
			direction="row"
			justify="flex-start"
			alignItems="flex-start"
		>
			<Grid item xs={12} md={12}>
				<TextField
					disabled={true}
					label={<FormattedMessage defaultMessage={'Тип'}/>}
					defaultValue={CONSTANTS.FIELD_TYPES.find(x => x.code === entity_properties.type).label}
				/>

				{entity_properties.type === CONSTANTS.TYPE_SELECT_FIELD ? (
					<Select
						label={<FormattedMessage defaultMessage={'Название списка'}/>}
						value={list_code || ''}
						autoWidth
						onChange={(e) => {
							blanksStore.setEntityProperty(entity_code, 'list_code', e.target.value);
							setListCode(e.target.value);
						}}
					>
						{blanksStore.select_lists_names.map((list, index) => (
							<MenuItem key={index} value={list.code}>{list.label}</MenuItem>
						))}
					</Select>
				) : null}


			</Grid>
		</Grid>
	) : null
})

export default EntityProperties