import React from 'react';
import {useRouter} from "next/router";
import {useCookies} from 'react-cookie';

/** MATERIAL */
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {Tooltip} from "@material-ui/core";

export default function LanguageSwitcher() {
	const [cookie, setCookie] = useCookies(['NEXT_LOCALE']);
	const router = useRouter();
	const {locale} = router;

	const switchLanguage = (e) => {
		const locale = e.target.value;
		router.push('/', '/', {locale});
		if (cookie.NEXT_LOCALE !== locale) {
			setCookie("NEXT_LOCALE", locale, {path: "/"});
		}
	}

	return (
		<Tooltip title="Язык интерфейса" placement="left">
			<Select
				value={locale}
				onChange={switchLanguage}
				disableUnderline
				style={{color: 'white'}}
			>
				<MenuItem value={'ru'}>RU</MenuItem>
				<MenuItem value={'kk'}>KZ</MenuItem>
			</Select>
		</Tooltip>
	);
}