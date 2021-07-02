import React from 'react';
import {Editor, EditorState, Modifier, CompositeDecorator, ContentState, convertFromRaw, convertToRaw} from 'draft-js';

import Suggestions from './suggestions'

/* ----------*
* SETTINGS
------------*/
const PLACEHOLDER_TRIGGER = '{{'
const PLACEHOLDER_CLOSER = '}}'

/* ----------*
* CONSTANTS
------------*/
const lists = {
    my: [
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven'
    ]
};

/* ----------*
* Utils
------------*/


const getTriggerRange = (trigger) => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    const text = range.startContainer.textContent.substring(0, range.startOffset);
    if (/\s+$/.test(text)) return null;
    const index = text.lastIndexOf(trigger);
    if (index === -1) return null;

    return {
        text: text.substring(index),
        start: index,
        end: range.startOffset,
    };
};

const getInsertRange = (autocompleteState, editorState) => {
    const currentSelectionState = editorState.getSelection();
    const end = currentSelectionState.getAnchorOffset();
    const anchorKey = currentSelectionState.getAnchorKey();
    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(anchorKey);
    const blockText = currentBlock.getText();
    const start = blockText.substring(0, end).lastIndexOf(PLACEHOLDER_TRIGGER);

    return {
        start,
        end,
    };
};

/* ----------*
* Modifiers
------------*/

const renderPlaceholderText = (editorState, autocompleteState, placeholder) => {
    const {start, end} = getInsertRange(autocompleteState, editorState);

    const currentSelectionState = editorState.getSelection();

    const selection = currentSelectionState.merge({
        anchorOffset: start,
        focusOffset: end,
    });

    const contentState = editorState.getCurrentContent();

    const contentStateWithEntity = contentState.createEntity(
        'PLACEHOLDER',
        'IMMUTABLE',
        {
            type: 'list',
            code: 'my',
            placeholder,
        },
    );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    let newContentState = Modifier.replaceText(
        contentStateWithEntity,
        selection,
        `${PLACEHOLDER_TRIGGER}${placeholder}${PLACEHOLDER_CLOSER} `,
        null,
        entityKey,
    );

    const newEditorState = EditorState.push(
        editorState,
        newContentState,
        `insert-placeholder`,
    );

    return EditorState.forceSelection(
        newEditorState,
        newContentState.getSelectionAfter(),
    );
};

/* ----------*
* Decorators
------------*/

const InlineDropdown = ({}) => {
    return (
        <select>
            <option value={'hola'}>HOLA</option>
            <option value={'dos'}>DOS</option>
            <option value={'tres'}>TRES</option>
        </select>
    );
};

const PlaceholderComponent = ({children, entityKey, contentState}) => {

    const entity = contentState.getEntity(entityKey);
    const type = entity.getType();
    const data = entity.getData();

    // console.log('entity', entity);
    // console.log('type', type);
    // console.log('data', data);

    if (data.type === 'list') {
        return (
            <span style={{background: 'lightBlue'}}><InlineDropdown/></span>
        );
    }

    return (
        <span style={{background: 'lightBlue'}}>{children}</span>
    );
};

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

const compositeDecorator = new CompositeDecorator([
    {
        strategy: findPlaceholderEntities,
        component: PlaceholderComponent,
    }
]);

function myBlockRenderer(contentBlock) {
    const type = contentBlock.getType();

    if (type === 'PLACEHOLDER') {
        return {
            component: InlineDropdown,
            editable: false,
            props: {
                foo: 'bar',
            },
        };
    }
}

export default function MyEditor({value, onChange, style = {}}) {
    const editorRef = React.useRef(null);

    const getInitialContent = () => {
        if (value) {
            return EditorState.createWithContent(convertFromRaw(value), compositeDecorator)
        }

        // Trick to fix issue with NextJS https://github.com/facebook/draft-js/blob/master/examples/draft-0-10-0/universal/editor.js
        return EditorState.createWithContent(convertFromRaw({
            entityMap: {},
            blocks: [
                {
                    text: "",
                    key: "initial",
                    type: "unstyled",
                    entityRanges: [],
                },
            ],
        }), compositeDecorator)
    }

    const [editorState, setEditorState] = React.useState(getInitialContent);

    const [autocompleteState, setAutocompleteState] = React.useState(null);

    const focus = () => {
        if (editorRef.current) {
            editorRef.current.focus();
        }
    }

    React.useEffect(() => {
        setEditorState(getInitialContent);
    }, [value]);

    return (
        <div style={style} onClick={() => focus()}>
            <Editor
                ref={editorRef}
                editorKey={'my_form'}
                readOnly={true}
                editorState={editorState}
                onChange={(editorState) => {
                    console.log('CHANGED!')
                    onChange(convertToRaw(editorState.getCurrentContent()))
                }}
                userSelect="none"
                contentEditable={false}
                blockRendererFn={myBlockRenderer}
            />
        </div>
    );
}