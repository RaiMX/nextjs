import React from 'react';
import dynamic from "next/dynamic";
import Router from 'next/router';
import { useRouter } from 'next/router'

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
import { AppContext, AppDispatchContext } from "providers/app_provider";
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

	const router = useRouter()
	const { id } = router.query;

	const { app_conf, user_info } = React.useContext(AppContext);

	const tableRef = React.createRef();

	const [isLoading, setIsLoading] = React.useState(false);
	const [fill_dialog, setFillDialog] = React.useState(false);
	const [list, setList] = React.useState();
	const [items, setItems] = React.useState([]);
	const [selected_item, setSelectedItem] = React.useState();

	const onRowAdd = newData => {
		return new Promise((resolve, reject) => {
			api.post(`generic-list/create/list_${list.id}`, {
				name: newData.name,
				name_kk: newData.name_kk,
				created_by: user_info.user.id,
			}).then(new_item => {
				resolve();
			})
				.catch(error => {
					console.log(error)
					reject();
				});
		})
	}

	const onRowUpdate = (newData, oldData) => {
		return new Promise((resolve, reject) => {
			api.post(`generic-list/update/list_${list.id}`, {
				id: newData.id,
				name: newData.name,
				name_kk: newData.name_kk,
				created_by: newData.created_by,
				updated_by: user_info.user.id,
			}).then(new_item => {
				resolve();
			})
				.catch(error => {
					console.log(error)
					reject();
				});
		})
	}

	const onRowDelete = (oldData) => {
		return new Promise((resolve, reject) => {
			api.delete(`/generic-list/delete/list_${list.id}/${oldData.id}`)
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

		if (id !== undefined) {
			api.get(`lists/${id}`)
				.then(response => {
					setList(response.data)
				})
		}

	}, [])

	if (!id) {
		return <div><FormattedMessage id="required_url_parameter_undefined" defaultMessage="Отсутствует необходимый параметр URL" /></div>;
	}

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
						title="Списки"
						tableRef={tableRef}
						columns={[
							{
								title: 'ID',
								field: 'id',
								type: 'numeric',
								editable: 'never'
							},
							{
								title: 'Название (РУС)',
								field: 'name',
								type: 'string'
							},
							{
								title: 'Название (КАЗ)',
								field: 'name_kk',
								type: 'string'
							},
						]}
						data={query => {
							return new Promise((resolve, reject) => {
								api.get(`generic-list/get-all/list_${id}`).then(response => {
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
							onRowAdd: (newData) => onRowAdd(newData),
							onRowUpdate: (newData, oldData) => onRowUpdate(newData, oldData),
							onRowDelete: oldData => onRowDelete(oldData)
						}}
						icons={mtTableIcons}
						localization={mtLocalization}
						options={{
							pageSize: 100,
							emptyRowsWhenPaging: false,
							search: false,
							actionsColumnIndex: -1,
						}}
						actions={[]}
					/>
				</Grid>
			</Grid>
		</>
	);
})

export default Index