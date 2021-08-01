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

import ruLocale from "date-fns/locale/ru";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

/** LOADING WITHOUT SSR because Component does not support SSR */
// const TableFieldElement = dynamic(() => import('./elements/TableFieldElement'), { ssr: false });


const useStyles = makeStyles((theme) => ({
    root: {}
}))

const BlankMetaForm = observer(function BlankMetaForm({ blank, read_only, onChange }) {
    const classes = useStyles();
    const { blanksStore } = useStore();

    const intl = useIntl();

    const { control, handleSubmit, reset } = useForm();

    const onSubmit = data => {
        console.log(data);

        onChange(data)
    };

    React.useEffect(() => {

        if (blank) {
            reset({ ...blank })
        }
    }, [blank])

    return (
        <form id="form-blank" onSubmit={handleSubmit(onSubmit)}>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={2}
            >
                <Grid item xs={12} md={12}>
                    <Controller
                        name="name"
                        control={control}
                        defaultValue={blank?.name}
                        render={({ field: { onChange, value }, fieldState: { error } }) => <TextField
                            disabled={read_only}
                            label="Название формы"
                            value={value ? value : ''}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                            style={{ width: '100%' }}
                        />}

                    />
                </Grid>

                <Grid item xs={12} md={12}>
                    <Controller
                        name="based_on"
                        control={control}
                        defaultValue={blank?.based_on}
                        render={({ field: { onChange, value }, fieldState: { error } }) => <TextField
                            disabled={read_only}
                            label="Основание утверждения"
                            value={value ? value : ''}
                            multiline
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                            style={{ width: '100%' }}
                        />}

                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <Controller
                        name="doc_date"
                        control={control}
                        defaultValue={blank?.doc_date}
                        render={({ field: { onChange, value }, fieldState: { error } }) =>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                                <KeyboardDatePicker
                                    disabled={read_only}
                                    autoOk
                                    disableToolbar
                                    variant="inline"
                                    format="dd.MM.yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Дата утверждения"
                                    value={value ? value : null}
                                    onChange={onChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    style={{ width: '100%', marginTop: 0 }}
                                />
                            </MuiPickersUtilsProvider>
                        }
                    />

                </Grid>

                <Grid item xs={12} md={3}>
                    <Controller
                        name="doc_number"
                        control={control}
                        defaultValue={blank?.doc_number}
                        render={({ field: { onChange, value }, fieldState: { error } }) => <TextField
                            label="Номер документа"
                            disabled={read_only}
                            value={value ? value : ''}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                            style={{ width: '100%' }}
                        />}

                    />
                </Grid>

                {read_only ? null : (
                    <Grid item xs={12} md={12}>
                        <Button type="submit" form="form-blank" className={classes.tabButton} variant={'contained'} color={'primary'} ><FormattedMessage id="Применить" /></Button>
                    </Grid>
                )}

            </Grid>
        </form>
    );
})

export default BlankMetaForm