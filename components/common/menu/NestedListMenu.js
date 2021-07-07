import React from 'react';

// import {Link as RouterLink} from 'react-router-dom';
import Link from 'components/mods/nextjs/Link';

/** THIRD PARTY */
import {FormattedMessage} from 'react-intl';

import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import IconExpandLess from '@material-ui/icons/ExpandLess';
import IconExpandMore from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {},
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));


function ListItemLink(props) {
    const classes = useStyles()
    const {icon, primary, to, expanded, show_expand, is_child} = props;

    const renderLink = React.useMemo(
        () => React.forwardRef((itemProps, ref) => <Link href={to} ref={ref} {...itemProps} />),
        [to],
    );

    return (
        <li>
            <ListItem button component={renderLink} className={is_child ? classes.nested : ''}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary}/>
                {!expanded && show_expand && <IconExpandMore/>}
                {expanded && show_expand && <IconExpandLess/>}
            </ListItem>
        </li>
    );
}

ListItemLink.propTypes = {
    icon: PropTypes.element,
    primary: PropTypes.any.isRequired,
    to: PropTypes.string.isRequired,
};

const getIcon = name => {
    switch (name) {
        case 'InboxIcon':
            return <InboxIcon/>
    }
}

const AppMenuItem = props => {
    const {item, icon, is_child} = props
    const classes = useStyles()
    const isExpandable = item && item?.children && item.children.length > 0
    const [open, setOpen] = React.useState(true)

    function handleClick() {
        setOpen(!open)
    }

    const MenuItemChildren = isExpandable ? (
        <Collapse in={open} timeout="auto">
            <Divider/>
            <List component="div" disablePadding>
                {item.children.map((child, index) => (
                    <AppMenuItem key={index} item={child} icon={getIcon(child.icon)} is_child={true}/>
                ))}
            </List>
        </Collapse>
    ) : null

    if (item?.hidden) {
        return null;
    }

    return (
        <>
            {isExpandable ? (
                <li>
                    <ListItem button onClick={handleClick} className={is_child ? classes.nested : ''}>
                        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                        <ListItemText primary={item.name}/>
                        {isExpandable && !open && <IconExpandMore/>}
                        {isExpandable && open && <IconExpandLess/>}
                    </ListItem>
                </li>
            ) : (
                <ListItemLink key={item.to} to={item.to} primary={item.name} icon={getIcon(item.icon)} is_child={is_child}/>
            )}
            {MenuItemChildren}
        </>
    )
}

export default function NestedListMenu({menu_items = []}) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Paper elevation={0}>
                <List aria-label="main">
                    <ListItemLink key={'/'} to={'/'} primary={<FormattedMessage defaultMessage="Главная"/>}/>
                    {menu_items.map(item => {
                        if (item?.hidden) {
                            return null;
                        }
                        return <AppMenuItem key={item.to} item={item} icon={getIcon(item.icon)}/>
                    })}
                </List>
            </Paper>
        </div>
    );
}