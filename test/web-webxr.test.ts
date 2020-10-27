import { html, fixture, expect } from '@open-wc/testing';

import {WebWebxr} from '../src/WebWebxr.js';
import '../src/web-webxr.js';

describe('WebWebxr', () => {
  let element: WebWebxr;
  beforeEach(async () => {
    element = await fixture(html`
      <web-webxr></web-webxr>
    `);
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('My app');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
