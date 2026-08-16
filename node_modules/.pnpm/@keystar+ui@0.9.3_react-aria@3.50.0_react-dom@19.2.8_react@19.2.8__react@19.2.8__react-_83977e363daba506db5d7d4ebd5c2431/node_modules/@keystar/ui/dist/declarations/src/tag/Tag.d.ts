import React from 'react';
import { type AriaTagProps } from 'react-aria/useTagGroup';
import type { ListState } from 'react-stately/useListState';
export interface TagProps<T> extends AriaTagProps<T> {
    state: ListState<T>;
}
/** @private Internal use only: rendered via `Item` by consumer. */
export declare function Tag<T>(props: TagProps<T>): React.JSX.Element;
