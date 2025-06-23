export const parseProductDescription = (desc) => {
  const result = {
    headline: '',
    intro: '',
    features: [],
    uses: [],
    closingLine: '',
    about: '',
    bestFor: [],
    tags: []
  };

  if (!desc) return result;

  const lines = desc.split('\n').map(line => line.trim()).filter(Boolean);

  const aboutLines = [];
  lines.forEach((line) => {
    if (line.startsWith('✨')) {
      result.headline = line.replace(/^✨\s*/, '');
    } else if (line.startsWith('🌾')) {
      result.intro = line.replace(/^🌾\s*/, '');
    } else if (line.startsWith('✔')) {
      result.features.push(line.replace(/^✔\s*/, ''));
    } else if (/^[🍲🎊🥗👩‍🍳🌱🧑‍🍳🔥🍽️]/.test(line)) {
      result.uses.push(line.replace(/^[^\w]+\s*/, ''));
    } else if (line.startsWith('🎉')) {
      result.closingLine = line.replace(/^🎉\s*/, '');
    } else if (line.startsWith('📦')) {
      const parts = line.replace('📦 Best For:', '').split('|').map(s => s.trim());
      result.bestFor = parts;
    } else if (line.startsWith('🏷️')) {
      result.tags = line.replace('🏷️', '').split(',').map(tag => tag.trim());
    } else {
      aboutLines.push(line);
    }
  });

  if (aboutLines.length > 0) {
    result.about = aboutLines.join(' ');
  }

  return result;
};
