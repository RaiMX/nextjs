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
import TemplateMenu from 'components/blanks/TemplateMenu';

/** MATERIAL */
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';


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
	const [item_menu_anchor, setItemMenuAnchor] = React.useState(null);
	const [selected_item, setSelectedItem] = React.useState();
	const open_item_menu = Boolean(item_menu_anchor);

	const handleItemMenuShow = (e, item) => {
		setItemMenuAnchor(e.currentTarget);
		setSelectedItem(item);
	}
	const handleItemMenuClose = (e) => {
		setItemMenuAnchor(null);
		setSelectedItem(null);
	}

	const onRowDelete = (oldData) => {
		return new Promise((resolve, reject) => {
			api.delete(`/blanks/remove-template/${oldData.id}`)
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
					title="Пользователи"
					tableRef={tableRef}
					columns={[
						{
							title: 'Email',
							field: 'email',
							type: 'string'
						},
						{
							title: 'Администратор',
							field: 'isAdmin',
							type: 'boolean'
						},
						{
							title: 'Супер Администратор',
							field: 'isSuperAdmin',
							type: 'boolean'
						},
					]}
					data={query => {
						return new Promise((resolve, reject) => {
							api.get('/users').then(response => {
								resolve({
									data: response.data,
									page: query.page,
									totalCount: response.data.length,
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
							icon: () => <div className='create-blank-button'>
								<mtTableIcons.Add />
							</div>,
							tooltip: intl.formatMessage({ id: 'Создать новую форму' }),
							onClick: (event, rowData) => {
								Router.push(`/blanks/edit`)
							}
						},
						{
							isFreeAction: false,
							icon: () => <div className='edit-blank-button'>
								<mtTableIcons.Edit />
							</div>,
							tooltip: intl.formatMessage({ id: 'Редактировать' }),
							onClick: (event, rowData) => {
								Router.push(`/admin/users/edit?id=${rowData.id}`)
							}
						},
						{
							isFreeAction: false,
							icon: () => <div className='edit-blank-button'>
								<MoreVertIcon />
							</div>,
							tooltip: intl.formatMessage({ id: 'Действия' }),
							onClick: (event, rowData) => {
								handleItemMenuShow(event, rowData)
							}
						},
					]}
				/>
				<TemplateMenu template={selected_item} open={open_item_menu} anchor={item_menu_anchor} onClose={handleItemMenuClose}/>
			</Grid>
		</Grid>
	);
})

export default Index