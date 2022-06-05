export const styles: Record<string, Partial<CSSStyleDeclaration>> = {
  hidden: {
    textDecoration: 'line-through',
    textDecorationThickness: '0.24em',
  },
  canvasContainer: {
    maxHeight: '100%',
    minHeight: '0',
    flexGrow: '1',
  },
  legendContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '100%',
    cursor: 'default',
  },
  legendGroupContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
    fontSize: '12px',
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    color: '#666',
  },
  legendGroupName: {
    textAlign: 'center',
  },
  legendGroup: {
    flexGrow: '1',
    listStyle: 'none',
    paddingLeft: '0',
  },
  legendEntry: {
    padding: '0',
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '20px',
    marginLeft: '10px',
  },
  legendEntryMarker: {
    height: '12px',
    maxWidth: '40px',
    minWidth: '40px',
    boxShadow: '0px 0px 0.8px 0px rgba(0, 0, 0, 0.5)',
    marginRight: '6px',
    display: 'inline-block',
  },
  legendEntryName: {
    height: '100%',
    display: 'inline-block',
  },
};
