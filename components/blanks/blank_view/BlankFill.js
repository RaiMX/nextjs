import React from 'react';
import dynamic from "next/dynamic";

/** COMPONENTS */
import {decorators} from "./decorators/form_decorators";

/** THIRD PARTY */
import {convertFromRaw, convertToRaw, EditorState} from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

/** DYNAMIC IMPORT */
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), {ssr: false})

export default function BlankPreview({blank, value, onChange, style = {}}) {

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

    React.useEffect(() => {
        setEditorState(getInitialContent);
    }, [value]);

    return (
        <div style={{...style}}>
            <Editor
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
            />
        </div>
    );
}