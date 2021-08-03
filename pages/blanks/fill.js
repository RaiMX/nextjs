import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router'

/** COMPONENTS */
import { AppContext, AppDispatchContext } from "providers/app_provider";
import BlankFill from 'components/blanks/blank_view/BlankFill'
import FormFill from 'components/blanks/form_view/FormFill';
import BlankMetaView from 'components/blanks/blank_meta/blank_meta_view';

/** THIRD PARTY */
import { toast } from 'react-toastify';
import { FormattedMessage, useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite'
import { useStore } from "store/store_provider";
import { EditorState, convertToRaw } from 'draft-js';


/** UTILS */
import api from 'utils/axios';

/** MATERIAL */
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Paper, TextField, AppBar, Tab, Tabs, Toolbar, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {},
    paper: {
        padding: theme.spacing(4),
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        overflow: 'auto',
    },
    titlePaper: {
        padding: theme.spacing(4),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        marginBottom: theme.spacing(2),
        overflow: 'auto',
    },
    tabButton: {
        marginLeft: 5,
        marginRight: 5,
    }
}))

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <>{children}</>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const BlankFillWrapper = observer(function BlankFillWrapper() {
    const classes = useStyles();

    const { blanksStore } = useStore()
    const intl = useIntl();

    const router = useRouter()
    const { id, template_id } = router.query;

    const { app_conf, user_info } = React.useContext(AppContext);
    const { setAppConf } = React.useContext(AppDispatchContext);


    const [unsaved, setUnsaved] = React.useState(false);
    const [tab_index, setTabIndex] = React.useState(0);
    const [blank_data, setBlankData] = React.useState();
    const [content_obj, setContentObj] = React.useState(blanksStore?.editor_state_obj ? blanksStore.editor_state_obj : undefined);

    const createBlank = () => {
        api.post('/blanks/create-filled', {
            variant: 1,
            created_by: user_info.user.id,
            name: blank_data.name,
            template_id: template_id,
            entities_props: blanksStore.entities_props
        }).then(response => {
            toast.success(intl.formatMessage({ id: 'Успешно сохранено!' }));
            setUnsaved(false);
        })
            .catch(error => toast.error(intl.formatMessage({ id: 'Ошибка при сохранении!' })))
    }

    const updateBlank = () => {
        api.post('/blanks/update-filled', {
            id: id,
            variant: 1,
            created_by: blank_data.created_by,
            updated_by: user_info.user.id,
            name: blank_data.name,
            template_id: template_id,
            entities_props: blanksStore.entities_props
        }).then(response => {
            toast.success(intl.formatMessage({ id: 'Успешно сохранено!' }));
            setUnsaved(false);
        })
            .catch(error => toast.error(intl.formatMessage({ id: 'Ошибка при сохранении!' })))
    }

    const saveBlank = () => {
        if (id === undefined) {
            createBlank();
        } else {
            updateBlank();
        }
    }

    const checkUnsaved = () => {
        if (!unsaved) {
            setUnsaved(true);
        }
    }

    const handleMetaFormChange = (meta_data) => {
        setBlankData(meta_data);
        checkUnsaved();
    }

    React.useEffect(() => {
        checkUnsaved();
    }, [blanksStore.change_timestamp])

    React.useEffect(() => {

        if (template_id !== undefined) {
            api.get(`blanks/template/${template_id}`).then(response => {
                const blank = response.data;

                blanksStore.setEditorStateObj({
                    ...blank.editor_state,
                    entityMap: blank.editor_state.entityMap || {}
                });

                if(id === undefined){
                    blanksStore.setEntitiesProps(blank.entities_props);
                    setBlankData(blank);
                }
                
                setContentObj({
                    ...blank.editor_state,
                    entityMap: blank.editor_state.entityMap || {}
                });
            })
        } else {
            toast.error(intl.formatMessage({ id: 'Не указан шаблон формы!' }))
            router.push('/blanks/blanks')
        }

        if (id !== undefined) {
            api.get(`blanks/filled/${id}`).then(response => {
                const blank = response.data;

                blanksStore.setEntitiesProps(blank.entities_props)

                setBlankData(blank);
            })
        }

        return () => {
            blanksStore.clearBlank();
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
            <Grid item xs={12} md={12}>
                <AppBar position="static" color="default">
                    <Toolbar variant="dense">
                        <Tabs
                            value={tab_index}
                            onChange={(event, new_value) => setTabIndex(new_value)}
                            aria-label="constructor tabs"
                            indicatorColor="primary"
                            textColor="primary"
                            style={{ flexGrow: 1 }}
                        >
                            <Tab label={<FormattedMessage defaultMessage={'Данные'} />} {...a11yProps(0)} />
                            <Tab label={<FormattedMessage defaultMessage={'Вид Бланк'} />} {...a11yProps(1)} />
                            <Tab label={<FormattedMessage defaultMessage={'Вид Форма'} />} {...a11yProps(2)} />
                        </Tabs>
                        {unsaved ? <Button className={classes.tabButton} variant={'contained'} color={'secondary'} onClick={() => saveBlank()} ><FormattedMessage id="save_all" defaultMessage="Сохранить всё" /></Button> : <FormattedMessage id="no_changes" defaultMessage="Нет изменений" />}
                    </Toolbar>
                </AppBar>
            </Grid>

            <Grid item xs={12} md={8}>
                <TabPanel value={tab_index} index={0}>
                    <Paper
                        elevation={3}
                        className={classes.paper}
                    >
                        <BlankMetaView
                            blank={blank_data}
                            onChange={handleMetaFormChange}
                        />
                    </Paper>
                </TabPanel>
            </Grid>

            <Grid item xs={12} md={8}>
                <TabPanel value={tab_index} index={1}>
                    <div
                        className={classes.titlePaper}
                    >
                        <Typography style={{ textAlign: 'center' }}>{blank_data?.name}</Typography>
                    </div>

                    <Paper
                        elevation={3}
                        className={classes.paper}
                    >
                        <BlankFill
                            blank={blank_data}
                            value={content_obj}
                        />
                    </Paper>
                </TabPanel>
            </Grid>

            <Grid item xs={12} md={8}>
                <TabPanel value={tab_index} index={2}>
                    <div
                        className={classes.titlePaper}
                    >
                        <Typography style={{ textAlign: 'center' }}>{blank_data?.name}</Typography>
                    </div>

                    <Paper
                        elevation={3}
                        className={classes.paper}
                    >
                        <FormFill />
                    </Paper>
                </TabPanel>
            </Grid>

        </Grid>
    );
})

export default BlankFillWrapper;