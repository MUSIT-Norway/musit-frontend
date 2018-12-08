import * as React from 'react';

export const CoordinateFormats = () => (
  <div className="container-fluid">
    <h1>Illegal coordinate format?</h1>
    <h2>Legal formats are:</h2>
    <h3>MGRS</h3>
    <div>
      <pre>NM 2345,3221 (antall siffer i Øst/Vest og Nord/Sør er fra 1 - 5).</pre>
      <pre>Sone og belte (Zone and Band) må være angitt.</pre>
      <pre>Øst/Vest og Nord/Sør skilles med komma.</pre>
    </div>
    <h3>UTM</h3>
    <div>
      <pre>
        3422, 34566 eller 3422 34566, der første tall er Øst/Vest, og Nord/Sør er andre
        tall.{' '}
      </pre>
      <pre>Tallene kan skilles med komma eller mellomrom</pre>
    </div>
    <h3>LAT/LONG</h3>
    <div>
      <pre>
        Enten grader (min (og sekunder)) eller desimalgrader Grader minutter og sekunder:
      </pre>
      <pre>60 45 23N 10 34 12E 53 23N 10 12 34W </pre>
      <pre>Desimalgrader: 60.2345 32.322 -10.34 34</pre>
      <pre>Negative tall er S for første tall og W for andre tall.</pre>
      <pre>Nord/Sør og Øst/Vest skilles med mellomrom</pre>
    </div>
  </div>
);

export default CoordinateFormats;
