
/*
 *  MUSIT is a museum database to archive natural and cultural history data.
 *  Copyright (C) 2016  MUSIT Norway, part of www.uio.no (University of Oslo)
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License,
 *  or any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import { connect } from 'react-redux';
import WelcomeContainer from '../../components/welcome-view';
import { setUser, loadActor } from '../../reducers/auth';
import { I18n } from 'react-i18nify';
import { emitError } from '../../errors/emitter';

const mapStateToProps = (state) => ({
  user: state.auth.user.actor,
  translate: (key, markdown) => I18n.t(key, markdown)
});

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user: any) => {
      dispatch(setUser(user));
      dispatch(loadActor({
        onFailure: (e) => emitError(e)
      }));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeContainer);