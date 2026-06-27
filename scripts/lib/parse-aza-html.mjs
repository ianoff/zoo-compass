const EXCLUDED_HOSTS = [
  'aza.org',
  'facebook.com',
  'twitter.com',
  'instagram.com',
  'youtube.com',
  'googletagmanager.com',
  'clarity.ms',
  'bablic.com',
  'speakcdn.com',
];

const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  reg: '®',
  oacute: 'ó',
  Oacute: 'Ó',
  eacute: 'é',
  Eacute: 'É',
  iacute: 'í',
  Iacute: 'Í',
  uacute: 'ú',
  Uacute: 'Ú',
  ntilde: 'ñ',
  Ntilde: 'Ñ',
  agrave: 'à',
  Agrave: 'À',
  egrave: 'è',
  Egrave: 'È',
  igrave: 'ì',
  Igrave: 'Ì',
  ograve: 'ò',
  Ograve: 'Ò',
  ugrave: 'ù',
  Ugrave: 'Ù',
  ocirc: 'ô',
  Ocirc: 'Ô',
  ecirc: 'ê',
  Ecirc: 'Ê',
  acirc: 'â',
  Acirc: 'Â',
  icirc: 'î',
  Icirc: 'Î',
  ucirc: 'û',
  Ucirc: 'Û',
  ccedil: 'ç',
  Ccedil: 'Ç',
};

function decodeHtmlEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    )
    .replace(/&([a-z]+);/gi, (match, entity) => {
      const decoded = NAMED_ENTITIES[entity];
      return decoded ?? match;
    });
}

function stripHtmlTags(value) {
  return collapseWhitespace(decodeHtmlEntities(value.replace(/<[^>]+>/g, '')));
}

function collapseWhitespace(value) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/[,\s]+$/g, '')
    .trim();
}

function isExcludedUrl(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return EXCLUDED_HOSTS.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`),
    );
  } catch {
    return true;
  }
}

function extractColumnEntries(html) {
  const entries = [];
  const columnPattern = /<div class="column">([\s\S]*?)<\/div>/gi;
  let match = columnPattern.exec(html);

  while (match) {
    const block = match[1];
    if (!/Accredited through/i.test(block)) {
      match = columnPattern.exec(html);
      continue;
    }

    const linkPattern =
      /<a[^>]*href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let linkMatch = linkPattern.exec(block);

    while (linkMatch) {
      const website = linkMatch[1];
      const name = stripHtmlTags(linkMatch[2]);

      if (!isExcludedUrl(website) && name) {
        entries.push({ name, website });
        break;
      }

      linkMatch = linkPattern.exec(block);
    }

    match = columnPattern.exec(html);
  }

  return entries;
}

export function parseAzaHtml(html) {
  return extractColumnEntries(html);
}
