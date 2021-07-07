import {enableStaticRendering} from 'mobx-react-lite'
import {AppStore} from 'store/app_store';
import {BlanksStore} from 'store/blanks_store';


enableStaticRendering(typeof window === 'undefined')

export class RootStore {
	constructor() {
		this.appStore = new AppStore(this);
		this.blanksStore = new BlanksStore(this);
	}

	hydrate = (data) => {
		if (!data) return

		/** HANDLE CHILD STORES HYDRATION */
		this.appStore.hydrate(data);
		this.blanksStore.hydrate(data);

		// this.lastUpdate = data.lastUpdate !== null ? data.lastUpdate : Date.now()
		// this.light = !!data.light
	}
}