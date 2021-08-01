import React from 'react';
import dynamic from "next/dynamic";

/** COMPONENTS */
import { useStore } from 'store/store_provider'
import BlankMetaForm from './form/form';

/** THIRD PARTY */
import { toast } from 'react-toastify';
import { FormattedMessage, useIntl } from 'react-intl';
import { observer } from "mobx-react-lite";

/** MATERIAL */
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Button } from "@material-ui/core";

/** LOADING WITHOUT SSR because Component does not support SSR */
// const TableFieldElement = dynamic(() => import('./elements/TableFieldElement'), { ssr: false });


const useStyles = makeStyles((theme) => ({
    root: {}
}))

const MetaView = observer(function MetaView({ blank, onChange }) {
    const classes = useStyles();
    const { blanksStore } = useStore();

    const intl = useIntl();

    return (
        <BlankMetaForm
            read_only={true}
            blank={blank}
            onChange={onChange}
        />
    );
})

export default MetaView