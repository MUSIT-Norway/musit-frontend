import React from "react";
import { I18n } from "react-i18nify";
import type { MeasurementDeterminationProps } from "../../../types/conservation";
import SubEventComponentNote from "../components/subEventComponentNote";
import DropdownButton from "../../../components/DropdownButton";
import { isNumber } from "util";
import { musitParseFloat } from "../../../shared/util";

export default function MeasurementEvent(props: MeasurementDeterminationProps) {
  const suffix = ":";

  const extraAttributes = (
    <div>
      <div className="row form-group">
        <div className="col-md-1">
          <label className="control-label h4" htmlFor={`weight${props.index}`}>
            {I18n.t(
              "musit.conservation.events.measurementDetermination.weight"
            ) + suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`weight${props.index}`}>
              {props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.weight}
            </p>
          ) : (
            <input
              className="form-control"
              id={`weight${props.index}`}
              value={
                props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.weight
              }
              onChange={t => {
                props.onChange("measurementData")({
                  ...props.measurementDetermination.measurementData,
                  weight: musitParseFloat(t.target.value)
                })}}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-1">
          <label className="control-label h4" htmlFor={`length${props.index}`}>
            {I18n.t(
              "musit.conservation.events.measurementDetermination.length"
            ) + suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`length${props.index}`}>
              {props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.length}
            </p>
          ) : (
            <input
              className="form-control"
              id={`length${props.index}`}
              value={
                props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.length
              }
              onChange={t =>
                props.onChange("measurementData")({
                  ...props.measurementDetermination.measurementData,
                  length: musitParseFloat(t.target.value)
                })}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-1">
          <label className="control-label h4" htmlFor={`width${props.index}`}>
            {I18n.t(
              "musit.conservation.events.measurementDetermination.width"
            ) + suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`width${props.index}`}>
              {props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.width}
            </p>
          ) : (
            <input
              className="form-control"
              id={`width${props.index}`}
              value={
                props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.width
              }
              onChange={t =>
                props.onChange("measurementData")({
                  ...props.measurementDetermination.measurementData,
                  width: musitParseFloat(t.target.value)
                })}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>git push --set-upstream origin MUSARK-1687
      <div className="row form-group">
        <div className="col-md-1">
          <label
            className="control-label h4"
            htmlFor={`thickness${props.index}`}
          >
            {I18n.t(
              "musit.conservation.events.measurementDetermination.thickness"
            ) + suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`thickness${props.index}`}>
              {props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.thickness}
            </p>
          ) : (
            <input
              className="form-control"
              id={`thickness${props.index}`}
              value={
                props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.thickness
              }
              onChange={t =>
                props.onChange("measurementData")({
                  ...props.measurementDetermination.measurementData,
                  thickness: musitParseFloat(t.target.value)
                })}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-1">
          <label className="control-label h4" htmlFor={`height${props.index}`}>
            {I18n.t(
              "musit.conservation.events.measurementDetermination.height"
            ) + suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`height${props.index}`}>
              {props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.height}
            </p>
          ) : (
            <input
              className="form-control"
              id={`height${props.index}`}
              value={
                props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.height
              }
              onChange={t =>
                props.onChange("measurementData")({
                  ...props.measurementDetermination.measurementData,
                  height: musitParseFloat(t.target.value)
                })}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-1">
          <label
            className="control-label h4"
            htmlFor={`largestLength${props.index}`}
          >
            {I18n.t(
              "musit.conservation.events.measurementDetermination.largestLength"
            ) + suffix}
          </label>
          {props.viewMode ? (
            <p
              className="form-control-static"
              id={`largestLength${props.index}`}
            >
              {props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.largestLength}
            </p>
          ) : (
            <input
              className="form-control"
              id={`largestLength${props.index}`}
              value={
                props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.largestLength
              }
              onChange={t =>
                props.onChange("measurementData")({
                  ...props.measurementDetermination.measurementData,
                  largestLength: musitParseFloat(t.target.value)
                })}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-1">
          <label
            className="control-label h4"
            htmlFor={`largestWidth${props.index}`}
          >
            {I18n.t(
              "musit.conservation.events.measurementDetermination.largestWidth"
            ) + suffix}
          </label>
          {props.viewMode ? (
            <p
              className="form-control-static"
              id={`largestWidth${props.index}`}
            >
              {props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.largestWidth}
            </p>
          ) : (
            <input
              className="form-control"
              id={`largestWidth${props.index}`}
              value={
                props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.largestWidth
              }
              onChange={t =>
                props.onChange("measurementData")({
                  ...props.measurementDetermination.measurementData,
                  largestWidth: musitParseFloat(t.target.value)
                })}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-1">
          <label
            className="control-label h4"
            htmlFor={`largestThickness${props.index}`}
          >
            {I18n.t(
              "musit.conservation.events.measurementDetermination.largestThickness"
            ) + suffix}
          </label>
          {props.viewMode ? (
            <p
              className="form-control-static"
              id={`largestThickness${props.index}`}
            >
              {props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.largestThickness}
            </p>
          ) : (
            <input
              className="form-control"
              id={`largestThickness${props.index}`}
              value={
                props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.largestThickness
              }
              onChange={t =>
                props.onChange("measurementData")({
                  ...props.measurementDetermination.measurementData,
                  largestThickness: musitParseFloat(t.target.value)
                })}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-1">
          <label
            className="control-label h4"
            htmlFor={`largestHeight${props.index}`}
          >
            {I18n.t(
              "musit.conservation.events.measurementDetermination.largestHeight"
            ) + suffix}
          </label>
          {props.viewMode ? (
            <p
              className="form-control-static"
              id={`largestHeight${props.index}`}
            >
              {props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.largestHeight}
            </p>
          ) : (
            <input
              className="form-control"
              id={`largestHeight${props.index}`}
              value={
                props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.largestHeight
              }
              onChange={t =>
                props.onChange("measurementData")({
                  ...props.measurementDetermination.measurementData,
                  largestHeight: musitParseFloat(t.target.value)
                })}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-1">
          <label
            className="control-label h4"
            htmlFor={`diameter${props.index}`}
          >
            {I18n.t(
              "musit.conservation.events.measurementDetermination.diameter"
            ) + suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`diameter${props.index}`}>
              {props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.diameter}
            </p>
          ) : (
            <input
              className="form-control"
              id={`diameter${props.index}`}
              value={
                props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.diameter
              }
              onChange={t =>
                props.onChange("measurementData")({
                  ...props.measurementDetermination.measurementData,
                  diameter: musitParseFloat(t.target.value)
                })}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-1">
          <label
            className="control-label h4"
            htmlFor={`tverrmaal${props.index}`}
          >
            {I18n.t(
              "musit.conservation.events.measurementDetermination.tverrmaal"
            ) + suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`tverrmaal${props.index}`}>
              {props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.tverrmaal}
            </p>
          ) : (
            <input
              className="form-control"
              id={`tverrmaal${props.index}`}
              value={
                props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.tverrmaal
              }
              onChange={t =>
                props.onChange("measurementData")({
                  ...props.measurementDetermination.measurementData,
                  tverrmaal: musitParseFloat(t.target.value)
                })}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-1">
          <label
            className="control-label h4"
            htmlFor={`largestMeasurement${props.index}`}
          >
            {I18n.t(
              "musit.conservation.events.measurementDetermination.largestMeasurement"
            ) + suffix}
          </label>
          {props.viewMode ? (
            <p
              className="form-control-static"
              id={`largestMeasurement${props.index}`}
            >
              {props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData
                  .largestMeasurement}
            </p>
          ) : (
            <input
              className="form-control"
              id={`largestMeasurement${props.index}`}
              value={
                props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData
                  .largestMeasurement
              }
              onChange={t =>
                props.onChange("measurementData")({
                  ...props.measurementDetermination.measurementData,
                  largestMeasurement: musitParseFloat(t.target.value)
                })}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-9">
          <label
            className="control-label h4"
            htmlFor={`measurement${props.index}`}
          >
            {I18n.t(
              "musit.conservation.events.measurementDetermination.measurement"
            ) + suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`measurement${props.index}`}>
              {props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.measurement}
            </p>
          ) : (
            <input
              className="form-control"
              id={`measurement${props.index}`}
              value={
                props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.measurement
              }
              onChange={t =>
                props.onChange("measurementData")({
                  ...props.measurementDetermination.measurementData,
                  measurement: t.target.value
                })}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-1">
          <label
            className="control-label h4"
            htmlFor={`quantity${props.index}`}
          >
            {I18n.t(
              "musit.conservation.events.measurementDetermination.quantity"
            ) + suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`quantity${props.index}`}>
              {props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.quantity}
            </p>
          ) : (
            <input
              className="form-control"
              id={`quantity${props.index}`}
              value={
                props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.quantity
              }
              onChange={t =>
                props.onChange("measurementData")({
                  ...props.measurementDetermination.measurementData,
                  quantity: t.target.value ? parseInt(t.target.value)
                  : undefined
                })}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
        <div className="col-md-1">
          <label
            className="control-label h4"
            htmlFor={`quantitySymbols${props.index}`}
          >
            {I18n.t(
              "musit.conservation.events.measurementDetermination.quantitySymbols"
            ) + suffix}
          </label>
          {props.viewMode ? (
            <p
              className="form-control-static"
              id={`quantitySymbols${props.index}`}
            >
              {props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.quantitySymbols}
            </p>
          ) : (
            <DropdownButton
              id={"symbols"}
              onChange={r =>
                props.onChange("measurementData")({
                  ...props.measurementDetermination.measurementData,
                  quantitySymbols: r
                })}
              items={[">", "<", "?", "="]}
              displayItems={[">", "<", "?", "="]}
              title={
                props.measurementDetermination.measurementData
                  .quantitySymbols || " "
              }
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-1">
          <label
            className="control-label h4"
            htmlFor={`fragmentQuantity${props.index}`}
          >
            {I18n.t(
              "musit.conservation.events.measurementDetermination.fragmentQuantity"
            ) + suffix}
          </label>
          {props.viewMode ? (
            <p
              className="form-control-static"
              id={`fragmentQuantity${props.index}`}
            >
              {props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.fragmentQuantity}
            </p>
          ) : (
            <input
              className="form-control"
              id={`fragmentQuantity${props.index}`}
              value={
                props.measurementDetermination.measurementData &&
                props.measurementDetermination.measurementData.fragmentQuantity
              }
              onChange={t =>
                props.onChange("measurementData")({
                  ...props.measurementDetermination.measurementData,
                  fragmentQuantity:  t.target.value ? parseInt(t.target.value)
                  : undefined
                })}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
    </div>
  );
  return (
    <SubEventComponentNote
      {...props}
      subEvent={props.measurementDetermination}
      eventName={I18n.t(
        "musit.conservation.events.measurementDetermination.measurementDetermination"
      )}
      noteLabel={I18n.t(
        "musit.conservation.events.measurementDetermination.note"
      )}
      extraAttributes={extraAttributes}
      objectsReadOnly
    />
  );
}
