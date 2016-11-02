import { connect, createState } from '../../state/RxState'
import ActorSuggest from './ActorSuggest'
import { input$, clear$ } from './actions'
import reducer$ from './reducer'

export default connect(state => ({
  suggest: state.suggest,
  update(n) { input$.next(n); },
  clear() { clear$.next(); },
}))(createState(reducer$))(ActorSuggest);