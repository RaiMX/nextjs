import React from "react";

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

const Hashtag = ({children, entityKey, contentState}) => {

    const entity = contentState.getEntity(entityKey);
    const type = entity.getType();
    const data = entity.getData();

    console.log('entity', entity);
    console.log('type', type);
    console.log('data', data);

    // if (data.type === 'list') {
    //     return (
    //         <span style={{background: 'lightBlue'}}><InlineDropdown/></span>
    //     );
    // }

    return (
        <span style={{background: '#e3e1e1'}}>{children}</span>
    );
};

export const decorators = [
    {
        strategy: findPlaceholderEntities,
        component: Hashtag,
    }
]