import {EditorState, Modifier} from "draft-js";
import {PLACEHOLDER_TRIGGER, PLACEHOLDER_CLOSER} from "../CONSTANTS";
import {toast} from "react-toastify";


export const getTriggerRange = (trigger) => {
	const selection = window.getSelection();
	if (selection.rangeCount === 0) return null;
	const range = selection.getRangeAt(0);
	const text = range.startContainer.textContent.substring(0, range.startOffset);
	if (/\s+$/.test(text)) return null;
	const index = text.lastIndexOf(trigger);
	if (index === -1) return null;

	return {
		text: text.substring(index),
		start: index,
		end: range.startOffset,
	};
};

export const getInsertRange = (autocompleteState, editorState) => {
	const currentSelectionState = editorState.getSelection();
	const end = currentSelectionState.getAnchorOffset();
	const anchorKey = currentSelectionState.getAnchorKey();
	const currentContent = editorState.getCurrentContent();
	const currentBlock = currentContent.getBlockForKey(anchorKey);
	const blockText = currentBlock.getText();
	const start = blockText.substring(0, end).lastIndexOf(PLACEHOLDER_TRIGGER);

	return {
		start,
		end,
	};
};

/* ----------*
* Modifiers
------------*/

export const renderPlaceholderText = (editorState, autocompleteState, placeholder) => {
	const {start, end} = getInsertRange(autocompleteState, editorState);

	const currentSelectionState = editorState.getSelection();

	const selection = currentSelectionState.merge({
		anchorOffset: start,
		focusOffset: end,
	});

	const contentState = editorState.getCurrentContent();

	const contentStateWithEntity = contentState.createEntity(
		'PLACEHOLDER',
		'IMMUTABLE',
		{
			type: 'list',
			code: 'my',
			placeholder,
		},
	);

	const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

	let newContentState = Modifier.replaceText(
		contentStateWithEntity,
		selection,
		`${PLACEHOLDER_TRIGGER}${placeholder}${PLACEHOLDER_CLOSER} `,
		null,
		entityKey,
	);

	const newEditorState = EditorState.push(
		editorState,
		newContentState,
		`insert-placeholder`,
	);

	return EditorState.forceSelection(
		newEditorState,
		newContentState.getSelectionAfter(),
	);
};

export const makeTree = (array, code_prop = 'code', parent_prop = 'parent_code', children_prop = 'children') => {
	const hashTable = Object.create(null);
	let num_levels = 0;
	let max_cols = 1;

	array.forEach(aData => hashTable[aData[code_prop]] = {
		...aData,
		title: aData['label'],
		level: 0,
		num_desc: 0,
		[children_prop]: [],
		_addDesc: function () {
			this.num_desc += 1;
			if (aData[parent_prop]) {
				hashTable[aData[parent_prop]]._addDesc();
			}
		}
	});

	const dataTree = [];
	array.forEach(aData => {
		if (aData[parent_prop] && hashTable[aData[parent_prop]]) {
			hashTable[aData[code_prop]]['level'] += 1;
			if (hashTable[aData[code_prop]]['level'] > num_levels) {
				num_levels = hashTable[aData[code_prop]]['level'];
			}

			hashTable[aData[parent_prop]]._addDesc();
			hashTable[aData[parent_prop]][children_prop].push(hashTable[aData[code_prop]])
		} else {
			dataTree.push(hashTable[aData[code_prop]])
		}
	});

	const ids = Object.keys(hashTable);
	const flat = ids.map(id => {
		max_cols += hashTable[id]['num_desc']

		return hashTable[id];
	})

	return {
		tree: dataTree,
		flat: flat,
		num_levels,
		max_cols
	};
};

export const buildNestedHeaders = (flat_arr, levels_count) => {
	const _nested_headers = [];
	for (let i = 0; i <= levels_count; i++) {
		const _level_headers = flat_arr.filter(x => x.level === i).map(x => {
			return {
				label: x.label,
				colspan: x.num_desc === 0 ? 1 : x.num_desc,
			}
		})

		_nested_headers.push(_level_headers)
	}

	return _nested_headers;
}

export const extractColsMeta = (cells_meta, hot_data) => {
	const cols_meta = [];
	const _cols_meta = {}
	const cell_ids = [];

	cells_meta.map(meta => {
		const spanned_cols = [];
		const spanned_rows = [];

		if (meta?.colspan > 1) {
			for (let i = 0; i < meta.colspan; i++) {
				spanned_cols.push(meta.col + i);
			}
		}

		if (meta?.rowspan > 1) {
			for (let i = 0; i < meta.rowspan; i++) {
				spanned_rows.push(meta.row + i);
			}
		}

		cell_ids.push(meta.row + '-' + meta.col);

		let label = null
		if (hot_data[meta.row] && hot_data[meta.row][meta.col]) {
			label = hot_data[meta.row][meta.col].trim();
		}

		_cols_meta[meta.row + '-' + meta.col] = {
			id: meta.row + '-' + meta.col,
			pid: null,
			row: meta.row,
			col: meta.col,
			hidden: meta.hidden || false,
			spanned: meta.spanned || false,
			colspan: meta.colspan || 1,
			rowspan: 1, // TEMPORARY until HANDSONTABLE start to support rowspan column headers! meta.rowspan || 1,
			spanned_cols: spanned_cols,
			spanned_rows: spanned_rows,
			label: label
		}

		if (meta.rowspan > 1) {
			toast.warning('Объединение колонок по строкам не поддерживается (на данный момент)', {autoClose: 10000})
		}
	})

	cell_ids.map(cell_id => {
		const meta = _cols_meta[cell_id];
		if (meta.spanned) {
			const child_row = meta.row + meta.rowspan;
			if (meta.spanned_cols.length > 0) {
				meta.spanned_cols.map(spanned_col => {
					if (_cols_meta[child_row + '-' + spanned_col]) {
						_cols_meta[child_row + '-' + spanned_col]['pid'] = meta.id;
					}
				})
			}
		} else {
			const child_row = meta.row + meta.rowspan;
			const child_col = meta.col;
			if (_cols_meta[child_row + '-' + child_col] && !meta.hidden) {
				_cols_meta[child_row + '-' + child_col]['pid'] = meta.id;
			}
		}

		if (!meta.hidden) {
			cols_meta.push({
				id: _cols_meta[cell_id]['id'],
				pid: _cols_meta[cell_id]['pid'],
				label: _cols_meta[cell_id]['label'],
				spanned: _cols_meta[cell_id]['spanned'],
				row: _cols_meta[cell_id]['row'],
				col: _cols_meta[cell_id]['col'],
				colspan: _cols_meta[cell_id]['colspan'],
				rowspan: _cols_meta[cell_id]['rowspan'],
			})
		}
	})

	return cols_meta;
}