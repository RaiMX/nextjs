import React from 'react';
import dynamic from "next/dynamic";

/** COMPONENTS */
import {useStore} from 'store/store_provider'
import * as CONSTANTS from "../../CONSTANTS";

/** THIRD PARTY */
import {observer} from "mobx-react-lite";
import {FormattedMessage} from 'react-intl';

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {Checkbox, FormControl, FormControlLabel, Grid, TextField, Tooltip} from "@material-ui/core";

/** LOADING WITHOUT SSR because Component does not support SSR */
const TableColumnsEditor = dynamic(() => import('./TableColumnsEditor'), {ssr: false});

const useStyles = makeStyles((theme) => ({
	root: {},
	formControl: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		marginLeft: theme.spacing(3),
		minWidth: 120,
		width: '95%'
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
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


const TableFieldProperties = observer(function TableFieldProperties({entity_code, entity_properties}) {
	const classes = useStyles();
	const {blanksStore} = useStore();

	return (
		<Grid
			container
			direction="row"
			justify="flex-start"
			alignItems="flex-start"
		>
			<Grid item xs={12} md={12}>
				<FormControl className={classes.formControl}>
					<TextField
						disabled={true}
						label={<FormattedMessage defaultMessage={'Тип'}/>}
						defaultValue={CONSTANTS.FIELD_TYPES.find(x => x.code === entity_properties.type).label}
					/>
				</FormControl>
			</Grid>
			<Grid item xs={12} md={12}>
				<Tooltip title="Кликните ячейку чтобы редактировать" placement="right">
					<Typography style={{marginLeft: 20, width: 'fit-content'}}><FormattedMessage defaultMessage="Шапка таблицы"/></Typography>
				</Tooltip>

				<TableColumnsEditor entity_code={entity_code} entity_properties={entity_properties}/>
			</Grid>
			<Grid item xs={12} md={12}>
				<FormControl className={classes.formControl}>
					<FormControlLabel
						control={<Checkbox
							checked={entity_properties.allow_null || false}
							onChange={(e) => {
								blanksStore.setEntityProperty(entity_code, 'allow_null', e.target.checked);
							}}
							color="primary"
						/>}
						label="Разрешить пустую таблицу"
					/>
				</FormControl>
			</Grid>
			<Grid item xs={12} md={12}>
				<FormControl className={classes.formControl}>
					<FormControlLabel
						control={<Checkbox
							checked={entity_properties.table_show_cols_number || false}
							onChange={(e) => {
								blanksStore.setEntityProperty(entity_code, 'table_show_cols_number', e.target.checked);
							}}
							color="primary"
						/>}
						label="Автоматическая нумерация колонок"
					/>
				</FormControl>
			</Grid>
			<Grid item xs={12} md={12}>
				<FormControl className={classes.formControl}>
					<TextField
						label={<FormattedMessage defaultMessage={'Описание поля'}/>}
						value={entity_properties.description || ''}
						onChange={(e) => {
							blanksStore.setEntityProperty(entity_code, 'description', e.target.value);
						}}
					/>
				</FormControl>
			</Grid>

		</Grid>
	);
})

export default TableFieldProperties