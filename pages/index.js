import React from 'react';

import EditorDraft from '../components/test/editor_draft';
import Editor from '../components/test/editor';
import MyForm from "../components/test/form";
import {convertToRaw} from "draft-js";

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

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

    return (
        <>
            <div>This is a test</div>
        </>
    );
}
