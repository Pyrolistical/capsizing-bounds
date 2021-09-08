import React, { StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { createStyleObject } from '@capsizecss/core';
import styled from '@emotion/styled';

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
function Text({ fontFamily, fontSize, capHeight, children }) {
  if (typeof children !== 'string') {
    throw new Error(
      `expected children to be a string but was ${typeof children}`
    );
  }
  const [width, setWidth] = useState();
  const tweakedFontSize = createStyleObject({
    fontMetrics: webSafeFonts[fontFamily],
    capHeight
  });

  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${tweakedFontSize.fontSize} ${fontFamily}`;
    const textMetrics = ctx.measureText(children);
    setWidth(`${textMetrics.width}px`);
  }, [fontFamily, capHeight, children]);

  if (!width) {
    return 'Loading...';
  }

  const TweakedChildren = styled.span({
    ...tweakedFontSize,
    fontFamily
  });
  return (
    <Bounds width={width} height={capHeight}>
      <TweakedChildren>{children}</TweakedChildren>
    </Bounds>
  );
}

const webSafeFonts = {
  Arial: {
    capHeight: 1467,
    ascent: 1854,
    descent: -434,
    lineGap: 67,
    unitsPerEm: 2048
  },
  'Brush Script MT': {},
  'Courier New': {},
  Garamond: {},
  Georgia: {},
  Helvetica: {},
  Tahoma: {},
  'Times New Roman': {},
  'Trebuchet MS': {},
  Verdana: {}
};

const fontSizes = ['8px', '16px', '32px', '64px', '128px'];
const capHeights = [8, 16, 32, 64, 128];

const App = () => {
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('16px');
  const [capHeight, setCapHeight] = useState(16);
  const [text, setText] = useState('Edit me and watch my bounds');
  return (
    <>
      <h1>Inputs</h1>
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
          <h2>Font size</h2>
          <select
            value={fontSize}
            onChange={({ target: { value } }) => setFontSize(value)}
            size={fontSizes.length}
          >
            {fontSizes.map(fontSize => (
              <option key={fontSize} value={fontSize}>
                {fontSize}
              </option>
            ))}
          </select>
        </label>
        <label>
          <h2>Cap height</h2>
          <select
            value={capHeight}
            onChange={({ target: { value } }) => setCapHeight(value)}
            size={capHeights.length}
          >
            {capHeights.map(capHeight => (
              <option key={capHeight} value={capHeight}>
                {capHeight}px
              </option>
            ))}
          </select>
        </label>
      </div>
      <h1>Output</h1>
      <Text fontFamily={fontFamily} fontSize={fontSize} capHeight={capHeight}>
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
