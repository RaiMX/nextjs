import React from "react";

/** COMPONENTS */
import PlaceholderEditorComponent from "./PlaceholderEditorComponent";

/** THIRD PARTY */

/** MATERIAL */


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

export const decorators = [
    {
        strategy: findPlaceholderEntities,
        component: PlaceholderEditorComponent,
    }
]