import {observer} from 'mobx-react-lite'
import {useStore} from 'store/store_provider'

const Clock = observer(function Clock(props) {
	// use store from the store context
	const {appStore} = useStore()

	return (
		<div className={appStore.light ? 'light' : ''}>
			{appStore.timeString}
			<style jsx>{`
        div {
          padding: 15px;
          color: #82fa58;
          display: inline-block;
          font: 50px menlo, monaco, monospace;
          background-color: #000;
        }
        .light {
          background-color: #999;
        }
      `}</style>
		</div>
	)
})

export default Clock;