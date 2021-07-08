import React from 'react';

/** COMPONENTS */
import {useStore} from 'store/store_provider'
import * as CONSTANTS from "../CONSTANTS";
import {EditorState, Modifier} from "draft-js";

/** THIRD PARTY */
import {observer} from "mobx-react-lite";
import {FormattedMessage} from 'react-intl';
import {v4} from "uuid";

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
	root: {}
}))

const ToolbarButtonInsertPlaceholder = observer(function ToolbarButtonInsertPlaceholder({editorState, onChange, field_type_code, label}) {
	const classes = useStyles();
	const {blanksStore} = useStore();

	const addPlaceholderText = () => {
		const entity_code = v4();
		const field_type = CONSTANTS.FIELD_TYPES.find(x => x.code === field_type_code)
		const placeholder = field_type.label.toLocaleUpperCase();
		blanksStore.addEntity(entity_code, field_type_code, placeholder)

		const contentState = editorState.getCurrentContent();
		const contentStateWithEntity = contentState.createEntity(
			'PLACEHOLDER',
			'IMMUTABLE',
			{
				code: entity_code,
			},
		);

		const entityKey = contentStateWithEntity.getLastCreatedEntityKey();


		let newContentState = Modifier.replaceText(
			contentStateWithEntity,
			editorState.getSelection(),
			`${CONSTANTS.PLACEHOLDER_TRIGGER}${placeholder}${CONSTANTS.PLACEHOLDER_CLOSER} `,
			null,
			entityKey,
		);

		const newEditorState = EditorState.push(
			editorState,
			newContentState,
			`insert-placeholder`,
		);

		onChange(newEditorState);
	}

	return (
		<div className="rdw-option-wrapper" onClick={addPlaceholderText}>{label}</div>
	);
})

export default ToolbarButtonInsertPlaceholder