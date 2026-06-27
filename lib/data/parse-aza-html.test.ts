import { describe, expect, it } from 'vitest';

import { parseAzaHtml } from '../../scripts/lib/parse-aza-html.mjs';

describe('parseAzaHtml', () => {
  it('extracts website and name from standard column markup', () => {
    const html = `
      <div class="column"><strong><a target="_blank" href="https://abilenezoo.org/" rel="noopener">Abilene Zoological Gardens</a>, Texas</strong><br>Accredited through March 2029</div>
    `;

    expect(parseAzaHtml(html)).toEqual([
      {
        name: 'Abilene Zoological Gardens',
        website: 'https://abilenezoo.org/',
      },
    ]);
  });

  it('handles malformed column markup with link wrapping strong', () => {
    const html = `
      <div class="column"><a target="_blank" href="https://www.elmwoodparkzoo.org/" rel="noopener"><strong>Elmwood Park Zoo</strong></a>, <strong>Pa.</strong><br>Accredited through September 2027</div>
    `;

    expect(parseAzaHtml(html)).toEqual([
      {
        name: 'Elmwood Park Zoo',
        website: 'https://www.elmwoodparkzoo.org/',
      },
    ]);
  });

  it('decodes html entities in names', () => {
    const html = `
      <div class="column"><strong><a href="https://www.temaiken.org/" rel="noopener">Fundaci&oacute;n Temaik&egrave;n</a>, Argentina</strong><br>Accredited through March 2028</div>
    `;

    expect(parseAzaHtml(html)).toEqual([
      {
        name: 'Fundación Temaikèn',
        website: 'https://www.temaiken.org/',
      },
    ]);
  });

  it('strips superscript entities from names', () => {
    const html = `
      <div class="column"><strong><a href="https://seaworld.com/san-diego/" rel="noopener">SeaWorld<sup>&reg;</sup> San Diego</a>, Calif.</strong><br>Accredited through March 2031</div>
    `;

    expect(parseAzaHtml(html)).toEqual([
      {
        name: 'SeaWorld® San Diego',
        website: 'https://seaworld.com/san-diego/',
      },
    ]);
  });
});
