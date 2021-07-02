import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import Copyright from '../src/Copyright';

import EditorDraft from '../components/test/editor_draft';
import Editor from '../components/test/editor';
import MyForm from "../components/test/form";
import {convertToRaw} from "draft-js";

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        height: `calc(100% - 70px)`,
        paddingTop: theme.spacing(0),
        paddingBottom: theme.spacing(0),
        paddingLeft: theme.spacing(0),
        paddingRight: theme.spacing(0),
    },
}))

export default function Index() {
    const classes = useStyles();

    const [raw_text, setRawText] = React.useState();
    // const [raw_text, setRawText] = React.useState({
    //     "blocks": [
    //         {
    //             "key": "initial",
    //             "text": "sdasd {{three}}  sdsds sd",
    //             "type": "unstyled",
    //             "depth": 0,
    //             "inlineStyleRanges": [],
    //             "entityRanges": [
    //                 {
    //                     "offset": 6,
    //                     "length": 10,
    //                     "key": 0
    //                 }
    //             ],
    //             "data": {}
    //         }
    //     ],
    //     "entityMap": {
    //         "0": {
    //             "type": "PLACEHOLDER",
    //             "mutability": "IMMUTABLE",
    //             "data": {
    //                 "type": "list",
    //                 "code": "my",
    //                 "placeholder": "three"
    //             }
    //         }
    //     }
    // });

    return (
        <>
            <div>This is a test</div>
        </>
    );

    return (
        <>
            <Editor
                style={{float: 'left', marginRight: '50px'}}
                value={raw_text}
                onChange={(content) => {
                    const data = JSON.parse(JSON.stringify(content));
                    setRawText(content)
                }}
            />

            <MyForm
                // style={{float: 'right'}}
                value={raw_text}
                onChange={(content) => {

                }}
            />
        </>
    )
}
