'use client';
export { Item } from 'react-stately/Item';
import { useBreadcrumbItem, useBreadcrumbs } from 'react-aria/useBreadcrumbs';
import { useRef, Fragment, forwardRef, Children, useState, useCallback, useLayoutEffect, createElement, isValidElement } from 'react';
import { useObjectRef } from 'react-aria/useObjectRef';
import { useResizeObserver } from 'react-aria/private/utils/useResizeObserver';
import { useValueEffect } from 'react-aria/private/utils/useValueEffect';
import { ActionButton } from '@keystar/ui/button';
import { useProviderProps } from '@keystar/ui/core';
import { Icon } from '@keystar/ui/icon';
import { folderClosedIcon } from '@keystar/ui/icon/icons/folderClosedIcon';
import { folderOpenIcon } from '@keystar/ui/icon/icons/folderOpenIcon';
import { MenuTrigger, Menu } from '@keystar/ui/menu';
import { ClassList, toDataAttributes, classNames, css, tokenSchema, FocusRing, useStyleProps } from '@keystar/ui/style';
import { c } from './react-compiler-runtime-19061925.js';
import { useLocale } from 'react-aria/I18nProvider';
import { useHover } from 'react-aria/useHover';
import { mergeProps } from 'react-aria/mergeProps';
import { chevronRightIcon } from '@keystar/ui/icon/icons/chevronRightIcon';
import { chevronLeftIcon } from '@keystar/ui/icon/icons/chevronLeftIcon';
import { jsx, jsxs } from 'react/jsx-runtime';

const breadcrumbsClassList = new ClassList('Breadcrumbs', ['item', 'link', 'list', 'separator']);
function BreadcrumbItem(props) {
  const $ = c(32);
  const {
    children,
    isCurrent,
    isDisabled,
    isMenu,
    size: t0
  } = props;
  const size = t0 === undefined ? "regular" : t0;
  let href;
  let propsWithoutHref;
  if ($[0] !== props) {
    ({
      href,
      ...propsWithoutHref
    } = props);
    $[0] = props;
    $[1] = href;
    $[2] = propsWithoutHref;
  } else {
    href = $[1];
    propsWithoutHref = $[2];
  }
  const {
    direction
  } = useLocale();
  const ref = useRef(null);
  const ElementType = href ? "a" : "span";
  let t1;
  if ($[3] !== href) {
    t1 = href ? {
      href
    } : {};
    $[3] = href;
    $[4] = t1;
  } else {
    t1 = $[4];
  }
  let t2;
  if ($[5] !== propsWithoutHref || $[6] !== t1 || $[7] !== ElementType) {
    t2 = {
      ...propsWithoutHref,
      ...t1,
      elementType: ElementType
    };
    $[5] = propsWithoutHref;
    $[6] = t1;
    $[7] = ElementType;
    $[8] = t2;
  } else {
    t2 = $[8];
  }
  let {
    itemProps
  } = useBreadcrumbItem(t2, ref);
  const {
    hoverProps,
    isHovered
  } = useHover(props);
  let t3;
  t3 = direction === "rtl" ? chevronLeftIcon : chevronRightIcon;
  const icon = t3;
  if (isMenu) {
    let t4;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
      t4 = {};
      $[9] = t4;
    } else {
      t4 = $[9];
    }
    itemProps = t4;
  }
  let t4;
  if ($[10] !== itemProps || $[11] !== hoverProps) {
    t4 = mergeProps(itemProps, hoverProps);
    $[10] = itemProps;
    $[11] = hoverProps;
    $[12] = t4;
  } else {
    t4 = $[12];
  }
  const t5 = size !== "regular" ? size : undefined;
  const t6 = isHovered ? "hover" : undefined;
  let t7;
  if ($[13] !== t5 || $[14] !== t6) {
    t7 = toDataAttributes({
      size: t5,
      interaction: t6
    });
    $[13] = t5;
    $[14] = t6;
    $[15] = t7;
  } else {
    t7 = $[15];
  }
  let t8;
  if ($[16] !== isHovered) {
    t8 = classNames(breadcrumbsClassList.element("link"), css({
      color: tokenSchema.color.foreground.neutral,
      cursor: "default",
      fontSize: tokenSchema.typography.text.regular.size,
      fontFamily: tokenSchema.typography.fontFamily.base,
      fontWeight: tokenSchema.typography.fontWeight.medium,
      outline: 0,
      MozOsxFontSmoothing: "auto",
      WebkitFontSmoothing: "auto",
      "&[data-size=small]": {
        fontSize: tokenSchema.typography.text.small.size
      },
      "&[data-size=medium]": {
        fontSize: tokenSchema.typography.text.medium.size
      },
      "&[data-size=large]": {
        fontSize: tokenSchema.typography.text.large.size
      },
      "&:not([aria-current=page])": {
        "&:not([aria-disabled=true])": {
          cursor: "pointer"
        },
        "&[data-interaction=hover]": {
          color: tokenSchema.color.foreground.neutralEmphasis,
          textDecoration: "underline"
        },
        "&[data-focus=visible]": {
          color: tokenSchema.color.foreground.neutralEmphasis,
          textDecoration: "underline",
          textDecorationStyle: "double"
        },
        "&[aria-disabled=true]": {
          color: tokenSchema.color.alias.foregroundDisabled
        }
      },
      "&[aria-current=page]": {
        color: tokenSchema.color.foreground.neutralEmphasis,
        fontWeight: tokenSchema.typography.fontWeight.semibold,
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }), {
      "is-hovered": isHovered
    });
    $[16] = isHovered;
    $[17] = t8;
  } else {
    t8 = $[17];
  }
  let t9;
  if ($[18] !== ElementType || $[19] !== t4 || $[20] !== t7 || $[21] !== ref || $[22] !== t8 || $[23] !== children) {
    t9 = /*#__PURE__*/jsx(FocusRing, {
      children: /*#__PURE__*/jsx(ElementType, {
        ...t4,
        ...t7,
        ref: ref,
        className: t8,
        children: children
      })
    });
    $[18] = ElementType;
    $[19] = t4;
    $[20] = t7;
    $[21] = ref;
    $[22] = t8;
    $[23] = children;
    $[24] = t9;
  } else {
    t9 = $[24];
  }
  let t10;
  if ($[25] !== isCurrent || $[26] !== isDisabled || $[27] !== icon) {
    t10 = !isCurrent && /*#__PURE__*/jsx(Icon, {
      src: icon,
      color: isDisabled ? "color.alias.foregroundDisabled" : "neutralSecondary",
      marginX: "small",
      UNSAFE_className: breadcrumbsClassList.element("separator")
    });
    $[25] = isCurrent;
    $[26] = isDisabled;
    $[27] = icon;
    $[28] = t10;
  } else {
    t10 = $[28];
  }
  let t11;
  if ($[29] !== t9 || $[30] !== t10) {
    t11 = /*#__PURE__*/jsxs(Fragment, {
      children: [t9, t10]
    });
    $[29] = t9;
    $[30] = t10;
    $[31] = t11;
  } else {
    t11 = $[31];
  }
  return t11;
}

