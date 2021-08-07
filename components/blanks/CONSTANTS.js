export const PLACEHOLDER_TRIGGER = '{{'
export const PLACEHOLDER_CLOSER = '}}'

export const PLACEHOLDER_TEXT_TEXT_FIELD = 'ТЕКСТОВОЕ_ПОЛЕ'
export const PLACEHOLDER_TEXT_NUMBER_FIELD = 'ЧИСЛОВОЕ_ПОЛЕ'
export const PLACEHOLDER_TEXT_SELECT_FIELD = 'ВЫПАДАЮЩИЙ_СПИСОК'
export const PLACEHOLDER_DATE_FIELD = 'ДАТА'

export const TYPE_TEXT_FIELD = 'text_field'
export const TYPE_NUMBER_FIELD = 'number_field'
export const TYPE_SELECT_FIELD = 'select_field'
export const TYPE_TABLE_FIELD = 'table_field'
export const TYPE_DATE_FIELD = 'date_field'
export const TYPE_TIME_FIELD = 'time_field'
export const TYPE_DATETIME_FIELD = 'datetime_field'

export const FIELD_TYPES = [
	{
		code: TYPE_TEXT_FIELD,
		label: 'Текстовое поле',
	},
	{
		code: TYPE_NUMBER_FIELD,
		label: 'Числовое поле',
	},
	{
		code: TYPE_SELECT_FIELD,
		label: 'Выпадающий список',
	},
	{
		code: TYPE_TABLE_FIELD,
		label: 'Таблица',
	},
	{
		code: TYPE_DATE_FIELD,
		label: 'Дата',
	},
	{
		code: TYPE_TIME_FIELD,
		label: 'Время',
	},
	{
		code: TYPE_DATETIME_FIELD,
		label: 'Дата-Время',
	},
]