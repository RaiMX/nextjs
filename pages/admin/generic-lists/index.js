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

    const { app_conf, user_info } = React.useContext(AppContext);

	const tableRef = React.createRef();

	const [isLoading, setIsLoading] = React.useState(false);
	const [fill_dialog, setFillDialog] = React.useState(false);
	const [lists, setLists] = React.useState([]);
	const [selected_list, setSelectedList] = React.useState();

    const onRowAdd = newData => {
        return new Promise((resolve, reject) => {
            api.post('generic-list/create-list', {
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
            api.patch(`lists/${newData.id}`, {
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
			api.delete(`/generic-list/delete-list/${oldData.id}`)
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
		api.get('lists')
		.then(response => {
			setLists(response.data)
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
								api.get('/lists').then(response => {
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
							pageSize: 20,
							emptyRowsWhenPaging: false,
							search: false,
							actionsColumnIndex: -1,
						}}
						actions={[
							{
								isFreeAction: false,
								icon: () => <div className='edit-list-button'>
									<mtTableIcons.ListOutlinedIcon />
								</div>,
								tooltip: intl.formatMessage({ defaultMessage: 'Редактировать содержимое списка' }),
								onClick: (event, rowData) => {
									Router.push(`/admin/generic-lists/edit-items?id=${rowData.id}`)
								}
							},
						]}
					/>
				</Grid>
			</Grid>

			<SimpleDialog
				open={fill_dialog}
				actions={selected_list ? <Button variant="contained" color="primary" onClick={() => Router.push(`/blanks/fill?template_id=${selected_list.value}`)}><FormattedMessage defaultMessage="Заполнить" /></Button> : null}
				onClose={() => setFillDialog(false)}
				maxWidth={'md'}
				title={'Выберите форму для заполнения'}
			>
				<div>
					<Select 
						options={lists.map(item => ({
							value: item.id,
							label: item.name
						}))}
						onChange={selection => setSelectedList(selection)}
					/>
				</div>
			</SimpleDialog>
		</>
	);
})

export default Index