import React from 'react';
import dynamic from "next/dynamic";

/** COMPONENTS */
import {useStore} from 'store/store_provider'
import {decorators} from "./decorators/form_decorators";

/** THIRD PARTY */
import {convertFromRaw, convertToRaw, EditorState} from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

/** DYNAMIC IMPORT */
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), {ssr: false})

export default function BlankFill({blank, value, onChange, style = {}}) {
    const {blanksStore} = useStore();

    const getInitialContent = () => {
        if (value) {
            return EditorState.createWithContent(convertFromRaw(value))
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
        }))
    }

    const [editorState, setEditorState] = React.useState(getInitialContent);
    const [lists_ready, setListsReady] = React.useState(false);

    React.useEffect(() => {
        setEditorState(getInitialContent);
    }, [value]);

    React.useEffect(() => {
        blanksStore.fetchSelectListValues().then(() => {
            setListsReady(true);
        })
    }, [])

    return (
        <div style={{...style}}>
            {lists_ready ? <Editor
                editorKey={'blank_form'}
                readOnly={true}
                localization={{locale: 'ru',}}
                editorState={editorState}
                customDecorators={decorators}
                onChange={(editorState) => {
                    console.log('CHANGED!')
                    onChange(convertToRaw(editorState.getCurrentContent()))
                }}
                toolbarHidden
            /> : null}
        </div>
    );
}