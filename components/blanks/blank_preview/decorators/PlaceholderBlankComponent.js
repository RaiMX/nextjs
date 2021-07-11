import React from 'react';
import dynamic from "next/dynamic";

/** COMPONENTS */
import {useStore} from 'store/store_provider'
import * as CONSTANTS from "components/blanks/CONSTANTS";
import SelectFieldDecorator from "./SelectFieldDecorator";
import TextFieldDecorator from "./TextFieldDecorator";
import NumberFieldDecorator from "./NumberFieldDecorator";

/** THIRD PARTY */
import {observer} from "mobx-react-lite";

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
	root: {}
}))

/** LOADING WITHOUT SSR because Component does not support SSR */
const TableFieldDecorator = dynamic(() => import('./TableFieldDecorator'), {ssr: false});


const PlaceholderBlankComponent = observer(function PlaceholderFormComponent({children, entityKey, contentState}) {
	const {blanksStore} = useStore()

	const entity = contentState.getEntity(entityKey);
	const type = entity.getType();
	const data = entity.getData();

	const entity_props = blanksStore.entities_props[data.code];


	switch (entity_props.type) {
		case CONSTANTS.TYPE_SELECT_FIELD:
			return (
				<SelectFieldDecorator entity_props={entity_props}/>
			);
		case CONSTANTS.TYPE_TEXT_FIELD:
			return (
				<TextFieldDecorator entity_props={entity_props}/>
			)
		case CONSTANTS.TYPE_NUMBER_FIELD:
			return (
				<NumberFieldDecorator entity_props={entity_props}/>
			)
		case CONSTANTS.TYPE_TABLE_FIELD:
			return (
				<TableFieldDecorator entity_props={entity_props}/>
			)
	}
})

export default PlaceholderBlankComponent