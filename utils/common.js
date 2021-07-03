import api from "./axios";

/** FOR MATERIAL-TABLE */
import React, {forwardRef} from 'react';
import AddBox from "@material-ui/icons/AddBox";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Edit from "@material-ui/icons/Edit";
import SaveAlt from "@material-ui/icons/SaveAlt";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import Search from "@material-ui/icons/Search";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Remove from "@material-ui/icons/Remove";
import ViewColumn from "@material-ui/icons/ViewColumn";
import ListOutlinedIcon from '@material-ui/icons/ListOutlined';
import SaveIcon from '@material-ui/icons/Save';
import UpdateIcon from '@material-ui/icons/Update';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';

/** SNACKBARs */
export const showSnack = (text, variant = 'info', enqueueSnackbar) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(text, {variant});
};

/** FOR MATERIAL-TABLE */
export const mtTableIcons = {
    Save: forwardRef((props, ref) => <SaveIcon {...props} ref={ref}/>),
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}/>),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>),
    ListOutlinedIcon: forwardRef((props, ref) => <ListOutlinedIcon {...props} ref={ref}/>),
    UpdateIcon: forwardRef((props, ref) => <UpdateIcon {...props} ref={ref}/>),
    FormatListNumberedIcon: forwardRef((props, ref) => <FormatListNumberedIcon {...props} ref={ref}/>),
};

/** FOR MATERIAL-TABLE */
export const mtLocalization = {
    header: {
        actions: 'Действия'
    },
    body: {
        emptyDataSourceMessage: 'Нет записей для отображения',
        editRow: {
            deleteText: 'Действительно удалить этот элемент безвозвратно?',
            cancelTooltip: 'Отменить',
            saveTooltip: 'Сохранить',
        },
        addTooltip: 'Добавить',
        editTooltip: 'Редактировать',
        deleteTooltip: 'Удалить',

    },
    pagination: {
        labelRowsSelect: 'строк',
        labelDisplayedRows: '{from}-{to} из {count}',
        firstTooltip: 'Первая страница',
        lastTooltip: 'Последняя страница',
        previousTooltip: 'Предыдущая страница',
        nextTooltip: 'Следующая страница',
    },
    toolbar: {
        searchPlaceholder: 'Поиск',
        searchTooltip: 'Поиск',
    },
};

export const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getMenu = () => {
    return new Promise(((resolve, reject) => {
        api.get('api/get-nav-menu')
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                console.log(error);
            })
    }))
}