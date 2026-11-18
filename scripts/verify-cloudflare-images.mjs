// Regression check for the pinned vinext responsive-fill patch.
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Image, { getImageProps } from 'vinext/shims/image';

for (const sizes of [undefined, '100vw', '(max-width: 450px) calc(100vw - 88px), 363px']) {
  const input = { src: '/images/hero/motorbike_light.jpeg', alt: 'Test', fill: true, sizes };
  const { props } = getImageProps(input);
  assert.match(props.srcSet, /1920w/);
  assert.match(props.srcSet, /3840w/);
  assert.equal(props.sizes, sizes ?? '100vw');
  const html = renderToStaticMarkup(createElement(Image, input));
  assert.match(html, /srcSet="[^"]+1920w/);
  assert.match(html, /position:absolute/);
}
assert.equal(getImageProps({src:'/logo.svg',alt:'Logo',fill:true}).props.srcSet, undefined);
assert.equal(getImageProps({src:'/photo.jpg',alt:'Raw',fill:true,unoptimized:true}).props.srcSet, undefined);
assert.match(getImageProps({src:'/photo.jpg',alt:'Fixed',width:300,height:200}).props.srcSet, / 2x/);
console.log('Responsive fill, fixed dimensions, SVG, and unoptimized images pass.');
