import React from 'react';
import dynamic from "next/dynamic";
import Router from 'next/router';

/** THIRD PARTY */
import { observer } from "mobx-react-lite";
import { FormattedMessage, useIntl } from 'react-intl';
// import MaterialTable from "material-table";
import { mtLocalization, mtTableIcons } from "utils/common";
import { toast } from "react-toastify";
import Select from "react-select";

/** HOOKS */
import { useStore } from 'store/store_provider'

/** UTILS */
import api from "utils/axios";
import { camelToSnakeCase, prepLookup } from "utils/data_utils";
import date_utils from "utils/date_utils";

/** COMPONENTS */
import SimpleDialog from 'components/common/elements/SimpleDialog';

/** MATERIAL */
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button } from '@material-ui/core';

/** DYNAMIC IMPORTS */
const MaterialTable = dynamic(() => import('material-table'), { ssr: false })

const useStyles = makeStyles((theme) => ({
	root: {}
}))

const Index = observer(function Index() {
	const classes = useStyles();
	// const store = useStore();
	const intl = useIntl()

	const tableRef = React.createRef();

	const [isLoading, setIsLoading] = React.useState(false);
	const [fill_dialog, setFillDialog] = React.useState(false);
	const [templates, setTemplates] = React.useState([]);
	const [selected_template, setSelectedTemplate] = React.useState();


	const onRowDelete = (oldData) => {
		return new Promise((resolve, reject) => {
			api.delete(`/blanks/remove-filled/${oldData.id}`)
				.then(response => {
					toast.success(intl.formatMessage({ id: 'successfully_deleted', defaultMessage: 'Успешно удалено!' }))
					resolve(true)
				})
				.catch(error => {
					toast.error(intl.formatMessage({ id: 'error_deleting', defaultMessage: 'Ошибка при удалении!' }))
					reject(false)
				})
		})
	}

	React.useEffect(() => {
		api.get('blanks/all-templates')
		.then(response => {
			setTemplates(response.data)
		})
	}, [])

	return (
		<>
			<Grid
				container
				direction="row"
				justify="center"
				alignItems="flex-start"
			>
				<Grid item xs={12} md={6}>
					<MaterialTable
						title="Формы"
						tableRef={tableRef}
						columns={[
							{
								title: 'Вариант',
								field: 'variant',
								type: 'numeric'
							},
							{
								title: 'Статус',
								field: 'variant',
								type: 'numeric'
							},
							{
								title: 'Название',
								field: 'name',
								type: 'string'
							},
						]}
						data={query => {
							return new Promise((resolve, reject) => {
								api.get('/blanks/list-filled').then(response => {
									resolve({
										data: response.data.results,
										page: query.page,
										totalCount: response.data.count,
									})
								})
									.catch(error => {
										toast.error('Ошибка получения данных')
										reject(false)
									})
							})
						}}
						editable={{
							onRowDelete: oldData => onRowDelete(oldData)
						}}
						icons={mtTableIcons}
						localization={mtLocalization}
						options={{
							pageSize: 20,
							emptyRowsWhenPaging: false,
							search: false,
							actionsColumnIndex: -1,
						}}
						actions={[
							{
								isFreeAction: true,
								icon: () => <div className='fill-blank-button'>
									<mtTableIcons.Add />
								</div>,
								tooltip: intl.formatMessage({ id: 'fill_form', defaultMessage: 'Заполнить форму' }),
								onClick: (event, rowData) => {
									setFillDialog(true)
								}
							},
							{
								isFreeAction: false,
								icon: () => <div className='edit-blank-button'>
									<mtTableIcons.Edit />
								</div>,
								tooltip: intl.formatMessage({ id: 'edit', defaultMessage: 'Редактировать' }),
								onClick: (event, rowData) => {
									Router.push(`/blanks/fill?id=${rowData.id}&template_id=${rowData.template_id}`)
								}
							},
						]}
					/>
				</Grid>
			</Grid>

			<SimpleDialog
				open={fill_dialog}
				actions={selected_template ? <Button variant="contained" color="primary" onClick={() => Router.push(`/blanks/fill?template_id=${selected_template.value}`)}><FormattedMessage defaultMessage="Заполнить" /></Button> : null}
				onClose={() => setFillDialog(false)}
				maxWidth={'md'}
				title={'Выберите форму для заполнения'}
			>
				<div>
					<Select 
						options={templates.map(item => ({
							value: item.id,
							label: item.name
						}))}
						onChange={selection => setSelectedTemplate(selection)}
					/>
				</div>
			</SimpleDialog>
		</>
	);
})

export default Index