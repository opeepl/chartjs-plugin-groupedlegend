import { setStyles } from '../utils';

describe('setStyles', () => {
  it('should set styles', () => {
    const style = {} as CSSStyleDeclaration;
    setStyles(style, {
      backgroundColor: 'red',
      color: 'blue',
    });
    expect(style.backgroundColor).toBe('red');
    expect(style.color).toBe('blue');
  });
}
);
