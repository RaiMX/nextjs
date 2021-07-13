import React from 'react';

import {FormattedMessage} from "react-intl";

import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

export default function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			<FormattedMessage defaultMessage={'Все права защищены'}/>{' © '}
			<Link color="inherit" href="https://tra.kz/">ТРА</Link>{' '}{new Date().getFullYear()}{'.'}
		</Typography>
	);
}