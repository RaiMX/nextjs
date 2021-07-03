import React from "react";
import * as CONSTANTS from "../CONSTANTS"

/** COMPONENTS */

/** THIRD PARTY */

/** MATERIAL */
import {TextField, Select, MenuItem} from '@material-ui/core'


const PlaceholderComponent = ({children, entityKey, contentState}) => {

    const entity = contentState.getEntity(entityKey);
    const type = entity.getType();
    const data = entity.getData();

    // console.log('entity', entity);
    // console.log('type', type);
    // console.log('data', data);

    switch (data.type) {
        case CONSTANTS.TYPE_SELECT_FIELD:
            return (
                <Select
                    value={'ru'}
                    onChange={(e) => console.log(e.target.value)}
                    autoWidth
                    style={{marginTop: -10, marginLeft: 5, marginRight: 5}}
                >
                    <MenuItem value={'ru'}>RU</MenuItem>
                    <MenuItem value={'kk'}>KZ</MenuItem>
                </Select>
            );
        case CONSTANTS.TYPE_TEXT_FIELD:
            return (
                <TextField
                    multiline
                    size="small"
                    style={{width: data.width || 200, marginTop: -5, marginLeft: 5, marginRight: 5}}
                />
            )
    }

    if (data.type === 'list') {

    }

    return (
        <span style={{background: 'lightBlue'}}>{children}</span>
    );
};

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
        component: PlaceholderComponent,
    }
]