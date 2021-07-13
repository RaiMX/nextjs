import {action, computed, makeObservable, observable} from 'mobx'
import {enableStaticRendering} from 'mobx-react-lite'

enableStaticRendering(typeof window === 'undefined')

export class BlanksStore {
	id = null;
	editor_state_obj = null
	entities_props = {}
	selected_entity_code = null
	select_lists = {
		orgs: {
			code: 'orgs',
			label: 'Организации',
			values: [
				{
					value: 1,
					label: 'Org 1'
				},
				{
					value: 2,
					label: 'Org 2'
				},
			]
		},
		deps: {
			code: 'deps',
			label: 'Департаменты',
			values: [
				{
					value: 1,
					label: 'Деп 1'
				},
				{
					value: 2,
					label: 'Деп 2'
				},
			]
		},
	}

	constructor(rootStore) {
		this.rootStore = rootStore

		makeObservable(this, {
			rootStore: observable,

			editor_state_obj: observable,
			entities_props: observable,
			selected_entity_code: observable,
			select_lists: observable,
			select_lists_names: computed,

			hydrate: action,
			setEditorStateObj: action,
			addEntity: action,
			setEntityValue: action,
			setEntityProperty: action,
			setSelectedEntityCode: action,
			clearBlank: action,
		})
	}

	get select_lists_names() {
		const codes = Object.keys(this.select_lists);
		return codes.map(code => {
			return {
				code: this.select_lists[code]['code'],
				label: this.select_lists[code]['label'],
			}
		})
	}

	hydrate = (data) => {
		if (!data) return

		this.editor_state_obj = data?.blanksStore?.editor_state_obj !== null ? data.blanksStore.editor_state_obj : {}
		this.entities_props = data?.blanksStore?.entities_props !== null ? data.blanksStore.entities_props : {}
	}

	setEditorStateObj = (obj) => {
		this.editor_state_obj = obj;
	}

	addEntity = (code, type, placeholder) => {
		if (this.entities_props[code] === undefined) {
			this.entities_props[code] = {
				code,
				type,
				placeholder,
				value: null,
				allow_null: false
			}

			return true;
		}
		return false;
	}

	setEntityValue = (code, value) => {
		if (this.entities_props[code] !== undefined) {
			this.entities_props[code]['value'] = value;
			return true;
		}
		return false;
	}

	setEntityProperty = (code, prop, value) => {
		if (this.entities_props[code] !== undefined) {
			this.entities_props[code][prop] = value;
			return true;
		}
		return false;
	}

	setSelectedEntityCode = (code) => {
		this.selected_entity_code = code;
	}

	clearBlank = () => {
		this.editor_state_obj = null;
		this.entities_props = {};
		this.selected_entity_code = null;
	}
}