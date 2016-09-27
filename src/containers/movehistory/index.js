import Language from '../../components/language'
import { loadMoveHistoryForObject } from '../../reducers/grid/move'
import { connect } from 'react-redux';
import MusitHistoryModalImpl from '../../components/formfields/musitModal/musitMoveHistoryModal'

const mapStateToProps = (state) => ({
  translate: (key, markdown) => Language.translate(key, markdown),
  moves: state.movehistory.data || [],
})


const mapDispatchToProps = (dispatch) => {
  return ({
    loadChildren: () => {
      dispatch(loadMoveHistoryForObject())
    } })
}


@connect(mapStateToProps, mapDispatchToProps)
export default class MusitModal extends MusitHistoryModalImpl {}
