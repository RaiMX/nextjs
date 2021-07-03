import React from 'react';
import PropTypes from 'prop-types';

/** COMPONENTS */
import {AppContext, AppDispatchContext} from "providers/app_provider";
import BlankEditor from 'components/blanks/BlankEditor';
import BlankPreview from 'components/blanks/BlankPreview'

/** THIRD PARTY */
import {FormattedMessage} from 'react-intl';

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

export default function BlankCreate() {
    const classes = useStyles();

    const {app_conf} = React.useContext(AppContext);
    const {setAppConf} = React.useContext(AppDispatchContext);

    const [tab_index, setTabIndex] = React.useState(0);
    const [raw_text, setRawText] = React.useState();

    React.useEffect(() => {

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
                            value={raw_text}
                            onChange={(content) => {
                                const data = JSON.parse(JSON.stringify(content));
                                setRawText(content)
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
                            value={raw_text}
                            onChange={(content) => {

                            }}
                        />
                    </Paper>
                </TabPanel>
            </Grid>
        </Grid>
    );
}