import React from 'react';

/** COMPONENTS */
import {useStore} from 'store/store_provider'

/** THIRD PARTY */
import {observer} from "mobx-react-lite";

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
	root: {}
}))

const PlaceholderEditorComponent = observer(function PlaceholderEditorComponent({children, entityKey, contentState}) {
	const {blanksStore} = useStore()

	const entity = contentState.getEntity(entityKey);
	const type = entity.getType();
	const data = entity.getData();

	const entity_props = blanksStore.entities_props[data.code];

	return (
		<span style={{background: '#e3e1e1'}}>{children}</span>
	);
})

export default PlaceholderEditorComponent