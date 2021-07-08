import React from 'react';
import PropTypes from 'prop-types';
import dynamic from "next/dynamic";
import './create.module.css'

/** COMPONENTS */
import {AppContext, AppDispatchContext} from "providers/app_provider";
import BlankEditor from 'components/blanks/BlankEditor';
import BlankPreview from 'components/blanks/BlankPreview'

/** THIRD PARTY */
import {FormattedMessage} from 'react-intl';
import {observer} from 'mobx-react-lite'
import {useStore} from "store/store_provider";

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {AppBar, Button, Grid, Paper} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    root: {},
    paper: {
        padding: theme.spacing(4),
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        overflow: 'auto',
    },
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
                <Button style={{marginRight: 10}} variant={'contained'} color={tab_index === 0 ? 'primary' : 'default'} onClick={() => setTabIndex(0)}><FormattedMessage defaultMessage={'Конструктор'}/></Button>
                <Button variant={'contained'} color={tab_index === 1 ? 'primary' : 'default'} onClick={() => setTabIndex(1)}><FormattedMessage defaultMessage={'Просмотр'}/></Button>
            </Grid>

            <Grid item xs={12} md={8}>
                <TabPanel value={tab_index} index={0}>
                    <Paper
                        elevation={3}
                    >
                        <BlankEditor
                            value={content_obj}
                            onChange={(content_obj) => {

                                // console.log('content_obj', content_obj);

                                blanksStore.setEditorStateObj(content_obj)
                                setContentObj(content_obj)
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
        </Grid>
    );
})

export default BlankCreate;