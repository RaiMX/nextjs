import React from 'react';
import dynamic from "next/dynamic";

/** COMPONENTS */
import {useStore} from 'store/store_provider'
import {makeTree, buildNestedHeaders} from "../helpers/editor_helpers";

/** THIRD PARTY */
import {observer} from "mobx-react-lite";
import {FormattedMessage} from 'react-intl';
import {HotTable} from '@handsontable/react'
import 'handsontable/dist/handsontable.full.css';
import {registerLanguageDictionary, ruRU} from 'handsontable/i18n';

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {MenuItem, Select, TextField} from "@material-ui/core";


registerLanguageDictionary(ruRU);

const useStyles = makeStyles((theme) => ({
	root: {},
	handsontable: { //wrap column headers
		'& th': {
			whiteSpace: 'normal!important'
		}
	}
}))

const headers = [
	{
		id: 1,
		pid: null,
		label: 'Порядок убеждения в свободности стрелки от подвижного состава',
	},
	{
		id: 2,
		pid: null,
		label: 'Порядок убеждения в свободности стрелки от подвижного состава',
	},
	{
		id: 3,
		pid: 1,
		label: 'при нормальном действии устройств СЦБ',
	},
	{
		id: 4,
		pid: 1,
		label: 'при неисправности устройств СЦБ',
	},
]

const TableFieldDecorator = observer(function TableFieldDecorator({entity_props}) {
	const classes = useStyles();
	const {blanksStore} = useStore();

	const hotTableComponent = React.useRef(null);

	const [value, setValue] = React.useState(entity_props?.value?.value ? entity_props.value.value : undefined)

	React.useEffect(() => {
		if (blanksStore.entities_props[entity_props.code]['value']) {
			setValue(blanksStore.entities_props[entity_props.code]['value']['value']);
		}
	}, [blanksStore.entities_props[entity_props.code]['value']])


	const {tree, flat, num_levels, max_cols} = makeTree(blanksStore.entities_props[entity_props.code]['table_col_headers'], 'id', 'pid');
	const nested_headers = buildNestedHeaders(flat, num_levels);

	nested_headers.push((new Array(max_cols).fill(0)).map((x, index) => (index + 1)))

	const empty_row_data = new Array(max_cols - 1)
	const data = [empty_row_data];

	const handleChange = (change, source) => {
		if (source === 'loadData') {
			return; //don't save this change, change triggerred by LOADING DATA into handsontable
		}

		if (hotTableComponent.current !== null) {
			const hot = hotTableComponent.current.hotInstance;
			const hot_data = hot.getData();
			const hot_meta = hot.getCellsMeta();

			console.log('change', change)
			console.log('hot_data', hot_data)
			console.log('hot_meta', hot_meta)
		}
	}

	return (
		<HotTable
			ref={hotTableComponent}
			id={'hot'}
			className={classes.handsontable}

			settings={{
				licenseKey: "non-commercial-and-evaluation",
				data: data,
				colHeaders: true,
				rowHeaders: false,
				// width:'100%',
				height: "auto",
				contextMenu: true,
				language: ruRU.languageCode,
				manualColumnResize: true,
				manualRowResize: true,
				stretchH: 'last',
				nestedHeaders: nested_headers,
				mergeCells: true,
				afterChange: function (change, source) {
					handleChange(change, source)
				}
			}}


			// afterChange={(change, source) => handleChange(change, source)}
		/>
	);
})

export default TableFieldDecorator