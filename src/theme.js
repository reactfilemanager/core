// example theme.js
export default {
  space: [ 0, 4, 8, 16, 32, 64, 128, 256, 512 ],
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: 'inherit',
    monospace: 'Menlo, monospace'
  },
  fontSizes: [ 12, 14, 16, 20, 24, 32, 48, 64, 96 ],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125
  },
  sizes: {
    sidebar: 272,
    toolbar: '60%',
    utility: '20%',
    search: '20%'
  },

  colors: {
    text: '#000',
    background: '#fff',
    primary: '#3333ee',
    secondary: '#111199',
    muted: '#f6f6f6'
  },
  background:{
    gray: '#eee',
    darkGray: '#ccc',
    lightGray: '#f0f0f0'
  },
  cards: {
    primary: {
      padding: 2,
      borderRadius: 3,
      border: '1xp solid #ddd',
      boxShadow: '0 0 5px rgba(0, 0, 0, 0.125)',
    },
    compact: {
      padding: 1,
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'muted',
    },
  },
  buttons: {
    primary: {
      py: 1,
      px: 2,
      mr: 2,
      cursor: 'pointer',
      color: 'background',
      bg: 'primary',
    },
    secondary: {
      color: 'text',
      bg: 'white',
      border: '1px solid #ddd',
      py: 1,
      px: 2,
      mr: 2,
      cursor: 'pointer',
      '&:hover': {
        bg: 'muted',
      },
      '&:disabled':{
        opacity: '0.6'
      }
    },
    utility:{
      py: 1,
      px: 2,
      mr: 0,
      color: 'text',
      lineHeight: 0,
      background: 'transparent',
      border: '1px solid transparent',
      borderRadius: '3px',
      cursor: 'pointer',
      '&:hover, &:focus, &.active': {
        background: 'white',
        borderColor: '#ddd'
      }
    }
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body'
    },
    img: {
      maxWidth: '100%'
    },
    hr:{
      color: '#ddd'
    },
  },
  forms: {
    input: {
      bg: 'white',
      borderColor: '#ddd',
      borderRadius: '3px',
      py: 1,
      fontSizes: 12,
      color: 'text',
      '&:focus': {
        borderColor: 'primary',
        boxShadow: t => `0 0 0 2px ${t.colors.primary}`,
        outline: 'none',
      },
    },
  },
  table: {
    td : {
      py: 2,
      px: 4
    }
  }
}