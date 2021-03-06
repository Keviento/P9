import { Predicate } from 'src/classes/Predicate';

enum KEYS {
    Shift = 'Shift',
    Control = 'Control',
    Alt = 'Alt',
    Digit1 = '1',
    Digit2 = '2',
    Digit3 = '3',
    a = 'a',
    b = 'b',
    c = 'c',
    e = 'e',
    g = 'g',
    i = 'i',
    l = 'l',
    m = 'm',
    o = 'o',
    p = 'p',
    r = 'r',
    s = 's',
    t = 't',
    w = 'w',
    y = 'y',
    z = 'z',
    Z = 'Z',
    x = 'x',
    v = 'v',
    d = 'd',
    Plus = '+',
    Minus = '-',
    Delete = 'Delete',
    Escape = 'Escape',
    Backspace = 'Backspace',
    Enter = 'Enter',
    ArrowLeft = 'ArrowLeft',
    ArrowRight = 'ArrowRight',
    Space = ' ',
    SmallerThan = '<',
    GreaterThan = '>',
}

enum MOUSE {
    LeftButton = 0,
    MouseWheel = 1,
    RightButton = 2,
}

enum NUMBER_OF_MS {
    Day = 100000 * 36 * 24,
    Hours = 100000 * 36,
    Minutes = 1000 * 60,
    Seconds = 1000,
}

const SIDEBAR_WIDTH = 360;

const ELEMENTS_BEFORE_LAST_CIRCLE = 1;

const MAX_DRAWING_LENGTH = 5;

const SVG_NS = 'http://www.w3.org/2000/svg';

const PREDICATE: Predicate = new Predicate();

const GIFS = ['/assets/gifs/love.gif', '/assets/gifs/money.gif', '/assets/gifs/rolling.gif'];

const MAX_NB_LABELS = 6;

const TITLE_ELEMENT_TO_REMOVE = 'element-to-remove';

export {
    MAX_NB_LABELS,
    GIFS,
    MAX_DRAWING_LENGTH,
    SIDEBAR_WIDTH,
    SVG_NS,
    KEYS,
    MOUSE,
    PREDICATE,
    ELEMENTS_BEFORE_LAST_CIRCLE,
    NUMBER_OF_MS,
    TITLE_ELEMENT_TO_REMOVE,
};
