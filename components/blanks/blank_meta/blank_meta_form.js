import React from 'react';
import dynamic from "next/dynamic";

/** COMPONENTS */
import { useStore } from 'store/store_provider'

/** THIRD PARTY */
import { toast } from 'react-toastify';
import { FormattedMessage, useIntl } from 'react-intl';
import { observer } from "mobx-react-lite";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";

/** MATERIAL */
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Button } from "@material-ui/core";

/** LOADING WITHOUT SSR because Component does not support SSR */
// const TableFieldElement = dynamic(() => import('./elements/TableFieldElement'), { ssr: false });


const useStyles = makeStyles((theme) => ({
    root: {}
}))

const BlankMetaForm = observer(function BlankMetaForm({ blank, onChange }) {
    const classes = useStyles();
    const { blanksStore } = useStore();

    const intl = useIntl();

    const { control, handleSubmit, reset } = useForm();

    const onSubmit = data => {
        console.log(data);

        onChange(data)
    };

    React.useEffect(() => {

        if(blank){
            reset({
                name: blank.name
            })
        }
    }, [blank && blank.name])

    return (
        <form id="form-blank" onSubmit={handleSubmit(onSubmit)}>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={2}
            >
                <Grid item xs={12} md={6}>
                    <Controller
                        name="name"
                        control={control}
                        defaultValue={blank ? blank.name : ''}
                        render={({ field: { onChange, value }, fieldState: { error } }) => <TextField
                            label="Название формы"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />}
                    />
                </Grid>

                <Grid item xs={12} md={12}>
                    <Button type="submit" form="form-blank" className={classes.tabButton} variant={'contained'} color={'primary'} ><FormattedMessage id="Применить" /></Button>
                </Grid>
            </Grid>
        </form>
    );
})

export default BlankMetaForm