const MIN_VISIBLE_ITEMS = 1;
const MAX_VISIBLE_ITEMS = 4;
function Breadcrumbs(props, ref) {
  props = useProviderProps(props);
  let {
    children,
    showRoot,
    size = 'regular',
    isDisabled,
    onAction,
    ...otherProps
  } = props;

  // Not using React.Children.toArray because it mutates the key prop.
  let childArray = [];
  Children.forEach(children, child => {
    if (/*#__PURE__*/isValidElement(child)) {
      childArray.push(child);
    }
  });
  let domRef = useObjectRef(ref);
  let listRef = useRef(null);
  let [menuIsOpen, setMenuOpen] = useState(false);
  let [visibleItems, setVisibleItems] = useValueEffect(childArray.length);
  let {
    navProps
  } = useBreadcrumbs(props);
  let styleProps = useStyleProps(otherProps);
  let updateOverflow = useCallback(() => {
    let computeVisibleItems = visibleItems_0 => {
      // refs may be null at runtime
      let currListRef = listRef.current;
      if (!currListRef) {
        return visibleItems_0;
      }
      let listItems = Array.from(currListRef.children);
      if (listItems.length <= 0) {
        return visibleItems_0;
      }
      let containerWidth = currListRef.offsetWidth;
      let isShowingMenu = childArray.length > visibleItems_0;
      let calculatedWidth = 0;
      let newVisibleItems = 0;
      let maxVisibleItems = MAX_VISIBLE_ITEMS;
      if (showRoot) {
        calculatedWidth += listItems.shift().offsetWidth;
        newVisibleItems++;
      }
      if (isShowingMenu) {
        calculatedWidth += listItems.shift().offsetWidth;
        maxVisibleItems--;
      }
      if (showRoot && calculatedWidth >= containerWidth) {
        newVisibleItems--;
      }
      if (listItems.length > 0) {
        // Ensure the last breadcrumb isn't truncated when we measure it.
        let last = listItems.pop();
        last.style.overflow = 'visible';
        calculatedWidth += last.offsetWidth;
        if (calculatedWidth < containerWidth) {
          newVisibleItems++;
        }
        last.style.overflow = '';
      }
      for (let breadcrumb of listItems.reverse()) {
        calculatedWidth += breadcrumb.offsetWidth;
        if (calculatedWidth < containerWidth) {
          newVisibleItems++;
        }
      }
      return Math.max(MIN_VISIBLE_ITEMS, Math.min(maxVisibleItems, newVisibleItems));
    };
    setVisibleItems(function* () {
      // Update to show all items.
      yield childArray.length;

      // Measure, and update to show the items that fit.
      let newVisibleItems_0 = computeVisibleItems(childArray.length);
      yield newVisibleItems_0;

      // If the number of items is less than the number of children,
      // then update again to ensure that the menu fits.
      if (newVisibleItems_0 < childArray.length && newVisibleItems_0 > 1) {
        yield computeVisibleItems(newVisibleItems_0);
      }
    });
  }, [childArray.length, setVisibleItems, showRoot]);
  useResizeObserver({
    ref: domRef,
    onResize: updateOverflow
  });
  let lastChildren = useRef(null);
  useLayoutEffect(() => {
    if (children !== lastChildren.current) {
      lastChildren.current = children;
      updateOverflow();
    }
  });
  let contents = childArray;
  if (childArray.length > visibleItems) {
    var _selectedItem$key;
    let selectedItem = childArray[childArray.length - 1];
    let selectedKey = (_selectedItem$key = selectedItem.key) !== null && _selectedItem$key !== void 0 ? _selectedItem$key : childArray.length - 1;
    let onMenuAction = key => {
      // Don't fire onAction when clicking on the last item
      if (key !== selectedKey && onAction) {
        onAction(key);
      }
    };
    let menuItem = /*#__PURE__*/jsx(BreadcrumbItem, {
      isMenu: true,
      children: /*#__PURE__*/jsxs(MenuTrigger, {
        onOpenChange: setMenuOpen,
        children: [/*#__PURE__*/jsx(ActionButton, {
          "aria-label": "\u2026",
          prominence: "low",
          isDisabled: isDisabled,
          children: /*#__PURE__*/jsx(Icon, {
            src: menuIsOpen ? folderOpenIcon : folderClosedIcon
          })
        }), /*#__PURE__*/jsx(Menu, {
          selectionMode: "single",
          selectedKeys: [selectedKey],
          onAction: onMenuAction,
          children: childArray
        })]
      })
    }, "menu");
    contents = [menuItem];
    let breadcrumbs = [...childArray];
    let endItems = visibleItems;
    if (showRoot && visibleItems > 1) {
      let rootItem = breadcrumbs.shift();
      if (rootItem) {
        contents.unshift(rootItem);
      }
      endItems--;
    }
    contents.push(...breadcrumbs.slice(-endItems));
  }
  let lastIndex = contents.length - 1;
  let breadcrumbItems = contents.map((child_0, index) => {
    var _child_0$key;
    let isCurrent = index === lastIndex;
    let key_0 = (_child_0$key = child_0.key) !== null && _child_0$key !== void 0 ? _child_0$key : index;
    let onPress = () => {
      if (onAction) {
        onAction(key_0);
      }
    };
    return /*#__PURE__*/jsx("li", {
      className: classNames(breadcrumbsClassList.element('item'), css({
        alignItems: 'center',
        display: 'inline-flex',
        whiteSpace: 'nowrap',
        '&:last-child': {
          overflow: 'hidden'
        }
      })),
      children: /*#__PURE__*/createElement(BreadcrumbItem, {
        ...child_0.props,
        isCurrent: isCurrent,
        isDisabled: isDisabled,
        key: key_0,
        onPress: onPress,
        size: size
      }, child_0.props.children)
    }, index);
  });
  return /*#__PURE__*/jsx("nav", {
    ...navProps,
    ...styleProps,
    ref: domRef,
    className: classNames(breadcrumbsClassList.element('root'), styleProps.className),
    children: /*#__PURE__*/jsx("ul", {
      ref: listRef,
      className: classNames(breadcrumbsClassList.element('list'), css({
        display: 'flex',
        height: tokenSchema.size.element.regular,
        justifyContent: 'flex-start'
      })),
      children: breadcrumbItems
    })
  });
}

// forwardRef doesn't support generic parameters, so cast the result to the correct type
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref

/**
 * Breadcrumbs show hierarchy and navigational context for a user's location
 * within an application.
 */
const _Breadcrumbs = /*#__PURE__*/forwardRef(Breadcrumbs);

export { _Breadcrumbs as Breadcrumbs };
