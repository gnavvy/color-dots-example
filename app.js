/* global document, window,*/
import React, {PureComponent} from 'react';
import {render} from 'react-dom';
import DeckGL, {
  ScatterplotLayer, OrthographicViewport, COORDINATE_SYSTEM
} from 'deck.gl';
import {hsl, rgb} from 'd3-color';

const NUM_POINTS = 50000;

class Root extends PureComponent {
  constructor(props) {
    super(props);

    this._onResize = this._onResize.bind(this);
    this._update = this._update.bind(this);

    this.state = {
      width: 0,
      height: 0
    };

    this.points = Array.from(Array(NUM_POINTS)).map((_, i) => {
      // x, y in range [-1, 1]
      return {
        idx: i,
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        radius: 0
      };
    });
  }

  componentWillMount() {
    window.addEventListener('resize', this._onResize);
    this._onResize();
  }

  componentDidMount() {
    window.requestAnimationFrame(this._update);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  }

  _onResize() {
    const {innerWidth: width, innerHeight: height} = window;
    this.setState({width, height});
  }

  _update() {
    const now = Date.now();

    const radius = (Math.cos(Math.PI * 2 * (now % 3000 / 3000)) + 1) * 5;


    this.points.forEach(point => {
      point.radius = radius;

      const color = hsl((now + point.idx) / 20 % 360, 0.8, 0.5);
      const {r, g, b, opacity} = color.rgb();
      point.color = [r, g, b, opacity * 255 * 0.8];
    });
    this.points._lastUpdate = now;

    this.forceUpdate();
    window.requestAnimationFrame(this._update);
  }

  _renderScatterplotLayer() {
    const {width, height} = this.state;

    return new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: this.points,
      getPosition: p => [p.x * width / 2, p.y * height / 2],
      // set min radius to 2 to prevent them from disappearing
      getRadius: p => Math.max(p.radius, 2),
      getColor: p => p.color,
      updateTriggers: {
        getRadius: this.points._lastUpdate,
        getColor: this.points._lastUpdate
      },
      projectionMode: COORDINATE_SYSTEM.IDENTITY
    });
  }

  render() {
    const {width, height} = this.state;
    const left = -width / 2;
    const top = -height / 2;
    const glViewport = new OrthographicViewport({width, height, left, top});

    return width && height && <div>
      <DeckGL width={width} height={height} viewport={glViewport}
        layers={[this._renderScatterplotLayer()]}/>
    </div>;
  }
}

const root = document.createElement('div');
document.body.appendChild(root);

render(<Root />, root);
