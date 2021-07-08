import React from 'react';
import dynamic from "next/dynamic";

/** COMPONENTS */
import {useStore} from 'store/store_provider'
import * as CONSTANTS from "./CONSTANTS";
import {decorators} from './decorators/editor_decorators'
import {getTriggerRange, renderPlaceholderText} from "./helpers/editor_helpers";
import EntityProperties from "./EntityProperties";
import ToolbarButtonInsertPlaceholder from "./helpers/ToolbarButtonInsertPlaceholder";

/** THIRD PARTY */
import {convertFromRaw, convertToRaw, EditorState, Modifier} from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {v4} from 'uuid';
import {FormattedMessage} from 'react-intl';

/** MATERIAL */
import {Divider, Drawer, Grid, IconButton, makeStyles, Typography} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {observer} from "mobx-react-lite";


const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), {ssr: false})

// const decorators = dynamic(() => import('./decorators/editor_decorators').then(mod => mod.decorators),{ ssr: false });

const useStyles = makeStyles((theme) => ({
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '0 8px',
        height: '20px',
        ...theme.mixins.toolbar,
    },
}))

const BlankEditor = observer(function BlankEditor({value, onChange, style = {}}) {
    const classes = useStyles();
    const {blanksStore} = useStore();

    const getInitialContent = () => value ? EditorState.createWithContent(convertFromRaw(value)) : EditorState.createEmpty()

    const [editorState, setEditorState] = React.useState(getInitialContent);
    const [autocompleteState, setAutocompleteState] = React.useState(null);
    const [properties, setProperties] = React.useState(null);
    const [open_properties, setOpenProperties] = React.useState(false);

    const handleCloseDrawer = () => {
        setEditorState(EditorState.moveSelectionToEnd(editorState));
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

                    blanksStore.setSelectedEntityCode(entity_data.code);

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
                    <ToolbarButtonInsertPlaceholder field_type_code={CONSTANTS.TYPE_TEXT_FIELD} label={'Текстовое поле'}/>,
                    <ToolbarButtonInsertPlaceholder field_type_code={CONSTANTS.TYPE_NUMBER_FIELD} label={'Числовое поле'}/>,
                    <ToolbarButtonInsertPlaceholder field_type_code={CONSTANTS.TYPE_SELECT_FIELD} label={'Выпадающий список'}/>,
                    <ToolbarButtonInsertPlaceholder field_type_code={CONSTANTS.TYPE_TABLE_FIELD} label={'Таблица'}/>,
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
                    <>
                        <div className={classes.toolbarIcon}>
                            <IconButton onClick={handleCloseDrawer}>
                                <ChevronRightIcon/>
                            </IconButton>
                            <Typography><FormattedMessage defaultMessage="Свойства" id="properties"/></Typography>
                        </div>
                        <Divider/>
                        <EntityProperties/>
                    </>
                ) : null}

            </Drawer>

        </div>
    );
})

export default BlankEditor;