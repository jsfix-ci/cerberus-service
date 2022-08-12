import { hyperlinkify } from './hyperlinkifyUtil';

describe('hyperlinkify', () => {
  it('should format notes containing a hyperlink successfully', () => {
    const input = 'Hello, here is a [link](EXAMPLE_URL) to test';
    const hyperlinkifiedInput = hyperlinkify(input);

    expect(hyperlinkifiedInput.length).toBe(3);

    expect(typeof hyperlinkifiedInput[0]).toBe('string');
    expect(typeof hyperlinkifiedInput[1]).toBe('object');
    expect(typeof hyperlinkifiedInput[2]).toBe('string');

    expect(hyperlinkifiedInput[1].props.href).toBe('EXAMPLE_URL');
    expect(hyperlinkifiedInput[1].props.children).toBe('link');
  });

  it('should format notes containing multiple hyperlinks successfully', () => {
    const input = 'Hello, here is a [link](EXAMPLE_URL) to test and another one called [FOO](BAR)';
    const hyperlinkifiedInput = hyperlinkify(input);

    expect(hyperlinkifiedInput.length).toBe(5);

    expect(typeof hyperlinkifiedInput[0]).toBe('string');
    expect(typeof hyperlinkifiedInput[1]).toBe('object');
    expect(typeof hyperlinkifiedInput[2]).toBe('string');
    expect(typeof hyperlinkifiedInput[3]).toBe('object');

    expect(hyperlinkifiedInput[1].props.href).toBe('EXAMPLE_URL');
    expect(hyperlinkifiedInput[1].props.children).toBe('link');
    expect(hyperlinkifiedInput[3].props.href).toBe('BAR');
    expect(hyperlinkifiedInput[3].props.children).toBe('FOO');
  });

  it('should format notes containing no hyperlinks successfully', () => {
    const input = 'Hello, there is no note in this string';
    const hyperlinkifiedInput = hyperlinkify(input);

    expect(hyperlinkifiedInput.length).toBe(1);

    expect(typeof hyperlinkifiedInput[0]).toBe('string');
  });
});
