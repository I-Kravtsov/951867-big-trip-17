import AbstractView from './view/abstract-view';

export const renderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const replace = (newElement, oldElement) => {
  if (oldElement === null || newElement === null) {
    throw new Error('Can\'t replace unexisting elements');
  }
  const newChild = newElement instanceof AbstractView ? newElement.element : newElement;
  const oldChild = oldElement instanceof AbstractView ? oldElement.element : oldElement;
  const parent = oldChild.parentElement;
  if (parent === null) {
    throw new Error ('Parent element doesn\'t exist');
  }
  parent.replaceChild(newChild, oldChild);
};

export const render = (container, element, place) => {
  const parrent = container instanceof AbstractView ? container.element : container;
  const child = element instanceof AbstractView ? element.element : element;
  switch (place) {
    case renderPosition.BEFOREBEGIN :
      parrent.before(child);
      break;
    case renderPosition.AFTERBEGIN :
      parrent.prepend(child);
      break;
    case renderPosition.BEFOREEND :
      parrent.append(child);
      break;
    case renderPosition.AFTEREND :
      parrent.after(child);
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const remove = (component) => {
  if(component.element === null) {
    return;
  }
  if (!(component instanceof AbstractView) ) {
    throw new Error ('Can remove only components');
  }
  component.element.remove();
  component.removeElement();
};
