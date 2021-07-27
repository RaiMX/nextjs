import React from 'react';

/** THIRD PARTY */
import {observer} from "mobx-react-lite";
import {FormattedMessage} from 'react-intl';
import {toast} from "react-toastify";
import MaterialTable from "material-table";
import {mtLocalization, mtTableIcons} from "utils/common";
import Select from 'react-select';

import 'date-fns';
import ruLocale from "date-fns/locale/ru";
import DateFnsUtils from '@date-io/date-fns';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
	DatePicker
} from '@material-ui/pickers';

/** HOOKS */


/** UTILS */
import api from "utils/axios";
import {camelToSnakeCase, prepLookup} from "utils/data_utils";
import date_utils from "utils/date_utils";


/** COMPONENTS */


/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
	root: {}
}))

const SimpleTable = observer(function SimpleTable({
	conf, 
	reload = 0,
	onRowCreated, onRowUpdated, onRowDeleted,
}) {
	const classes = useStyles();

	const tableRef = React.createRef();
	const [isLoading, setIsLoading] = React.useState(true);
    const [show_table, setShowTable] = React.useState(false);

	return (
		<>
			<div>TEXT</div>
		</>
	);
})

export default SimpleTable