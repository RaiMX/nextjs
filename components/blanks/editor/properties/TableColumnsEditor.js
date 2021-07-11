import React from 'react';

/** COMPONENTS */
import {useStore} from 'store/store_provider'
import {extractColsMeta} from "../../blanks_utils";

/** THIRD PARTY */
import {observer} from "mobx-react-lite";
import {HotTable} from '@handsontable/react'
import 'handsontable/dist/handsontable.full.css';
import {registerLanguageDictionary, ruRU} from 'handsontable/i18n';

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';

registerLanguageDictionary(ruRU);

const useStyles = makeStyles((theme) => ({
	root: {},
	handsontable: {
		marginLeft: 20,
		marginRight: 20,
	}
}))

const TableColumnsEditor = observer(function TableColumnsEditor({entity_code, entity_properties}) {
	const classes = useStyles();
	const {blanksStore} = useStore();

	const hotTableComponent = React.useRef(null);

	const [col_headers, setColHeaders] = React.useState([]);
	const [data, setData] = React.useState([['Столбец 1']]);
	const [settings, setSettings] = React.useState({
		licenseKey: "non-commercial-and-evaluation"
	});


	const getMergeCells = () => {
		const merge_cells = [];
		col_headers && col_headers.map(header => {
			if (header.spanned) {
				merge_cells.push({
					row: header.row,
					col: header.col,
					rowspan: header.rowspan,
					colspan: header.colspan,
				})
			}
		})

		return merge_cells.length > 0 ? merge_cells : true
	}

	const handleChange = (change, source) => {
		if (['loadData', 'CopyPaste.paste', 'populateFromArray'].indexOf(source) > -1) {
			//don't save this change, change triggerred by LOADING DATA into handsontable
			// OR some other actions
			return;
		}

		console.log('source', source);

		if (hotTableComponent.current !== null && hotTableComponent.current.hotInstance) {
			const hot_data = hotTableComponent.current.hotInstance.getData();
			const cells_meta = hotTableComponent.current.hotInstance.getCellsMeta();

			console.log('hot_data', hot_data)
			console.log('hot_meta', cells_meta)

			const _col_headers = extractColsMeta(cells_meta, hot_data);
			console.log('_col_headers', _col_headers)

			blanksStore.setEntityProperty(entity_code, 'table_col_headers', _col_headers);
			blanksStore.setEntityProperty(entity_code, 'table_col_headers_data', hot_data);
		}
	}

	const handleRemoveRow = (index, amount, physicalRows, source) => {
		console.log(index, amount, physicalRows, source)

		const hot_data = hotTableComponent.current.hotInstance.getData();
		const cells_meta = hotTableComponent.current.hotInstance.getCellsMeta().filter(c => {
			return physicalRows.indexOf(c.row) <= -1;
		})

		console.log('hot_data', hot_data)
		console.log('hot_meta', cells_meta)

		const _col_headers = extractColsMeta(cells_meta, hot_data);
		console.log('_col_headers', _col_headers)

		blanksStore.setEntityProperty(entity_code, 'table_col_headers', _col_headers);
		blanksStore.setEntityProperty(entity_code, 'table_col_headers_data', hot_data);
	}

	const handleRemoveCol = (index, amount, physicalCols, source) => {
		console.log(index, amount, physicalCols, source)

		const hot_data = hotTableComponent.current.hotInstance.getData();
		const cells_meta = hotTableComponent.current.hotInstance.getCellsMeta().filter(c => {
			return physicalCols.indexOf(c.col) <= -1;
		})

		console.log('hot_data', hot_data)
		console.log('hot_meta', cells_meta)

		const _col_headers = extractColsMeta(cells_meta, hot_data);
		console.log('_col_headers', _col_headers)

		blanksStore.setEntityProperty(entity_code, 'table_col_headers', _col_headers);
		blanksStore.setEntityProperty(entity_code, 'table_col_headers_data', hot_data);
	}

	React.useEffect(() => {
		setColHeaders(blanksStore.entities_props[entity_code]['table_col_headers']);
		setData(blanksStore.entities_props[entity_code]['table_col_headers_data']);
	}, [])

	return (
		<HotTable
			ref={hotTableComponent}
			id={'hot-columns'}
			className={classes.handsontable}

			licenseKey={"non-commercial-and-evaluation"}
			data={data}
			// colHeaders={(index) => (index + 1)}
			colHeaders={false}
			rowHeaders={false}
			// width={'50%'}
			height={"auto"}
			contextMenu={true}
			language={ruRU.languageCode}
			manualColumnResize={true}
			manualRowResize={true}
			// stretchH={'last'}
			mergeCells={getMergeCells()}
			afterChange={function (change, source) {
				handleChange(change, source)
			}}
			afterRemoveRow={function (index, amount, physicalRows, source) {
				handleRemoveRow(index, amount, physicalRows, source)
			}}
			afterRemoveCol={function (index, amount, physicalCols, source) {
				handleRemoveCol(index, source)
			}}
			afterContextMenuShow={function (context) {
				// document.querySelector(".htContextMenu").style.zIndex = 9999;

				let style = document.createElement('style');
				style.innerHTML = `
						  .htContextMenu {
								z-index: 9999 !important;
							}
						  `;
				document.head.appendChild(style);
			}}
		/>
	);
})

export default TableColumnsEditor