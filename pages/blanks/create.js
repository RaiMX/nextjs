import React from 'react';
import PropTypes from 'prop-types';
import './create.module.css'

/** COMPONENTS */
import {AppContext, AppDispatchContext} from "providers/app_provider";
import BlankEditor from 'components/blanks/editor/BlankEditor';
import BlankPreview from 'components/blanks/blank_preview/BlankPreview'
import FormPreview from "../../components/blanks/form_preview/FormPreview";

/** THIRD PARTY */
import {FormattedMessage} from 'react-intl';
import {observer} from 'mobx-react-lite'
import {useStore} from "store/store_provider";

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import {Button, Grid, Paper} from "@material-ui/core";


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
    const {children, value, index, ...other} = props;

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

const BlankCreate = observer(function BlankCreate() {
    const classes = useStyles();

    const {blanksStore} = useStore()

    const {app_conf} = React.useContext(AppContext);
    const {setAppConf} = React.useContext(AppDispatchContext);

    const [tab_index, setTabIndex] = React.useState(0);
    const [content_obj, setContentObj] = React.useState(blanksStore?.editor_state_obj ? blanksStore.editor_state_obj : undefined);

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
                <Button className={classes.tabButton} variant={'contained'} color={tab_index === 0 ? 'primary' : 'default'} onClick={() => setTabIndex(0)}><FormattedMessage defaultMessage={'Конструктор'}/></Button>
                <Button className={classes.tabButton} variant={'contained'} color={tab_index === 1 ? 'primary' : 'default'} onClick={() => setTabIndex(1)}><FormattedMessage defaultMessage={'Вид Бланк'}/></Button>
                <Button className={classes.tabButton} variant={'contained'} color={tab_index === 2 ? 'primary' : 'default'} onClick={() => setTabIndex(2)}><FormattedMessage defaultMessage={'Вид Форма'}/></Button>
            </Grid>

            <Grid item xs={12} md={8}>
                <TabPanel value={tab_index} index={0}>
                    <Paper
                        elevation={3}
                    >
                        <BlankEditor
                            value={content_obj}
                            onChange={(_content_obj) => {

                                console.log('content_obj', _content_obj);

                                blanksStore.setEditorStateObj(_content_obj)
                                setContentObj(_content_obj)
                            }}
                        />
                    </Paper>
                </TabPanel>
            </Grid>

            <Grid item xs={12} md={8}>
                <TabPanel value={tab_index} index={1}>
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
                <TabPanel value={tab_index} index={2}>
                    <Paper
                        elevation={3}
                        className={classes.paper}
                    >
                        <FormPreview/>
                    </Paper>
                </TabPanel>
            </Grid>

        </Grid>
    );
})

export default BlankCreate;