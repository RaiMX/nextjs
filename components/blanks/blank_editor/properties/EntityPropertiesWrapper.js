import React from 'react';

/** COMPONENTS */
import {useStore} from 'store/store_provider'
import * as CONSTANTS from "../../CONSTANTS"
import SelectFieldProperties from "./SelectFieldProperties";
import TextFieldProperties from "./TextFieldProperties";
import NumberFieldProperties from "./NumberFieldProperties";
import DateFieldProperties from "./DateFieldProperties";
import TableFieldProperties from "./TableFieldProperties";

/** THIRD PARTY */
import {observer} from "mobx-react-lite";

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
	root: {}
}))

const EntityPropertiesWrapper = observer(function EntityProperties() {
	const classes = useStyles();
	const {blanksStore} = useStore();

	const [entity_code, setEntityCode] = React.useState(null);
	const [entity_properties, setEntityProperties] = React.useState(null);

	React.useEffect(() => {
		setEntityProperties(blanksStore.entities_props[blanksStore.selected_entity_code])
		setEntityCode(blanksStore.selected_entity_code);
	}, [blanksStore.selected_entity_code])

	React.useEffect(() => {
		setEntityProperties(blanksStore.entities_props[blanksStore.selected_entity_code])
	}, [blanksStore.entities_props[blanksStore.selected_entity_code]])

	if (entity_code) {
		switch (entity_properties.type) {
			case CONSTANTS.TYPE_SELECT_FIELD:
				return <SelectFieldProperties entity_code={entity_code} entity_properties={entity_properties}/>
			case CONSTANTS.TYPE_TEXT_FIELD:
				return <TextFieldProperties entity_code={entity_code} entity_properties={entity_properties}/>
			case CONSTANTS.TYPE_NUMBER_FIELD:
				return <NumberFieldProperties entity_code={entity_code} entity_properties={entity_properties}/>
			case CONSTANTS.TYPE_DATE_FIELD:
				return <DateFieldProperties entity_code={entity_code} entity_properties={entity_properties}/>
			case CONSTANTS.TYPE_TABLE_FIELD:
				return <TableFieldProperties entity_code={entity_code} entity_properties={entity_properties}/>
			default:
				return null;
		}
	}

	return null;
})

export default EntityPropertiesWrapper