import React from 'react';
import dynamic from "next/dynamic";

/** COMPONENTS */
import { useStore } from 'store/store_provider'
import * as CONSTANTS from "../CONSTANTS";
import TextFieldElement from "./elements/TextFieldElement";
import NumberFieldElement from "./elements/NumberFieldElement";
import DateFieldElement from "./elements/DateFieldElement";
import TimeFieldElement from "./elements/TimeFieldElement";
import DateTimeFieldElement from "./elements/DateTimeFieldElement";
import SelectFieldElement from "./elements/SelectFieldElement";
// import TableFieldElement from "./elements/TableFieldElement";

/** THIRD PARTY */
import { observer } from "mobx-react-lite";

/** MATERIAL */
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from "@material-ui/core";

/** LOADING WITHOUT SSR because Component does not support SSR */
const TableFieldElement = dynamic(() => import('./elements/TableFieldElement'), { ssr: false });


const useStyles = makeStyles((theme) => ({
	root: {}
}))

const FormPreview = observer(function FormPreview({ style = {} }) {
	const classes = useStyles();
	const { blanksStore } = useStore();

	const [lists_ready, setListsReady] = React.useState(false);

	React.useEffect(() => {
		blanksStore.fetchSelectListValues().then(() => {
			setListsReady(true);
		})
	}, [])

	return (
		<div style={{ ...style }}>
			<Grid
				container
				direction="row"
				justify="flex-start"
				alignItems="flex-start"
			>
				{lists_ready ? Object.keys(blanksStore.entities_props).map(entity_code => {
					const entity_properties = blanksStore.entities_props[entity_code];

					switch (entity_properties.type) {
						case CONSTANTS.TYPE_SELECT_FIELD:
							return <Grid key={entity_code} item xs={12} md={12}><SelectFieldElement entity_props={entity_properties} /></Grid>;
						case CONSTANTS.TYPE_TEXT_FIELD:
							return <Grid key={entity_code} item xs={12} md={12}><TextFieldElement entity_props={entity_properties} /></Grid>;
						case CONSTANTS.TYPE_NUMBER_FIELD:
							return <Grid key={entity_code} item xs={12} md={12}><NumberFieldElement entity_props={entity_properties} /></Grid>;
						case CONSTANTS.TYPE_TABLE_FIELD:
							return <Grid key={entity_code} item xs={12} md={12}><TableFieldElement entity_props={entity_properties} /></Grid>;
						case CONSTANTS.TYPE_DATE_FIELD:
							return <Grid key={entity_code} item xs={12} md={12}><DateFieldElement entity_props={entity_properties} /></Grid>;
						case CONSTANTS.TYPE_TIME_FIELD:
							return <Grid key={entity_code} item xs={12} md={12}><TimeFieldElement entity_props={entity_properties} /></Grid>;
						case CONSTANTS.TYPE_DATETIME_FIELD:
							return <Grid key={entity_code} item xs={12} md={12}><DateTimeFieldElement entity_props={entity_properties} /></Grid>;
					}
				}) : null}
			</Grid>
		</div>
	);
})

export default FormPreview