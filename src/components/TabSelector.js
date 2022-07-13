import * as React from 'react';
import "./style/browse.css";
import "./style/sidemenu.css";
import "./style/bookmarks.css";
import "./style/borrow.css";

export const TabSelector = ({
  isActive,
  children,
  onClick
}) => /*#__PURE__*/React.createElement("button", {
  className: `mr-0.5 group whitespace-nowrap  items-center px-2 py-1  ${isActive ? 'tabactive' : 'tabinactive'}`,
  onClick: onClick
}, children);

export default TabSelector;