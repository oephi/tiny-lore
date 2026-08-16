import { HTMLAttributes } from 'react';
import { BaseStyleProps, BoxStyleProps, StyleResolverMap } from "./types.js";
import type { CSSObject } from '@emotion/serialize';
export declare function convertStyleProps<T extends BaseStyleProps>(props: T, propResolvers: StyleResolverMap): CSSObject;
export declare function useStyleProps<T extends BoxStyleProps>(props: T, customResolvers?: StyleResolverMap): Pick<HTMLAttributes<HTMLElement>, 'className' | 'style'>;
