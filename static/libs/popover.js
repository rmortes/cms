var ToggleEvent=class extends Event{oldState;newState;constructor(type,{oldState:oldState="",newState:newState="",...init}={}){super(type,init),this.oldState=String(oldState||""),this.newState=String(newState||"")}},popoverToggleTaskQueue=new WeakMap;function queuePopoverToggleEventTask(element,oldState,newState){popoverToggleTaskQueue.set(element,setTimeout((()=>{popoverToggleTaskQueue.has(element)&&element.dispatchEvent(new ToggleEvent("toggle",{cancelable:!1,oldState:oldState,newState:newState}))}),0))}var ShadowRoot=globalThis.ShadowRoot||function(){},HTMLDialogElement=globalThis.HTMLDialogElement||function(){},topLayerElements=new WeakMap,autoPopoverList=new WeakMap,visibilityState=new WeakMap;function getPopoverVisibilityState(popover){return visibilityState.get(popover)||"hidden"}var popoverInvoker=new WeakMap;function popoverTargetAttributeActivationBehavior(element){const popover=element.popoverTargetElement;if(!(popover instanceof HTMLElement))return;const visibility=getPopoverVisibilityState(popover);"show"===element.popoverTargetAction&&"showing"===visibility||"hide"===element.popoverTargetAction&&"hidden"===visibility||("showing"===visibility?hidePopover(popover,!0,!0):checkPopoverValidity(popover,!1)&&(popoverInvoker.set(popover,element),showPopover(popover)))}function checkPopoverValidity(element,expectedToBeShowing){return("auto"===element.popover||"manual"===element.popover)&&(!!element.isConnected&&((!expectedToBeShowing||"showing"===getPopoverVisibilityState(element))&&(!(!expectedToBeShowing&&"hidden"!==getPopoverVisibilityState(element))&&(!(element instanceof HTMLDialogElement&&element.hasAttribute("open"))&&document.fullscreenElement!==element))))}function getStackPosition(popover){return popover?Array.from(autoPopoverList.get(popover.ownerDocument)||[]).indexOf(popover)+1:0}function topMostClickedPopover(target){const clickedPopover=nearestInclusiveOpenPopover(target),invokerPopover=nearestInclusiveTargetPopoverForInvoker(target);return getStackPosition(clickedPopover)>getStackPosition(invokerPopover)?clickedPopover:invokerPopover}function topMostAutoPopover(document2){const documentPopovers=autoPopoverList.get(document2);for(const popover of documentPopovers||[]){if(popover.isConnected)return popover;documentPopovers.delete(popover)}return null}function getRootNode(node){return"function"==typeof node.getRootNode?node.getRootNode():node.parentNode?getRootNode(node.parentNode):node}function nearestInclusiveOpenPopover(node){for(;node;){if(node instanceof HTMLElement&&"auto"===node.popover&&"showing"===visibilityState.get(node))return node;if((node=node.parentElement||getRootNode(node))instanceof ShadowRoot&&(node=node.host),node instanceof Document)return}}function nearestInclusiveTargetPopoverForInvoker(node){for(;node;){const nodePopover=node.popoverTargetElement;if(nodePopover instanceof HTMLElement)return nodePopover;if((node=node.parentElement||getRootNode(node))instanceof ShadowRoot&&(node=node.host),node instanceof Document)return}}function topMostPopoverAncestor(newPopover){const popoverPositions=new Map;let i=0;const document2=newPopover.ownerDocument;for(const popover of autoPopoverList.get(document2)||[])popoverPositions.set(popover,i),i+=1;popoverPositions.set(newPopover,i),i+=1;let topMostPopoverAncestor2=null;return function(candidate){const candidateAncestor=nearestInclusiveOpenPopover(candidate);if(null===candidateAncestor)return null;const candidatePosition=popoverPositions.get(candidateAncestor);(null===topMostPopoverAncestor2||popoverPositions.get(topMostPopoverAncestor2)<candidatePosition)&&(topMostPopoverAncestor2=candidateAncestor)}(newPopover?.parentElement),topMostPopoverAncestor2}function isFocusable(focusTarget){return!(focusTarget.hidden||focusTarget instanceof ShadowRoot)&&((!(focusTarget instanceof HTMLButtonElement||focusTarget instanceof HTMLInputElement||focusTarget instanceof HTMLSelectElement||focusTarget instanceof HTMLTextAreaElement||focusTarget instanceof HTMLOptGroupElement||focusTarget instanceof HTMLOptionElement||focusTarget instanceof HTMLFieldSetElement)||!focusTarget.disabled)&&(!(focusTarget instanceof HTMLInputElement&&"hidden"===focusTarget.type)&&(!(focusTarget instanceof HTMLAnchorElement&&""===focusTarget.href)&&("number"==typeof focusTarget.tabIndex&&-1!==focusTarget.tabIndex))))}function focusDelegate(focusTarget){if(focusTarget.shadowRoot&&!0!==focusTarget.shadowRoot.delegatesFocus)return null;let whereToLook=focusTarget;whereToLook.shadowRoot&&(whereToLook=whereToLook.shadowRoot);let autoFocusDelegate=whereToLook.querySelector("[autofocus]");if(autoFocusDelegate)return autoFocusDelegate;{const slots=whereToLook.querySelectorAll("slot");for(const slot of slots){const assignedElements=slot.assignedElements({flatten:!0});for(const el of assignedElements){if(el.hasAttribute("autofocus"))return el;if(autoFocusDelegate=el.querySelector("[autofocus]"),autoFocusDelegate)return autoFocusDelegate}}}const walker=focusTarget.ownerDocument.createTreeWalker(whereToLook,NodeFilter.SHOW_ELEMENT);let descendant=walker.currentNode;for(;descendant;){if(isFocusable(descendant))return descendant;descendant=walker.nextNode()}}function popoverFocusingSteps(subject){focusDelegate(subject)?.focus()}var previouslyFocusedElements=new WeakMap;function showPopover(element){if(!checkPopoverValidity(element,!1))return;const document2=element.ownerDocument;if(!element.dispatchEvent(new ToggleEvent("beforetoggle",{cancelable:!0,oldState:"closed",newState:"open"})))return;if(!checkPopoverValidity(element,!1))return;let shouldRestoreFocus=!1;if("auto"===element.popover){const originalType=element.getAttribute("popover");if(hideAllPopoversUntil(topMostPopoverAncestor(element)||document2,!1,!0),originalType!==element.getAttribute("popover")||!checkPopoverValidity(element,!1))return}topMostAutoPopover(document2)||(shouldRestoreFocus=!0),previouslyFocusedElements.delete(element);const originallyFocusedElement=document2.activeElement;element.classList.add(":popover-open"),visibilityState.set(element,"showing"),topLayerElements.has(document2)||topLayerElements.set(document2,new Set),topLayerElements.get(document2).add(element),popoverFocusingSteps(element),"auto"===element.popover&&(autoPopoverList.has(document2)||autoPopoverList.set(document2,new Set),autoPopoverList.get(document2).add(element),setInvokerAriaExpanded(popoverInvoker.get(element),!0)),shouldRestoreFocus&&originallyFocusedElement&&"auto"===element.popover&&previouslyFocusedElements.set(element,originallyFocusedElement),queuePopoverToggleEventTask(element,"closed","open")}function hidePopover(element,focusPreviousElement=!1,fireEvents=!1){if(!checkPopoverValidity(element,!0))return;const document2=element.ownerDocument;if("auto"===element.popover&&(hideAllPopoversUntil(element,focusPreviousElement,fireEvents),!checkPopoverValidity(element,!0)))return;if(setInvokerAriaExpanded(popoverInvoker.get(element),!1),popoverInvoker.delete(element),fireEvents&&(element.dispatchEvent(new ToggleEvent("beforetoggle",{oldState:"open",newState:"closed"})),!checkPopoverValidity(element,!0)))return;topLayerElements.get(document2)?.delete(element),autoPopoverList.get(document2)?.delete(element),element.classList.remove(":popover-open"),visibilityState.set(element,"hidden"),fireEvents&&queuePopoverToggleEventTask(element,"open","closed");const previouslyFocusedElement=previouslyFocusedElements.get(element);previouslyFocusedElement&&(previouslyFocusedElements.delete(element),focusPreviousElement&&previouslyFocusedElement.focus())}function closeAllOpenPopovers(document2,focusPreviousElement=!1,fireEvents=!1){let popover=topMostAutoPopover(document2);for(;popover;)hidePopover(popover,focusPreviousElement,fireEvents),popover=topMostAutoPopover(document2)}function hideAllPopoversUntil(endpoint,focusPreviousElement,fireEvents){const document2=endpoint.ownerDocument||endpoint;if(endpoint instanceof Document)return closeAllOpenPopovers(document2,focusPreviousElement,fireEvents);let lastToHide=null,foundEndpoint=!1;for(const popover of autoPopoverList.get(document2)||[])if(popover===endpoint)foundEndpoint=!0;else if(foundEndpoint){lastToHide=popover;break}if(!foundEndpoint)return closeAllOpenPopovers(document2,focusPreviousElement,fireEvents);for(;lastToHide&&"showing"===getPopoverVisibilityState(lastToHide)&&autoPopoverList.get(document2)?.size;)hidePopover(lastToHide,focusPreviousElement,fireEvents)}var popoverPointerDownTargets=new WeakMap;function lightDismissOpenPopovers(event){if(!event.isTrusted)return;const target=event.composedPath()[0];if(!target)return;const document2=target.ownerDocument;if(!topMostAutoPopover(document2))return;const ancestor=topMostClickedPopover(target);if(ancestor&&"pointerdown"===event.type)popoverPointerDownTargets.set(document2,ancestor);else if("pointerup"===event.type){const sameTarget=popoverPointerDownTargets.get(document2)===ancestor;popoverPointerDownTargets.delete(document2),sameTarget&&hideAllPopoversUntil(ancestor||document2,!1,!0)}}var initialAriaExpandedValue=new WeakMap;function setInvokerAriaExpanded(el,force=!1){if(!el)return;initialAriaExpandedValue.has(el)||initialAriaExpandedValue.set(el,el.getAttribute("aria-expanded"));const popover=el.popoverTargetElement;if(popover instanceof HTMLElement&&"auto"===popover.popover)el.setAttribute("aria-expanded",String(force));else{const initialValue=initialAriaExpandedValue.get(el);initialValue?el.setAttribute("aria-expanded",initialValue):el.removeAttribute("aria-expanded")}}var ShadowRoot2=globalThis.ShadowRoot||function(){};function isSupported(){return"undefined"!=typeof HTMLElement&&"object"==typeof HTMLElement.prototype&&"popover"in HTMLElement.prototype}function patchSelectorFn(object,name,mapper){const original=object[name];Object.defineProperty(object,name,{value(selector){return original.call(this,mapper(selector))}})}var nonEscapedPopoverSelector=/(^|[^\\]):popover-open\b/g,hasLayerSupport="function"==typeof window.CSSLayerBlockRule,styles=`\n${hasLayerSupport?"@layer popover-polyfill {":""}\n  :where([popover]) {\n    position: fixed;\n    z-index: 2147483647;\n    inset: 0;\n    padding: 0.25em;\n    width: fit-content;\n    height: fit-content;\n    border-width: initial;\n    border-color: initial;\n    border-image: initial;\n    border-style: solid;\n    background-color: canvas;\n    color: canvastext;\n    overflow: auto;\n    margin: auto;\n  }\n\n  :where(dialog[popover][open]) {\n    display: revert;\n  }\n\n  :where([anchor].\\:popover-open) {\n    inset: auto;\n  }\n\n  :where([anchor]:popover-open) {\n    inset: auto;\n  }\n\n  @supports not (background-color: canvas) {\n    :where([popover]) {\n      background-color: white;\n      color: black;\n    }\n  }\n\n  @supports (width: -moz-fit-content) {\n    :where([popover]) {\n      width: -moz-fit-content;\n      height: -moz-fit-content;\n    }\n  }\n\n  @supports not (inset: 0) {\n    :where([popover]) {\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n    }\n  }\n\n  :where([popover]:not(.\\:popover-open)) {\n    display: none;\n  }\n${hasLayerSupport?"}":""}\n`,popoverStyleSheet=null;function injectStyles(root){if(null===popoverStyleSheet)try{(popoverStyleSheet=new CSSStyleSheet).replaceSync(styles)}catch{popoverStyleSheet=!1}if(!1===popoverStyleSheet){const sheet=document.createElement("style");sheet.textContent=styles,root instanceof Document?root.head.prepend(sheet):root.prepend(sheet)}else root.adoptedStyleSheets=[popoverStyleSheet,...root.adoptedStyleSheets]}function apply(){function rewriteSelector(selector){return selector?.includes(":popover-open")&&(selector=selector.replace(nonEscapedPopoverSelector,"$1.\\:popover-open")),selector}window.ToggleEvent=window.ToggleEvent||ToggleEvent,patchSelectorFn(Document.prototype,"querySelector",rewriteSelector),patchSelectorFn(Document.prototype,"querySelectorAll",rewriteSelector),patchSelectorFn(Element.prototype,"querySelector",rewriteSelector),patchSelectorFn(Element.prototype,"querySelectorAll",rewriteSelector),patchSelectorFn(Element.prototype,"matches",rewriteSelector),patchSelectorFn(Element.prototype,"closest",rewriteSelector),patchSelectorFn(DocumentFragment.prototype,"querySelectorAll",rewriteSelector),patchSelectorFn(DocumentFragment.prototype,"querySelectorAll",rewriteSelector),Object.defineProperties(HTMLElement.prototype,{popover:{enumerable:!0,configurable:!0,get(){if(!this.hasAttribute("popover"))return null;const value=(this.getAttribute("popover")||"").toLowerCase();return""===value||"auto"==value?"auto":"manual"},set(value){this.setAttribute("popover",value)}},showPopover:{enumerable:!0,configurable:!0,value(){showPopover(this)}},hidePopover:{enumerable:!0,configurable:!0,value(){hidePopover(this,!0,!0)}},togglePopover:{enumerable:!0,configurable:!0,value(force){"showing"===visibilityState.get(this)&&void 0===force||!1===force?hidePopover(this,!0,!0):void 0!==force&&!0!==force||showPopover(this)}}});const originalAttachShadow=Element.prototype.attachShadow;originalAttachShadow&&Object.defineProperties(Element.prototype,{attachShadow:{enumerable:!0,configurable:!0,writable:!0,value(options){const shadowRoot=originalAttachShadow.call(this,options);return injectStyles(shadowRoot),shadowRoot}}});const originalAttachInternals=HTMLElement.prototype.attachInternals;originalAttachInternals&&Object.defineProperties(HTMLElement.prototype,{attachInternals:{enumerable:!0,configurable:!0,writable:!0,value(){const internals=originalAttachInternals.call(this);return internals.shadowRoot&&injectStyles(internals.shadowRoot),internals}}});const popoverTargetAssociatedElements=new WeakMap;function applyPopoverInvokerElementMixin(ElementClass){Object.defineProperties(ElementClass.prototype,{popoverTargetElement:{enumerable:!0,configurable:!0,set(targetElement){if(null===targetElement)this.removeAttribute("popovertarget"),popoverTargetAssociatedElements.delete(this);else{if(!(targetElement instanceof Element))throw new TypeError("popoverTargetElement must be an element or null");this.setAttribute("popovertarget",""),popoverTargetAssociatedElements.set(this,targetElement)}},get(){if("button"!==this.localName&&"input"!==this.localName)return null;if("input"===this.localName&&"reset"!==this.type&&"image"!==this.type&&"button"!==this.type)return null;if(this.disabled)return null;if(this.form&&"submit"===this.type)return null;const targetElement=popoverTargetAssociatedElements.get(this);if(targetElement&&targetElement.isConnected)return targetElement;if(targetElement&&!targetElement.isConnected)return popoverTargetAssociatedElements.delete(this),null;const root=getRootNode(this),idref=this.getAttribute("popovertarget");return(root instanceof Document||root instanceof ShadowRoot2)&&idref&&root.getElementById(idref)||null}},popoverTargetAction:{enumerable:!0,configurable:!0,get(){const value=(this.getAttribute("popovertargetaction")||"").toLowerCase();return"show"===value||"hide"===value?value:"toggle"},set(value){this.setAttribute("popovertargetaction",value)}}})}applyPopoverInvokerElementMixin(HTMLButtonElement),applyPopoverInvokerElementMixin(HTMLInputElement);const handleInvokerActivation=event=>{const composedPath=event.composedPath(),target=composedPath[0];if(!(target instanceof Element)||target?.shadowRoot)return;const root=getRootNode(target);if(!(root instanceof ShadowRoot2||root instanceof Document))return;const invoker=composedPath.find((el=>el.matches?.("[popovertargetaction],[popovertarget]")));return invoker?(popoverTargetAttributeActivationBehavior(invoker),void event.preventDefault()):void 0},onKeydown=event=>{const key=event.key,target=event.target;event.defaultPrevented||!target||"Escape"!==key&&"Esc"!==key||hideAllPopoversUntil(target.ownerDocument,!0,!0)};var root;(root=document).addEventListener("click",handleInvokerActivation),root.addEventListener("keydown",onKeydown),root.addEventListener("pointerdown",lightDismissOpenPopovers),root.addEventListener("pointerup",lightDismissOpenPopovers),injectStyles(document)}isSupported()||apply();