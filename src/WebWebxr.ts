import { LitElement, html, css, property } from 'lit-element';

import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { MapboxLayer } from '@deck.gl/mapbox';
import * as mapboxgl from 'mapbox-gl';
import * as d3 from 'd3';

import { openWcLogo } from './open-wc-logo.js';

export class WebWebxr extends LitElement {
  @property({ type: String }) page = 'main';

  @property({ type: String }) title = '';

  private map!: mapboxgl.Map;

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
    }

    main {
      flex-grow: 1;
    }

    .logo > svg {
      margin-top: 36px;
      animation: app-logo-spin infinite 20s linear;
    }

    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    // Here is a problem too in that this element has not bee defined yet.
    const mapContainer = this.shadowRoot.getElementById('map');

    // mapboxgl.Map
    // tries to "import fs from 'fs';" at import from node_modules/@loaders.gl/core/dist/esm/node/read-file-sync.node.js
    // here and it crashes loading the web component. What could be done?
  
  this.map = new mapboxgl.Map({
      container: mapContainer,
      style: 'https://api.maptiler.com/maps/84873d64-1572-4d4d-92ff-dec92410f211/style.json?key=<snip>',
      center: [24.9221687500000009, 60.1610882352941161],
      zoom: 15,
      pitch: 40.5
    });
    
    
    this.map.addControl(new mapboxgl.NavigationControl());
    
    const PM25_DATA_URL = '<snip>';
    const DATA_URL = PM25_DATA_URL;
    
    const OPTIONS = ['radius', 'coverage', 'upperPercentile'];
    const COLOR_RANGE = [
      [1, 152, 189],
      [73, 227, 206],
      [216, 254, 181],
      [254, 237, 177],
      [254, 173, 84],
      [209, 55, 78]
    ];
    
    const LIGHT_SETTINGS = {
      lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
      ambientRatio: 0.4,
      diffuseRatio: 0.6,
      specularRatio: 0.2,
      lightsStrength: [0.8, 0.0, 0.8, 0.0],
      numberOfLights: 4
    };
    
    const reducer = arr => arr.reduce((accumulator, currentValue) => currentValue ? accumulator + Number(currentValue.val) : accumulator, 0) / arr.length;
    const csvData = d3.csv(DATA_URL);
    let hexagonLayer =  new MapboxLayer({
        type: HexagonLayer,
        id: 'map',
        data: csvData,
        radius: 20,
        coverage: 1,
        upperPercentile: 100,
        colorRange: COLOR_RANGE,
        elevationRange: [0, 1000],
        elevationScale: 0.5,
        getElevationValue: points => reducer(points),
        getColorValue: points => reducer(points),
        extruded: true,
        getPosition: d => [Number(d.lon), Number(d.lat)],
        lightSettings: LIGHT_SETTINGS,
        onHover: true,
        opacity: 0.5
    });
    
               
    this.map.addLayer(hexagonLayer, "waterway");

    this.map.on('load', ev => {      
  });
  }

  render() {
    return html`
      <main>
        <div class="logo">${openWcLogo}</div>
        <div id="map"></div>
        <h1>My app</h1>

        <p>Edit <code>src/WebWebxr.ts</code> and save to reload.</p>
        <a
          class="app-link"
          href="https://open-wc.org/developing/#code-examples"
          target="_blank"
          rel="noopener noreferrer"
        >
          Code examples
        </a>
      </main>

      <p class="app-footer">
        🚽 Made with love by
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/open-wc"
          >open-wc</a
        >.
      </p>
    `;
  }
}
