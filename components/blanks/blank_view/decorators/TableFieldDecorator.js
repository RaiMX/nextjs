import React from 'react';

/** COMPONENTS */
import {useStore} from 'store/store_provider'
import {buildNestedHeaders, makeTree} from "../../blanks_utils";

/** THIRD PARTY */
import {observer} from "mobx-react-lite";
import {FormattedMessage} from 'react-intl';
import {HotTable} from '@handsontable/react'
import 'handsontable/dist/handsontable.full.css';
import {registerLanguageDictionary, ruRU} from 'handsontable/i18n';

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


registerLanguageDictionary(ruRU);

const useStyles = makeStyles((theme) => ({
	root: {},
	handsontable: { //wrap column headers
		'& th': {
			whiteSpace: 'normal!important'
		}
	}
}))


const TableFieldDecorator = observer(function TableFieldDecorator({entity_props}) {
	const classes = useStyles();
	const {blanksStore} = useStore();

	const hotTableComponent = React.useRef(null);

	const [nested_headers, setNestedHeaders] = React.useState([]);
	const [settings, setSettings] = React.useState({
		licenseKey: "non-commercial-and-evaluation"
	});

	const [max_cols, setMaxCols] = React.useState(1);

	const [value, setValue] = React.useState(entity_props?.value?.value ? entity_props.value.value : []);

	/** Unconfigured table */
	if (!blanksStore.entities_props[entity_props.code]['table_col_headers']) {
		return <Typography><FormattedMessage defaultMessage="Необходимо настроить таблицу"/></Typography>
	}

	const buildTableColHeaders = (table_col_headers) => {
		console.log('input col headers', table_col_headers.length)
		const {tree, flat, num_levels} = makeTree(table_col_headers, 'id', 'pid');
		const _nested_headers = buildNestedHeaders(flat, num_levels);

		let _max_cols = 1
		_nested_headers.map(header => {
			if (header.length > _max_cols) _max_cols = header.length
		})

		if (blanksStore.entities_props[entity_props.code]['table_show_cols_number']) {
			_nested_headers.push((new Array(_max_cols).fill(0)).map((x, index) => (index + 1)));
		}

		console.log('buildTableColHeaders', _max_cols);

		setNestedHeaders(_nested_headers);
		setMaxCols(_max_cols);
	}

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

			blanksStore.setEntityValue(entity_props.code, hot_data);
		}
	}

	React.useEffect(() => {
		if (blanksStore.entities_props[entity_props.code]['value']) {
			setValue(blanksStore.entities_props[entity_props.code]['value']);
		}
	}, [blanksStore.entities_props[entity_props.code]['value']])

	React.useEffect(() => {
		buildTableColHeaders(blanksStore.entities_props[entity_props.code]['table_col_headers']);
		console.log('headers or data changed')
	}, [
		blanksStore.entities_props[entity_props.code]['table_col_headers'],
		blanksStore.entities_props[entity_props.code]['table_col_headers_data'],
	])

	React.useEffect(() => {
		console.log('initial render')
		buildTableColHeaders(blanksStore.entities_props[entity_props.code]['table_col_headers']);
	}, [])

	console.log('table data', value);
	console.log('table cols', nested_headers);
	console.log('table settings', settings);

	if (!value || value.length === 0 || max_cols !== value[0].length) {
		const empty_row_data = new Array(max_cols);
		setValue([empty_row_data])
	}

	return (
		<HotTable
			ref={hotTableComponent}
			id={'hot'}
			className={classes.handsontable}

			licenseKey={"non-commercial-and-evaluation"}
			data={value}
			colHeaders={true}
			rowHeaders={false}
			// width:'100%'}
			height={"auto"}
			contextMenu={true}
			language={ruRU.languageCode}
			manualColumnResize={true}
			manualRowResize={true}
			// stretchH={'last'}
			nestedHeaders={nested_headers}
			mergeCells={true}
			afterChange={function (change, source) {
				handleChange(change, source)
			}}
		/>
	);
})

export default TableFieldDecorator