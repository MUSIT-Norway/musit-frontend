import * as React from "react";
import { Component } from "react";
import { Button, Row, Col } from "react-bootstrap";
import * as FontAwesome from "react-fontawesome";
import { I18n } from "react-i18nify";
import { eventTargetValue, TODO } from "../../types/common";

interface ObservationControlComponentProps {
  id: string;
  onClickNewObservation: Function;
  onClickNewControl: Function;
}
/* Old:
  static propTypes = {
    id: PropTypes.string.isRequired,
    onClickNewObservation: PropTypes.func.isRequired,
    onClickNewControl: PropTypes.func.isRequired
  };
*/

export default class ObservationControlComponent extends Component<
  ObservationControlComponentProps
> {
  render() {
    const { id, onClickNewControl, onClickNewObservation } = this.props;
    const getTranslate = (term:string) => I18n.t(`musit.leftMenu.observationControl.${term}`);
    const buttonLogic = (type:string, eventType: TODO) => {
      return (
        <Button
          id={`${id}_${type}`}
          onClick={event => eventType(eventTargetValue(event))}
          style={{ textAlign: "left", width: "100%" }}
        >
          <FontAwesome name="plus-circle" style={{ padding: "2px" }} />
          {getTranslate(type)}
        </Button>
      );
    };
    return (
      <div>
        <Row>
          <Col xs={6} sm={12}>
            {buttonLogic("newObservation", onClickNewObservation)}
          </Col>
          <Col xs={6} sm={12}>
            {buttonLogic("newControl", onClickNewControl)}
          </Col>
        </Row>
      </div>
    );
  }
}
