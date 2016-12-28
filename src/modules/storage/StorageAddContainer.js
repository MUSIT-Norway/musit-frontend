import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';
import { insert } from './storageActions';
import AddNode from './StorageAddComponent';
import { clearState, updateState } from './storageActions';
import { emitError, emitSuccess } from '../../util/errors/emitter';
import { loadRoot } from '../magasin/magasinActions';
import { rootNodeSelector } from '../magasin/magasinSelectors';

const mapStateToProps = (state) => {
  return {
    user: state.app.user,
    unit: state.storage.state,
    rootNode: rootNodeSelector(state.magasin)
  };
};

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

export default connect(mapStateToProps, mapDispatchToProps)(AddNode);
