import * as React from 'react';

// tslint:disable-next-line:interface-name
export interface ShorthandConfig<TProps> {
  mappedProp?: keyof TProps;
  mappedArrayProp?: keyof TProps;
  allowsJSX?: boolean;
}

//
// "as" type safety
//

export type PropsOfElement<
  // tslint:disable-next-line:no-any
  E extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any> | ComponentWithAs
  // tslint:disable-next-line:no-any
> = E extends { __PRIVATE_PROPS: any }
  ? E['__PRIVATE_PROPS']
  : JSX.LibraryManagedAttributes<E, React.ComponentPropsWithRef<E>>;

// tslint:disable-next-line:interface-name
export type ComponentWithAs<TElementType extends keyof JSX.IntrinsicElements = 'div', TProps = {}> = (<
  TExtendedElementType extends React.ElementType = TElementType
>(
  props: Omit<PropsOfElement<TExtendedElementType>, 'as' | keyof TProps> & { as?: TExtendedElementType } & TProps,
) => JSX.Element) & {
  propTypes?: React.WeakValidationMap<TProps> & {
    // tslint:disable-next-line:no-any
    as: React.Requireable<string | ((props: any, context?: any) => any) | (new (props: any, context?: any) => any)>;
  };
  // tslint:disable-next-line:no-any
  contextTypes?: React.ValidationMap<any>;
  defaultProps?: Partial<TProps & { as: TElementType }>;
  displayName?: string;

  /**
   * A hack to simplify the resolution for ComponentWithAs.
   * @see https://github.com/microsoft/fluentui/pull/13841
   */
  readonly __PRIVATE_PROPS?: Omit<PropsOfElement<TElementType>, 'as' | keyof TProps> & { as?: TElementType } & TProps;
};

//
// Compose types
//

export type ComposedComponent<TProps = {}> = React.FunctionComponent<TProps> & {
  fluentComposeConfig: Required<ComposePreparedOptions>;
};

export type InputComposeComponent<TProps = {}> = React.FunctionComponent<TProps> & {
  fluentComposeConfig?: Required<ComposePreparedOptions>;
};

export type Input<TElementType extends React.ElementType = 'div', TProps = {}> =
  | InputComposeComponent<TProps>
  | ComposeRenderFunction<TElementType, TProps & { as?: React.ElementType }>;

export type ComposeRenderFunction<TElementType extends React.ElementType = 'div', TProps = {}, TState = TProps> = (
  props: TProps,
  ref: React.Ref<TElementType extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[TElementType] : TElementType>,
  // tslint:disable-next-line:no-any
  options: ComposePreparedOptions & { state: any },
) => React.ReactElement | null;

export type ComposeOptions<
  TInputProps = {},
  TInputStylesProps = {},
  TParentProps = {},
  TParentStylesProps = {},
  TState = TParentProps & TInputProps
> = {
  className?: string;

  classes?: ClassDictionary | ClassFunction | (ClassDictionary | ClassFunction)[];

  displayName?: string;

  mapPropsToStylesProps?: (props: TParentStylesProps & TInputProps) => TInputStylesProps;

  handledProps?: (keyof TInputProps | 'as')[];

  overrideStyles?: boolean;

  slots?: Record<string, React.ElementType>;

  slotProps?: (props: TParentProps & TInputProps) => Record<string, object>;

  shorthandConfig?: ShorthandConfig<TParentProps & TInputProps>;

  // tslint:disable-next-line:no-any
  state?: (props: TState, ref: React.Ref<HTMLElement>, options: ComposePreparedOptions) => any;
};

export type MergePropsResult<
  TState extends GenericDictionary,
  TSlots = GenericDictionary,
  // tslint:disable-next-line:no-any
  TSlotProps = { [key in keyof TSlots]: any }
> = {
  state: TState;
  slots: TSlots;
  slotProps: TSlotProps;
};

/**
 * Generic name to any dictionary.
 */
// tslint:disable-next-line:no-any
export type GenericDictionary = Record<string, any>;

/**
 * Generic set of module to class name map.
 */
export type ClassDictionary = Record<string, string>;

/**
 * Generic class resolver function type.
 */
export type ClassFunction = (state: GenericDictionary, slots: GenericDictionary) => ClassDictionary;

/**
 * Merged ComposeOptions.
 */
// tslint:disable-next-line:no-any
export type ComposePreparedOptions<TProps = {}, TInputState = any, TParentState = TProps> = {
  className: string;
  classes: (undefined | ClassDictionary | ClassFunction)[];

  displayName: string;
  displayNames: string[];

  mapPropsToStylesPropsChain: ((props: object) => object)[];
  render: ComposeRenderFunction;

  handledProps: (keyof TProps | 'as')[];

  overrideStyles: boolean;

  slots: Record<string, React.ElementType> & { __self: React.ElementType };
  slotProps: ((props: TProps) => Record<string, object>)[];

  state: (props: TParentState, ref: React.Ref<HTMLElement>, options: ComposePreparedOptions) => TInputState;

  resolveSlotProps: <TResolvedProps>(props: TResolvedProps) => Record<string, object>;
  shorthandConfig: ShorthandConfig<TProps>;
};

//
// Component types
//

export interface ComponentProps {
  as?: React.ElementType;

  className?: string;
}

export interface BaseSlots {
  root: React.ElementType;
}

export type SlotProps<TSlots extends BaseSlots, TProps, TRootProps extends React.HTMLAttributes<HTMLElement>> = {
  // tslint:disable-next-line:no-any
  [key in keyof Omit<TSlots, 'root'>]: key extends keyof TProps ? TProps[key] : any;
} & {
  root: TRootProps;
};

//
// Slot Prop / Shorthand types
//

export type SlotPropRenderFunction<TProps> = (Component: React.ElementType<TProps>, props: TProps) => React.ReactNode;

export type ObjectSlotProp<TProps extends GenericDictionary> = TProps & {
  children?: TProps['children'] | SlotPropRenderFunction<TProps>;
};

export type SlotProp<TProps> =
  | React.ReactChild
  | React.ReactNodeArray
  | React.ReactPortal
  | boolean
  | null
  | undefined
  | ObjectSlotProp<TProps>;
