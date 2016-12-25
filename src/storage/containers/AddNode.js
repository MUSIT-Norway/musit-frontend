import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';
import { insert } from '../actions';
import AddNode from '../components/AddNode';
import { clearState, updateState } from '../actions';
import { emitError, emitSuccess } from '../../errors/emitter';
import { loadRoot } from '../../magasin/actions';

const mapDispatchToProps = (dispatch) => {
  return {
    onLagreClick: (parentId, museumId, data) => {
      dispatch(insert(parentId, museumId, data, {
        onSuccess: () => {
          hashHistory.goBack();
          emitSuccess(
            {
              type: 'saveSuccess',
              message:  I18n.t('musit.storageUnits.messages.saveNodeSuccess')
            }
          );
        },
        onFailure: (e) => {
          emitError({...e, type: 'network'});
        }
      }));
    },
    updateState: (data) => dispatch(updateState(data)),
    clearState: () => dispatch(clearState()),
    loadStorageObj: (id, museumId) => {
      dispatch(loadRoot(id, museumId));
    }
  };
};

const mapStateToProps = (state) => {
  return {
    unit: state.storagePanelUnit.state,
    user: state.auth.user,
    translate: (key, markdown) => I18n.t(key, markdown),
    rootNode: state.storageGridUnit.root.data || {}
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNode);
