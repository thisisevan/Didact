/** @jsx createElement */
// @flow

const TEXT_ELEMENT = "TEXT ELEMENT";

function render(element, parentDom) {
  const { type, props } = element;

  const isTextElement = type === "TEXT ELEMENT";

  const dom: HTMLElement = isTextElement
    ? (document.createTextNode(""): any)
    : document.createElement(type);

  const isListener = (name: string) => name.startsWith("on");
  Object.keys(props)
    .filter(isListener)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);

      if (typeof props[name] === "function") {
        const listener: EventListener = props[name];
        dom.addEventListener(name, listener);
      } else {
        throw new Error("Event listener was not a function");
      }
    });

  const isAttribute = name => !isListener(name) && name != "children";
  Object.keys(props)
    .filter(isAttribute)
    .forEach(name => {
      (dom: any)[name] = props[name];
    });

  const childElements = props.children || [];
  childElements.forEach(child => render(child, dom));

  parentDom.appendChild(dom);
}

type Props = {
  children?: any[]
};

function createElement(type: string, config, ...args) {
  const props: Props = { ...config };

  const hasChildren = args.length > 0;
  const rawChildren = hasChildren ? [].concat(...args) : [];

  props.children = rawChildren
    .filter(c => c != null && c !== false)
    .map(c => (c instanceof Object ? c : createTextElement(c)));

  return { type, props };
}

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

function ready() {
  render(
    <h1 id="good" hmm="ha" className="how are ya">
      Hi
    </h1>,
    document.getElementsByTagName("body")[0]
  );
  // {
  //   type: "h1",
  //   props: {
  //     children: [
  //       {
  //         type: "TEXT ELEMENT",
  //         props: { nodeValue: "Hello world, how are you?" }
  //       }
  //     ]
  //   }
}

document.addEventListener("DOMContentLoaded", ready);
