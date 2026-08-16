/** * Utility component for implementing overlay transitions. */
export declare const Overlay: import("react").ForwardRefExoticComponent<Omit<import("react-aria/Overlay").OverlayProps, "portalContainer" | "isExiting"> & import("./types.js").TransitionProps & {
    container?: import("react-aria/Overlay").OverlayProps["portalContainer"];
    isKeyboardDismissDisabled?: boolean;
} & import("react").RefAttributes<HTMLDivElement>>;
