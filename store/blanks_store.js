import { action, computed, makeObservable, observable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import api from 'utils/axios';

enableStaticRendering(typeof window === 'undefined')

export class BlanksStore {
	id = null;
	editor_state_obj = null;
	entities_props = {};
	change_timestamp = new Date().getTime() / 1000;
	selected_entity_code = null;
	selected_lists = {};
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
	};

	constructor(rootStore) {
		this.rootStore = rootStore

		makeObservable(this, {
			rootStore: observable,

			editor_state_obj: observable,
			entities_props: observable,
			change_timestamp: observable,
			selected_entity_code: observable,
			select_lists: observable,
			select_lists_names: computed,

			hydrate: action,
			setEditorStateObj: action,
			setEntitiesProps: action,
			addEntity: action,
			setEntityValue: action,
			setEntityProperty: action,
			setSelectedEntityCode: action,
			clearBlank: action,
			fetchSelectLists: action,
			fetchSelectListValues: action,
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

	setEntitiesProps = (obj) => {
		this.entities_props = obj;
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
			this.change_timestamp = new Date().getTime() / 1000;
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

	fetchSelectLists = () => {
		return new Promise((resolve, reject) => {
			api.get('lists')
				.then(response => {
					const lists = response.data;
					const select_lists = {};
					for (let i = 0; i < lists.length; i++) {
						const list = lists[i];
						const list_code = 'list_' + list.id;
						select_lists[list_code] = {
							code: list_code,
							label: list.name,
							values: []
						}
					}

					this.select_lists = select_lists;
					resolve(select_lists);
				})
				.catch(error => reject(false))
		})

	}

	fetchSelectListValues = () => {
		return new Promise((resolve, reject) => {
			Object.keys(this.entities_props).map(entity_code => {
				Object.keys(this.entities_props[entity_code]).map(entity_prop => {
					if (entity_prop === 'list_code') {
						api.get(`generic-list/get-all/${this.entities_props[entity_code][entity_prop]}`)
							.then(response => {
								this.select_lists[this.entities_props[entity_code][entity_prop]].values = response.data;
							})
					}
				})
			})
			resolve()
		})
	}
}