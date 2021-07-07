import {createContext, useContext} from 'react'
import {RootStore} from './root_store'

let store
export const StoreContext = createContext()

export function useStore() {
	const context = useContext(StoreContext)
	if (context === undefined) {
		throw new Error('useAppStore must be used within StoreProvider')
	}

	return context
}

export function StoreProvider({children, initialState: initialData}) {
	// const store = initializeStore({
	// 	blanksStore: {
	// 		editor_state_obj: {
	// 			"blocks": [
	// 				{
	// 					"key": "3aoji",
	// 					"text": "dawdawd {{ТЕКСТОВОЕ ПОЛЕ}} ",
	// 					"type": "unstyled",
	// 					"depth": 0,
	// 					"inlineStyleRanges": [],
	// 					"entityRanges": [
	// 						{
	// 							"offset": 8,
	// 							"length": 19,
	// 							"key": 0
	// 						}
	// 					],
	// 					"data": {}
	// 				}
	// 			],
	// 			"entityMap": {
	// 				"0": {
	// 					"type": "PLACEHOLDER",
	// 					"mutability": "IMMUTABLE",
	// 					"data": {
	// 						"code": "03cf3209-a399-40fa-893b-de77c4330408"
	// 					}
	// 				}
	// 			}
	// 		},
	// 		entities_props: {}
	// 	}
	// })
	const store = initializeStore();

	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

function initializeStore(initialData = null) {
	const _store = store ?? new RootStore()

	// If your page has Next.js data fetching methods that use a Mobx store, it will
	// get hydrated here, check `pages/ssg.js` and `pages/ssr.js` for more details
	if (initialData) {
		_store.hydrate(initialData)
	}
	// For SSG and SSR always create a new store
	if (typeof window === 'undefined') return _store
	// Create the store once in the client
	if (!store) store = _store

	return _store
}