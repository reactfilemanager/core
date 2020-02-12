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
    primaryLight: '#efeffe',
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
      fontSize: 14, 
      cursor: 'pointer',
      color: 'background',
      bg: 'primary',
      display: 'flex',
      alignItems: 'center',
      '> span':{
        display: 'flex'
      },
      'svg':{
        width: '14px',
        height: '14px',
        marginRight: 1,
        '*':{
          stroke: 'white'
        }
      }
    },
    secondary: {
      color: 'gray',
      bg: 'white',
      border: '1px solid #ddd',
      py: 1,
      px: 2,
      mr: 2,
      fontSize: 14, 
      textTransform: 'uppercase',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      '&:hover, &:focus': {
        bg: 'primaryLight',
        borderColor: 'primary',
        color: 'text',
        'svg *':{ stroke: 'text' }
      },
      '&:disabled':{ opacity: '0.6'},
      '> span':{
        display: 'flex'
      },
      'svg':{
        width: '14px',
        height: '14px',
        marginRight: 1,
        '*':{
          stroke: 'gray'
        }
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
        borderColor: '#ddd',
        color: 'primary',
        'svg *':{
          stroke: 'primary',
        }
      }
    }
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
      overflow: 'hidden'
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