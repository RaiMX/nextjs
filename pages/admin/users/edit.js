import React from 'react';
import dynamic from "next/dynamic";
import { useRouter } from 'next/router'

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
import { Grid, TextField, Button, Typography, Paper } from "@material-ui/core";

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
    root: {},
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
}))

const EditUser = observer(function EditUser() {
    const classes = useStyles();
    const { blanksStore } = useStore();

    const intl = useIntl();

    const router = useRouter()
    const { id } = router.query;

    const { control, handleSubmit, reset } = useForm();

    const onSubmit = data => {
        console.log(data);
    };

    return (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            spacing={2}
        >
            <Grid item xs={12} md={8}>
                <Paper className={classes.paper} elevation={3}>
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
                                    defaultValue={''}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => <TextField

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
                                    defaultValue={''}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => <TextField

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
                                    defaultValue={''}
                                    render={({ field: { onChange, value }, fieldState: { error } }) =>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                                            <KeyboardDatePicker

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
                                    defaultValue={''}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => <TextField
                                        label="Номер документа"

                                        value={value ? value : ''}
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error ? error.message : null}
                                        style={{ width: '100%' }}
                                    />}

                                />
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <Typography variant="caption"><FormattedMessage id="сreated_by" defaultMessage="Кем создано" />: {''} </Typography>
                                <Typography variant="caption"><FormattedMessage id="updated_by" defaultMessage="Кем обновлено" />: {''}</Typography>
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <Button type="submit" form="form-blank" className={classes.tabButton} variant={'contained'} color={'primary'} ><FormattedMessage id="Применить" /></Button>
                            </Grid>

                        </Grid>
                    </form>
                </Paper>

            </Grid>
        </Grid>

    );
})

export default EditUser