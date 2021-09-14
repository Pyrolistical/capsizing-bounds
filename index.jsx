import React, { StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { createStyleObject } from '@capsizecss/core';

function Bounds({ width, height, style, children }) {
  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: '1fr min-content',
        gridTemplateRows: 'min-content 1fr',
        gridGap: '5px',
        placeItems: 'center'
      }}
    >
      <span style={{ alignSelf: 'end' }}>{width}</span>
      <span />
      <div
        style={{
          ...style,
          position: 'relative',
          boxSizing: 'content-box',
          width,
          height,
          border: 'dashed 2px gray'
        }}
      >
        {children}
      </div>
      <span style={{ justifySelf: 'start' }}>{height}</span>
    </div>
  );
}
function Text({ fontFamily, widthMode, heightMode, size, children }) {
  if (typeof children !== 'string') {
    throw new Error(
      `expected children to be a string but was ${typeof children}`
    );
  }
  const [width, setWidth] = useState();
  const tweakedFontSize =
    heightMode === 'Cap height'
      ? createStyleObject({
          fontMetrics: webSafeFonts[fontFamily],
          capHeight: size
        })
      : { fontSize: `${size}px`, lineHeight: 'normal' };

  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${tweakedFontSize.fontSize} ${fontFamily}`;
    const textMetrics = ctx.measureText(children);
    setWidth(
      widthMode === 'textMetrics.width'
        ? textMetrics.width
        : // not recommended due to lack of browser support https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics#browser_compatibility
          Math.abs(textMetrics.actualBoundingBoxLeft) +
            Math.abs(textMetrics.actualBoundingBoxRight)
    );
  }, [fontFamily, widthMode, heightMode, size, children]);

  if (!width) {
    return 'Loading...';
  }
  const Before = () =>
    tweakedFontSize['::before'] ? (
      <div style={tweakedFontSize['::before']} />
    ) : (
      <></>
    );
  const After = () =>
    tweakedFontSize['::after'] ? (
      <div style={tweakedFontSize['::after']} />
    ) : (
      <></>
    );

  return (
    <Bounds width={`${width}px`} height={`${size}px`}>
      <span
        style={{
          fontFamily,
          fontSize: tweakedFontSize.fontSize,
          lineHeight: tweakedFontSize.lineHeight,
          whiteSpace: 'nowrap'
        }}
      >
        <Before />
        {children}
        <After />
      </span>
    </Bounds>
  );
}

// font metrics pulled from https://seek-oss.github.io/capsize/
const webSafeFonts = {
  Arial: {
    capHeight: 1467,
    ascent: 1854,
    descent: -434,
    lineGap: 67,
    unitsPerEm: 2048
  },
  'Courier New': {
    capHeight: 1170,
    ascent: 1705,
    descent: -615,
    lineGap: 0,
    unitsPerEm: 2048
  },
  Georgia: {
    capHeight: 1419,
    ascent: 1878,
    descent: -449,
    lineGap: 0,
    unitsPerEm: 2048
  },
  Tahoma: {
    capHeight: 1489,
    ascent: 2049,
    descent: -423,
    lineGap: 0,
    unitsPerEm: 2048
  },
  'Times New Roman': {
    capHeight: 1356,
    ascent: 1825,
    descent: -443,
    lineGap: 87,
    unitsPerEm: 2048
  },
  Verdana: {
    capHeight: 1489,
    ascent: 2059,
    descent: -430,
    lineGap: 0,
    unitsPerEm: 2048
  }
};

const widthModes = [
  'textMetrics.width',
  'textMetrics.actualBoundingBox left+right'
];
const heightModes = ['font-size', 'Cap height'];
const sizes = [8, 16, 32, 64, 128];

const App = () => {
  const [text, setText] = useState('Edit me and watch my bounds');
  const [fontFamily, setFontFamily] = useState('Tahoma');
  const [widthMode, setWidthMode] = useState('textMetrics.width');
  const [heightMode, setHeightMode] = useState('Cap height');
  const [size, setSize] = useState(32);
  return (
    <>
      <p>
        <a href="https://blog.battlefy.com/the-strangely-difficult-problem-of-drawing-a-box-around-text-e6a70bdf6bb9">
          Read blogpost
        </a>{' '}
        for full details.
      </p>
      <h1>Controls</h1>
      <label>
        <h2>Text</h2>
        <input
          type="text"
          value={text}
          onChange={({ target: { value } }) => setText(value)}
        />
      </label>
      <div id="inputs">
        <label>
          <h2>Font family</h2>
          <select
            value={fontFamily}
            onChange={({ target: { value } }) => setFontFamily(value)}
            size={Object.keys(webSafeFonts).length}
          >
            {Object.keys(webSafeFonts).map(webSafeFont => (
              <option key={webSafeFont} value={webSafeFont}>
                {webSafeFont}
              </option>
            ))}
          </select>
        </label>
        <label>
          <h2>Width mode</h2>
          <select
            value={widthMode}
            onChange={({ target: { value } }) => setWidthMode(value)}
            size={widthModes.length}
          >
            {widthModes.map(widthMode => (
              <option key={widthMode} value={widthMode}>
                {widthMode}
              </option>
            ))}
          </select>
        </label>
        <label>
          <h2>Height mode</h2>
          <select
            value={heightMode}
            onChange={({ target: { value } }) => setHeightMode(value)}
            size={heightModes.length}
          >
            {heightModes.map(heightMode => (
              <option key={heightMode} value={heightMode}>
                {heightMode}
              </option>
            ))}
          </select>
        </label>
        <label>
          <h2 dangerouslySetInnerHTML={{ __html: '&ZeroWidthSpace;' }} />
          <select
            value={size}
            onChange={({ target: { value } }) => setSize(value)}
            size={sizes.length}
          >
            {sizes.map(size => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </label>
      </div>
      <h1>Calculated bounds</h1>
      <Text
        fontFamily={fontFamily}
        widthMode={widthMode}
        heightMode={heightMode}
        size={size}
      >
        {text}
      </Text>
    </>
  );
};

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
