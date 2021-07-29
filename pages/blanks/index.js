import React from 'react';
import dynamic from "next/dynamic";
import Router from 'next/router';

/** THIRD PARTY */
import { observer } from "mobx-react-lite";
import { FormattedMessage, useIntl } from 'react-intl';
// import MaterialTable from "material-table";
import { mtLocalization, mtTableIcons } from "utils/common";
import { toast } from "react-toastify";

/** HOOKS */
import { useStore } from 'store/store_provider'

/** UTILS */
import api from "utils/axios";
import { camelToSnakeCase, prepLookup } from "utils/data_utils";
import date_utils from "utils/date_utils";

/** COMPONENTS */

/** MATERIAL */
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';

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

	const onRowDelete = (oldData) => {
		return new Promise((resolve, reject) => {
			api.delete(`/blanks/remove/${oldData.id}`)
			.then(response => {
				toast.success(intl.formatMessage({ id: 'Успешно удалено!' }))
				resolve(true)
			})
			.catch(error => {
				toast.error(intl.formatMessage({ id: 'Ошибка при удалении!' }))
				reject(false)
			})
		})
	}

	return (
		<Grid
			container
			direction="row"
			justify="center"
			alignItems="flex-start"
		>
			<Grid item xs={12} md={6}>
				<MaterialTable
					title="Шаблоны форм"
					tableRef={tableRef}
					columns={[
						{
							title: 'Версия',
							field: 'version',
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
							api.get('/blanks/list').then(response => {
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
							icon: () => <div className='view-blank-button'>
								<mtTableIcons.Add />
							</div>,
							tooltip: intl.formatMessage({ id: 'Создать новую форму' }),
							onClick: (event, rowData) => {
								Router.push(`/blanks/create`)
							}
						},
						{
							isFreeAction: false,
							icon: () => <div className='view-blank-button'>
								<mtTableIcons.Edit />
							</div>,
							tooltip: intl.formatMessage({ id: 'Редактировать' }),
							onClick: (event, rowData) => {
								Router.push(`/blanks/create?id=${rowData.id}`)
							}
						},
					]}
				/>
			</Grid>
		</Grid>
	);
})

export default Index