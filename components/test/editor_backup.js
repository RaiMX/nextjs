import React from 'react';
import {Editor, EditorState, Modifier, CompositeDecorator, ContentState, convertFromRaw, convertToRaw} from 'draft-js';

import Suggestions from './suggestions'

/* ----------*
* SETTINGS
------------*/
const PLACEHOLDER_TRIGGER = '{{'
const PLACEHOLDER_CLOSER = '}}'


/* ----------*
* Utils
------------*/

// Trick to fix issue with NextJS https://github.com/facebook/draft-js/blob/master/examples/draft-0-10-0/universal/editor.js
const emptyContentState = convertFromRaw({
    entityMap: {},
    blocks: [
        {
            text: "",
            key: "foo",
            type: "unstyled",
            entityRanges: [],
        },
    ],
});

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

const Hashtag = ({children}) => {
    return (
        <span style={{background: 'lightBlue'}}>{children}</span>
    );
};

const findPlaceholderEntities = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();

            if (entityKey !== null) {
                console.log(contentState.getEntity(entityKey).getType())
            }


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
        component: Hashtag,
    }
]);

export default function MyEditor({value, onChange}) {
    const editorRef = React.useRef(null);

    const init_value = value || '';

    const [editorState, setEditorState] = React.useState(
        EditorState.createWithContent(convertFromRaw(init_value), compositeDecorator)
    );

    const [autocompleteState, setAutocompleteState] = React.useState(null);

    const focus = () => {
        if (editorRef.current) {
            editorRef.current.focus();
        }
    }

    const renderPlaceholder = (text) => {
        setEditorState(renderPlaceholderText(editorState, autocompleteState, text));
        setAutocompleteState(null);
    }

    React.useEffect(() => {
        const triggerRange = getTriggerRange(PLACEHOLDER_TRIGGER);

        if (!triggerRange) {
            setAutocompleteState(null);
            return;
        }

        // console.log('triggerRange', triggerRange);
        // console.log('triggerRange sliced old:', triggerRange.text.slice(1, triggerRange.text.length))
        // console.log('triggerRange sliced:', triggerRange.text.slice(PLACEHOLDER_TRIGGER.length, triggerRange.text.length))

        const search_text = triggerRange.text.slice(PLACEHOLDER_TRIGGER.length, triggerRange.text.length);

        setAutocompleteState({
            searchText: search_text
        });

    }, [editorState]);

    // React.useEffect(() => {
    //     // setEditorState(EditorState.createWithContent(ContentState.createFromText(init_value), compositeDecorator));
    //     setEditorState(EditorState.createWithContent(convertFromRaw(init_value), compositeDecorator));
    // }, []);

    return (
        <div onClick={focus}>
            <Editor
                ref={editorRef}
                editorKey={'my'}
                readOnly={true}
                editorState={editorState}
                onChange={(editorState) => {
                    setEditorState(editorState);
                    // get plain text = editorState.getCurrentContent().getPlainText()
                    onChange(convertToRaw(editorState.getCurrentContent()))

                }}
                userSelect="none"
                contentEditable={false}
            />

            {autocompleteState ? (
                <Suggestions
                    autocompleteState={autocompleteState}
                    renderPlaceholder={renderPlaceholder}
                />
            ) : null}

        </div>
    );
}