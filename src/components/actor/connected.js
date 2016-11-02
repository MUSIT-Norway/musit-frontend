import { connect, createState } from '../../state/RxState'
import ActorSuggest from './ActorSuggest'
import actions from './actions'
import reducer$ from './reducer'

export default connect(state => ({
  suggest: state.suggest,
  suggestActor(n) { actions.suggest$.next(n); },
  clearState() { actions.clear$.next(); },
}))(createState(reducer$))(ActorSuggest);