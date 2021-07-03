import {EditorState, Modifier} from "draft-js";
import {PLACEHOLDER_TRIGGER, PLACEHOLDER_CLOSER} from "../CONSTANTS";


export const getTriggerRange = (trigger) => {
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

export const getInsertRange = (autocompleteState, editorState) => {
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

export const renderPlaceholderText = (editorState, autocompleteState, placeholder) => {
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
