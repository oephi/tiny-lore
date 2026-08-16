import { InvalidationContext, LayoutNode, ListLayoutOptions, ListLayout } from 'react-stately/useVirtualizerState';
import { Node } from '@react-types/shared';
export interface ListBoxLayoutOptions extends ListLayoutOptions {
    isLoading?: boolean;
    placeholderHeight?: number;
}
export declare class ListBoxLayout<T> extends ListLayout<T, ListBoxLayoutOptions> {
    private isLoading;
    private placeholderHeight;
    constructor(opts: ListBoxLayoutOptions);
    update(invalidationContext: InvalidationContext<ListBoxLayoutOptions>): void;
    protected buildCollection(): LayoutNode[];
    protected buildSection(node: Node<T>, x: number, y: number): LayoutNode;
}
