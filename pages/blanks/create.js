import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router'

/** COMPONENTS */
import { AppContext, AppDispatchContext } from "providers/app_provider";
import BlankEditor from 'components/blanks/blank_editor/BlankEditor';
import BlankPreview from 'components/blanks/blank_preview/BlankPreview'
import FormPreview from "../../components/blanks/form_preview/FormPreview";
import BlankMetaForm from 'components/blanks/blank_meta/blank_meta_form';

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
import { Button, Grid, Paper, TextField, AppBar, Tab, Tabs, Toolbar } from "@material-ui/core";
import SubjectIcon from '@material-ui/icons/Subject';



const useStyles = makeStyles((theme) => ({
    root: {},
    paper: {
        padding: theme.spacing(4),
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
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

const BlankCreate = observer(function BlankCreate() {
    const classes = useStyles();

    const { blanksStore } = useStore()
    const intl = useIntl();

    const router = useRouter()
    const { id } = router.query;

    const { app_conf } = React.useContext(AppContext);
    const { setAppConf } = React.useContext(AppDispatchContext);


    const [unsaved, setUnsaved] = React.useState(false);
    const [tab_index, setTabIndex] = React.useState(0);
    const [blank_data, setBlankData] = React.useState();
    const [content_obj, setContentObj] = React.useState(blanksStore?.editor_state_obj ? blanksStore.editor_state_obj : undefined);

    const createBlank = () => {
        api.post('/blanks/create', {
            version: 1,
            name: blank_data.name,
            based_on: blank_data.based_on,
            doc_date: blank_data.doc_date,
            doc_number: blank_data.doc_number,
            editor_state: content_obj,
            entities_props: blanksStore.entities_props
        }).then(response => toast.success(intl.formatMessage({ id: 'Успешно сохранено!' })))
            .catch(error => toast.error(intl.formatMessage({ id: 'Ошибка при сохранении!' })))
    }

    const updateBlank = () => {
        api.post('/blanks/update', {
            id: id,
            version: 1,
            name: blank_data.name,
            based_on: blank_data.based_on,
            doc_date: blank_data.doc_date,
            doc_number: blank_data.doc_number,
            editor_state: content_obj,
            entities_props: blanksStore.entities_props
        }).then(response => toast.success(intl.formatMessage({ id: 'Успешно сохранено!' })))
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
        if(!unsaved){
            setUnsaved(true);
        }
    }

    const handleMetaFormChange = (meta_data) => {
        setBlankData(meta_data);
        checkUnsaved();
    }

    const handleEditorChange = (_content_obj) => {
        blanksStore.setEditorStateObj(_content_obj)
        setContentObj(_content_obj) //TODO: Optimize so that other components read store, not value
        checkUnsaved();
    }

    //start the clock when the component is mounted
    // React.useEffect(() => {
    //     store.appStore.start()
    //
    //     //stop the clock when the component unmounts
    //     return () => {
    //         store.appStore.stop()
    //     }
    // }, [store.appStore])

    React.useEffect(() => {

        if (id !== undefined) {
            api.get(`blanks/${id}`).then(response => {
                const blank = response.data;

                blanksStore.setEditorStateObj({
                    ...blank.editor_state,
                    entityMap: blank.editor_state.entityMap || {}
                });

                blanksStore.setEntitiesProps(blank.entities_props)

                setBlankData(blank);
                setContentObj({
                    ...blank.editor_state,
                    entityMap: blank.editor_state.entityMap || {}
                });
            })
        } else {
            setContentObj({ blocks: [], entityMap: {} });
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
                        style={{flexGrow: 1}}
                    >
                        <Tab label={<FormattedMessage defaultMessage={'Данные'} />} {...a11yProps(0)} />
                        <Tab label={<FormattedMessage defaultMessage={'Конструктор'} />} {...a11yProps(1)} />
                        <Tab label={<FormattedMessage defaultMessage={'Вид Бланк'} />} {...a11yProps(2)} />
                        <Tab label={<FormattedMessage defaultMessage={'Вид Форма'} />} {...a11yProps(3)} />
                    </Tabs>
                        {unsaved ? <Button className={classes.tabButton} variant={'contained'} color={'secondary'} onClick={() => saveBlank()} ><FormattedMessage id="Сохранить всё" /></Button> : <FormattedMessage id="Нет изменений" />}
                    </Toolbar>
                </AppBar>
            </Grid>

            <Grid item xs={12} md={8}>
                <TabPanel value={tab_index} index={0}>
                    <Paper
                        elevation={3}
                        className={classes.paper}
                    >
                        <BlankMetaForm 
                            blank={blank_data}
                            onChange={handleMetaFormChange}
                        />
                    </Paper>
                </TabPanel>
            </Grid>

            <Grid item xs={12} md={8}>
                <TabPanel value={tab_index} index={1}>
                    <Paper
                        elevation={3}
                    >
                        {content_obj ? (
                            <BlankEditor
                                value={content_obj}
                                onChange={handleEditorChange}
                            />
                        ) : null}

                    </Paper>
                </TabPanel>
            </Grid>

            <Grid item xs={12} md={8}>
                <TabPanel value={tab_index} index={2}>
                    <Paper
                        elevation={3}
                        className={classes.paper}
                    >
                        <BlankPreview
                            value={content_obj}
                            onChange={(content) => {

                            }}
                        />
                    </Paper>
                </TabPanel>
            </Grid>

            <Grid item xs={12} md={8}>
                <TabPanel value={tab_index} index={3}>
                    <Paper
                        elevation={3}
                        className={classes.paper}
                    >
                        <FormPreview />
                    </Paper>
                </TabPanel>
            </Grid>

        </Grid>
    );
})

export default BlankCreate;