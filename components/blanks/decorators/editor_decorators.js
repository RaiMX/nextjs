import React from "react";

/** COMPONENTS */
import * as CONSTANTS from "../CONSTANTS"
import {useStore} from 'store/store_provider'

/** THIRD PARTY */
import {observer} from 'mobx-react-lite'

/** MATERIAL */
import {TextField, Select, MenuItem} from '@material-ui/core'

const findPlaceholderEntities = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();

            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'PLACEHOLDER'
            );
        },
        callback,
    );
};

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

export const decorators = [
    {
        strategy: findPlaceholderEntities,
        component: PlaceholderEditorComponent,
    }
]