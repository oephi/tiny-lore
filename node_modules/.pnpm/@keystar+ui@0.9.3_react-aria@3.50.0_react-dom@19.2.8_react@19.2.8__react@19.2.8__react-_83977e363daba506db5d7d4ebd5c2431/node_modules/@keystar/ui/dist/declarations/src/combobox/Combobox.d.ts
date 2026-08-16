import React, { CSSProperties, ForwardedRef, InputHTMLAttributes, ReactElement, RefObject } from 'react';
import { AriaButtonProps } from 'react-aria/useButton';
import { LoadingState } from '@react-types/shared';
import { ComboboxProps } from "./types.js";
export declare function ComboboxEmptyState(props: {
    loadingState?: LoadingState;
}): React.JSX.Element;
export declare function usePopoverStyles(props: {
    menuWidth?: number;
    buttonRef: RefObject<HTMLButtonElement | null>;
    inputRef: RefObject<HTMLInputElement | null>;
    fieldRef: RefObject<HTMLDivElement | null>;
}): {
    width: number | undefined;
    minWidth: number | undefined;
};
interface ComboboxInputProps<T> extends ComboboxProps<T> {
    inputProps: InputHTMLAttributes<HTMLInputElement>;
    inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
    triggerProps: AriaButtonProps;
    triggerRef: RefObject<HTMLButtonElement | null>;
    style?: CSSProperties;
    isOpen?: boolean;
}
/** @private Used by multi variant. */
export declare const ComboboxInput: <T>(props: ComboboxInputProps<T> & {
    ref?: ForwardedRef<HTMLDivElement>;
}) => ReactElement;
/**
 * A combobox combines a text input with a listbox, and allows users to filter a
 * list of options.
 */
declare const _Combobox: <T>(props: ComboboxProps<T> & {
    ref?: ForwardedRef<HTMLDivElement>;
}) => ReactElement;
export { _Combobox as Combobox };
