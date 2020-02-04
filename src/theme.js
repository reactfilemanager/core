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
    breadcrumb: '60%',
    utility: '25%',
    search: '15%'
  },


  colors: {
    text: '#000',
    background: '#fff',
    primary: '#07c',
    secondary: '#30c',
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
      borderRadius: '2px',
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
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0
    },
    th: {
      textAlign: 'left',
      borderBottomStyle: 'solid'
    },
    td: {
      textAlign: 'left',
      borderBottomStyle: 'solid'
    },
    img: {
      maxWidth: '100%'
    }
  }
}