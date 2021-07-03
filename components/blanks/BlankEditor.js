import React, {Component} from 'react';
import dynamic from "next/dynamic";

/** COMPONENTS */
import * as CONSTANTS from "./CONSTANTS";
import Suggestions from './Suggestions'
import {decorators} from './decorators/editor_decorators'
import {renderPlaceholderText, getTriggerRange, getInsertRange} from "./helpers/editor_helpers";


/** THIRD PARTY */
import {EditorState, Modifier, CompositeDecorator, ContentState, convertFromRaw, convertToRaw} from 'draft-js';

const Editor = dynamic(
    () => import('react-draft-wysiwyg').then(mod => mod.Editor),
    {ssr: false}
)
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {v4} from 'uuid';
import {FormattedMessage} from 'react-intl';

/** MATERIAL */
import {Drawer, Button, Grid, Paper, Typography} from "@material-ui/core";

function ToolbarTextFieldButton({editorState, onChange}) {
    const addTextFieldPlaceholder = () => {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'PLACEHOLDER',
            'IMMUTABLE',
            {
                type: CONSTANTS.TYPE_TEXT_FIELD,
                code: v4(),
                placeholder: CONSTANTS.PLACEHOLDER_TEXT_TEXT_FIELD,
            },
        );

        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

        let newContentState = Modifier.replaceText(
            contentStateWithEntity,
            editorState.getSelection(),
            `${CONSTANTS.PLACEHOLDER_TRIGGER}${CONSTANTS.PLACEHOLDER_TEXT_TEXT_FIELD}${CONSTANTS.PLACEHOLDER_CLOSER} `,
            null,
            entityKey,
        );

        const newEditorState = EditorState.push(
            editorState,
            newContentState,
            `insert-placeholder`,
        );

        onChange(newEditorState);
    }

    return (
        <div className="rdw-option-wrapper" onClick={addTextFieldPlaceholder}><FormattedMessage defaultMessage="Текстовое поле"/></div>
    );
}

function ToolbarSelectButton({editorState, onChange}) {
    const addSelectFieldPlaceholder = () => {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'PLACEHOLDER',
            'IMMUTABLE',
            {
                type: CONSTANTS.TYPE_SELECT_FIELD,
                code: v4(),
                placeholder: CONSTANTS.PLACEHOLDER_TEXT_SELECT_FIELD,
            },
        );

        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

        let newContentState = Modifier.replaceText(
            contentStateWithEntity,
            editorState.getSelection(),
            `${CONSTANTS.PLACEHOLDER_TRIGGER}${CONSTANTS.PLACEHOLDER_TEXT_SELECT_FIELD}${CONSTANTS.PLACEHOLDER_CLOSER} `,
            null,
            entityKey,
        );

        const newEditorState = EditorState.push(
            editorState,
            newContentState,
            `insert-placeholder`,
        );

        onChange(newEditorState);
    }

    return (
        <div className="rdw-option-wrapper" onClick={addSelectFieldPlaceholder}><FormattedMessage defaultMessage="Выпадающий список"/></div>
    );
}

export default function BlankEditor({value, onChange, style = {}}) {

    const getInitialContent = () => value ? EditorState.createWithContent(convertFromRaw(value)) : EditorState.createEmpty()

    const [editorState, setEditorState] = React.useState(getInitialContent);
    const [autocompleteState, setAutocompleteState] = React.useState(null);
    const [properties, setProperties] = React.useState(null);
    const [open_properties, setOpenProperties] = React.useState(false);

    const handleCloseDrawer = () => {
        setOpenProperties(false);
    }

    const renderPlaceholder = (text) => {
        setEditorState(renderPlaceholderText(editorState, autocompleteState, text));
        setAutocompleteState(null);
    }

    React.useEffect(() => {
        const contentState = editorState.getCurrentContent();
        if (contentState) {
            const startKey = editorState.getSelection().getStartKey();
            const selectionState = editorState.getSelection();
            const start = selectionState.getStartOffset();
            const selectedBlock = editorState.getCurrentContent().getBlockForKey(startKey);
            const entity_key = selectedBlock.getEntityAt(start);
            if (entity_key) {
                const entity = contentState.getEntity(entity_key);
                if (entity !== null) {
                    const entity_data = entity.getData();

                    setEditorState(EditorState.moveSelectionToEnd(editorState));
                    setOpenProperties(true);
                    setProperties({
                        ...entity_data,
                        entity_key
                    })
                }
            }
        }


        const triggerRange = getTriggerRange(CONSTANTS.PLACEHOLDER_TRIGGER);

        if (!triggerRange) {
            setAutocompleteState(null);
            return;
        }

        const search_text = triggerRange.text.slice(CONSTANTS.PLACEHOLDER_TRIGGER.length, triggerRange.text.length);

        setAutocompleteState({
            searchText: search_text
        });

    }, [editorState]);

    return (
        <div style={{...style}}>
            <Editor
                editorKey={'blank_editor'}
                localization={{locale: 'ru',}}
                customDecorators={decorators}
                editorState={editorState}
                onEditorStateChange={(editorState) => {
                    setEditorState(editorState);
                    onChange(convertToRaw(editorState.getCurrentContent()))
                }}
                toolbar={{
                    options: ['inline', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'remove', 'history'],
                    fontSize: {
                        options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
                    },
                    fontFamily: {
                        options: ['Times New Roman', 'Arial', 'Georgia', 'Impact', 'Tahoma', 'Verdana'],
                    },
                }}
                toolbarCustomButtons={[
                    <ToolbarTextFieldButton/>,
                    <ToolbarSelectButton/>
                ]}
            />

            <Drawer
                variant="temporary"
                anchor={'right'}
                open={open_properties}
                onClose={handleCloseDrawer}
                BackdropProps={{invisible: true}}
                style={{width: '350px'}}
            >
                {properties !== null ? (
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                    >
                        <Grid item xs={12} md={12}>
                            <Typography><FormattedMessage defaultMessage="Свойства" id="properties"/></Typography>
                            <Typography>{properties.placeholder}</Typography>
                        </Grid>
                    </Grid>
                ) : null}

            </Drawer>

        </div>
    );
}