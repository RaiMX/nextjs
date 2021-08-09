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

/** UTILS */
import api from 'utils/axios'

/** MATERIAL */
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Button, Typography, Paper, Divider } from "@material-ui/core";

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

    const [user, setUser] = React.useState();
    const [constants, setConstants] = React.useState();

    const renderSubjects = () => {
        const rows = [];

        const subjects_codes = Object.keys(constants.subjects);
        for (let i = 0; i < subjects_codes.length; i++) {
            const subject = constants.subjects[subjects_codes[i]];
            rows.push(
                <Grid
                    key={i}
                    item
                    xs={12} md={12}
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={2}
                >
                    <Grid item xs={12} md={6}>
                        <Typography>{subject.name}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {Object.keys(constants.actions).map(action_code => {
                            return <Typography>{constants.actions[action_code].name}</Typography>
                        })}
                    </Grid>
                </Grid>
            )

        }

        return rows;
    }

    const onSubmit = data => {
        console.log(data);
    };

    React.useEffect(() => {
        if (id !== undefined) {
            api.get('access/get-constants').then(response => setConstants(response.data))
            api.get(`users/${id}/profile`).then(response => {
                setUser(response.data)
                reset(response.data)
            })
        }

    }, [])

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
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="username"
                                    control={control}
                                    defaultValue={''}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => <TextField

                                        label={intl.formatMessage({ defaultMessage: 'Имя пользователя' })}
                                        value={value ? value : ''}
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error ? error.message : null}
                                        style={{ width: '100%' }}
                                    />}

                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="email"
                                    control={control}
                                    defaultValue={''}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => <TextField

                                        label="Email"
                                        value={value ? value : ''}
                                        multiline
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error ? error.message : null}
                                        style={{ width: '100%' }}
                                    />}

                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Controller
                                    name="last_name"
                                    control={control}
                                    defaultValue={''}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => <TextField

                                        label={intl.formatMessage({ defaultMessage: 'Фамилия' })}
                                        value={value ? value : ''}
                                        multiline
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error ? error.message : null}
                                        style={{ width: '100%' }}
                                    />}

                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Controller
                                    name="first_name"
                                    control={control}
                                    defaultValue={''}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => <TextField

                                        label={intl.formatMessage({ defaultMessage: 'Имя' })}
                                        value={value ? value : ''}
                                        multiline
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error ? error.message : null}
                                        style={{ width: '100%' }}
                                    />}

                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Controller
                                    name="middle_name"
                                    control={control}
                                    defaultValue={''}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => <TextField

                                        label={intl.formatMessage({ defaultMessage: 'Отчество' })}
                                        value={value ? value : ''}
                                        multiline
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error ? error.message : null}
                                        style={{ width: '100%' }}
                                    />}

                                />
                            </Grid>

                            <Grid item xs={12} md={12} style={{ marginTop: 20 }}>
                                <Typography variant="body1"><FormattedMessage defaultMessage="Доступы" /></Typography>
                                <Divider />
                            </Grid>

                            <Grid
                                item
                                xs={12} md={12}
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                                spacing={2}
                            >
                                {constants?.subjects ? renderSubjects() : null}


                            </Grid>



                            <Grid item xs={12} md={12}>
                                <Divider />
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