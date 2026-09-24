"use client";

import {
  Children,
  Fragment,
  createContext,
  isValidElement,
  useContext,
  useId,
  useState,
  type ComponentProps,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  Header,
  ListBox,
  Modal,
  SearchField,
  Separator,
} from "@heroui/react";
import type { Key } from "@heroui/react";

type CommandSize = "sm" | "md" | "lg";
type CommandFilter = (textValue: string, inputValue: string) => boolean;

interface CommandDialogContextValue {
  filter: CommandFilter;
  inputValue: string;
  listId: string;
  onInputChange: (value: string) => void;
}

const CommandDialogContext = createContext<CommandDialogContextValue | null>(
  null,
);
const CommandOpenChangeContext = createContext<
  ((isOpen: boolean) => void) | null
>(null);
const CommandSizeContext = createContext<CommandSize>("md");

export type CommandItemProps = Omit<
  ComponentProps<typeof ListBox.Item>,
  "children" | "className" | "id" | "textValue"
> & {
  children: ReactNode;
  id: Key;
  textValue?: string;
  shortcut?: ReactNode;
  className?: string;
};

type CommandGroupProps = Omit<
  ComponentProps<typeof ListBox.Section>,
  "children" | "className"
> & {
  children: ReactNode;
  heading?: ReactNode;
  className?: string;
};

type CommandSeparatorProps = Omit<
  ComponentProps<typeof Separator>,
  "className"
> & {
  className?: string;
};

type CommandDialogProps = Omit<
  ComponentProps<typeof Modal.Dialog>,
  "children" | "className"
> & {
  children: ReactNode;
  className?: string;
  defaultInputValue?: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  filter?: CommandFilter;
};

type CommandBackdropProps = Omit<
  ComponentProps<typeof Modal.Backdrop>,
  "children" | "className" | "variant"
> & {
  children: ReactNode;
  className?: string;
  variant?: "opaque" | "blur" | "transparent";
};

type CommandContainerProps = Omit<
  ComponentProps<typeof Modal.Container>,
  "children" | "className" | "size"
> & {
  children: ReactNode;
  className?: string;
  size?: CommandSize;
};

type CommandInputGroupProps = Omit<
  ComponentProps<typeof SearchField>,
  "children" | "className" | "value" | "defaultValue" | "onChange"
> & {
  children: ReactNode;
  className?: string;
};

type CommandListProps = Omit<
  ComponentProps<typeof ListBox>,
  "children" | "className" | "onAction" | "selectionMode"
> & {
  children: ReactNode;
  className?: string;
  onAction?: (key: Key) => void;
  closeOnAction?: boolean;
  renderEmptyState?: () => ReactNode;
};

interface CommandInputPrefixProps {
  children?: ReactNode;
  className?: string;
}

type CommandInputSuffixProps = HTMLAttributes<HTMLDivElement>;

const commandSizeClasses: Record<CommandSize, { maxHeight: number; maxWidth: string }> = {
  sm: { maxHeight: 300, maxWidth: "max-w-sm" },
  md: { maxHeight: 356, maxWidth: "max-w-lg" },
  lg: { maxHeight: 440, maxWidth: "max-w-xl" },
};

function CommandRoot({ children }: { children: ReactNode }) {
  return <Modal>{children}</Modal>;
}

function CommandBackdrop({
  children,
  className,
  isDismissable = true,
  onOpenChange,
  variant = "opaque",
  ...props
}: CommandBackdropProps) {
  return (
    <Modal.Backdrop
      {...props}
      className={joinClasses(
        `command__backdrop command__backdrop--${variant} motion-reduce:animate-none`,
        className,
      )}
      isDismissable={isDismissable}
      onOpenChange={onOpenChange}
      variant={variant}
    >
      <CommandOpenChangeContext.Provider value={onOpenChange ?? null}>
        {children}
      </CommandOpenChangeContext.Provider>
    </Modal.Backdrop>
  );
}

function CommandContainer({
  children,
  className,
  placement = "center",
  size = "md",
  ...props
}: CommandContainerProps) {
  return (
    <CommandSizeContext.Provider value={size}>
      <Modal.Container
        {...props}
        className={joinClasses("command__container", className)}
        placement={placement}
        size={size}
      >
        {children}
      </Modal.Container>
    </CommandSizeContext.Provider>
  );
}

function CommandDialog({
  children,
  className,
  defaultInputValue = "",
  filter = defaultCommandFilter,
  inputValue: controlledInputValue,
  onInputChange,
  ...dialogProps
}: CommandDialogProps) {
  const size = useContext(CommandSizeContext);
  const listId = useId();
  const [uncontrolledInputValue, setUncontrolledInputValue] =
    useState(defaultInputValue);
  const inputValue = controlledInputValue ?? uncontrolledInputValue;

  const handleInputChange = (value: string) => {
    if (controlledInputValue === undefined) {
      setUncontrolledInputValue(value);
    }
    onInputChange?.(value);
  };

  const contextValue: CommandDialogContextValue = {
    filter,
    inputValue,
    listId,
    onInputChange: handleInputChange,
  };
  const accessibleName =
    dialogProps["aria-label"] ??
    (dialogProps["aria-labelledby"] ? undefined : "Command palette");
  const sizeClasses = commandSizeClasses[size];

  return (
    <Modal.Dialog
      {...dialogProps}
      aria-label={accessibleName}
      className={joinClasses(
        `command__dialog command__dialog--${size} flex w-full flex-col overflow-hidden rounded-xl border border-border bg-overlay p-0 shadow-overlay transition-[height] duration-200 motion-reduce:animate-none motion-reduce:transition-none`,
        sizeClasses.maxWidth,
        className,
      )}
      style={{
        ...dialogProps.style,
        maxHeight: `min(${sizeClasses.maxHeight}px, calc(100dvh - 2rem))`,
      }}
    >
      <CommandDialogContext.Provider value={contextValue}>
        {children}
      </CommandDialogContext.Provider>
    </Modal.Dialog>
  );
}

function CommandHeader({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={joinClasses("command__header px-4 pb-2 pt-4", className)}
    >
      {children}
    </div>
  );
}

function CommandInputGroup({
  children,
  className,
  autoFocus = true,
  ...props
}: CommandInputGroupProps) {
  const context = useCommandDialogContext();

  return (
    <SearchField
      {...props}
      autoFocus={autoFocus}
      className={joinClasses(
        "command__input-group border-b border-border px-4 py-3",
        className,
      )}
      value={context.inputValue}
      variant="secondary"
      onChange={context.onInputChange}
    >
      <SearchField.Group className="flex min-h-10 items-center gap-2">
        {children}
      </SearchField.Group>
    </SearchField>
  );
}

function CommandInputPrefix({ children, className }: CommandInputPrefixProps) {
  return (
    <SearchField.SearchIcon
      className={joinClasses("command__input-group-prefix shrink-0", className)}
    >
      {children}
    </SearchField.SearchIcon>
  );
}

function CommandInput({
  "aria-label": ariaLabel,
  className,
  onKeyDown,
  placeholder = "Search commands...",
  ...props
}: ComponentProps<typeof SearchField.Input>) {
  const context = useCommandDialogContext();

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.key !== "ArrowDown") return;

    const list = document.getElementById(context.listId);
    if (!list) return;

    event.preventDefault();
    list.focus();
  };

  return (
    <SearchField.Input
      {...props}
      aria-label={ariaLabel ?? "Search commands"}
      className={
        typeof className === "function"
          ? (renderProps) =>
              joinClasses(
                "min-w-0 flex-1",
                renderProps.defaultClassName,
                className(renderProps),
              )
          : joinClasses("min-w-0 flex-1", className)
      }
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
    />
  );
}

function CommandInputClearButton(
  props: ComponentProps<typeof SearchField.ClearButton>,
) {
  return (
    <SearchField.ClearButton
      {...props}
      aria-label={props["aria-label"] ?? "Clear search"}
    />
  );
}

function CommandInputSuffix({
  children,
  className,
  ...props
}: CommandInputSuffixProps) {
  return (
    <div
      {...props}
      className={joinClasses("command__input-group-suffix shrink-0", className)}
    >
      {children}
    </div>
  );
}

function CommandList({
  children,
  className,
  closeOnAction = true,
  onAction,
  renderEmptyState,
  ...listBoxProps
}: CommandListProps) {
  const context = useCommandDialogContext();
  const onOpenChange = useContext(CommandOpenChangeContext);
  const hasResults = hasVisibleCommandItem(children, context);

  const handleAction = (key: Key) => {
    onAction?.(key);
    if (closeOnAction) onOpenChange?.(false);
  };

  return (
    <div
      className={joinClasses(
        "command__list min-h-0 flex-1 overflow-y-auto overscroll-contain p-2",
        className,
      )}
    >
      {hasResults ? (
        <ListBox
          {...listBoxProps}
          id={context.listId}
          aria-label={listBoxProps["aria-label"] ?? "Commands"}
          className="min-w-0 outline-none"
          selectionMode="none"
          onAction={handleAction}
        >
          {renderCommandChildren(children, context)}
        </ListBox>
      ) : (
        <div className="command__empty px-4 py-8 text-center text-sm text-muted">
          {renderEmptyState ? renderEmptyState() : "No commands found."}
        </div>
      )}
    </div>
  );
}

function CommandGroupMarker(props: CommandGroupProps) {
  void props;
  return null;
}

function CommandItemMarker(props: CommandItemProps) {
  void props;
  return null;
}

function CommandSeparatorMarker(props: CommandSeparatorProps) {
  void props;
  return null;
}

function CommandFooter({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={joinClasses(
        "command__footer border-t border-border bg-default/50 px-4 py-2 text-xs text-muted",
        className,
      )}
    >
      {children}
    </div>
  );
}

function renderCommandChildren(
  children: ReactNode,
  context: CommandDialogContextValue,
): ReactNode[] {
  return Children.toArray(children).map((child, index) => {
    if (!isValidElement(child)) return child;

    if (child.type === CommandItemMarker) {
      const item = child.props as unknown as CommandItemProps;
      const {
        children: itemChildren,
        className,
        id,
        shortcut,
        textValue,
        ...itemProps
      } = item;
      const searchableText = textValue ?? getTextContent(itemChildren);
      if (!context.filter(searchableText, context.inputValue)) return null;

      return (
        <ListBox.Item
          {...itemProps}
          key={String(id)}
          className={joinClasses(
            "command__item flex w-full cursor-default items-center gap-3 rounded-lg px-3 py-2 text-sm outline-none transition-colors data-[hovered=true]:bg-default data-[focused=true]:bg-default data-[pressed=true]:bg-default-hover data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
            className,
          )}
          id={id}
          textValue={searchableText}
        >
          <span className="min-w-0 flex-1">{itemChildren}</span>
          {shortcut ? (
            <kbd className="command__item-shortcut shrink-0 rounded border border-border px-1.5 py-0.5 text-[11px] text-muted">
              {shortcut}
            </kbd>
          ) : null}
        </ListBox.Item>
      );
    }

    if (child.type === CommandGroupMarker) {
      const group = child.props as unknown as CommandGroupProps;
      if (!hasVisibleCommandItem(group.children, context)) return null;
      const { children: groupChildren, className, heading, ...groupProps } = group;

      return (
        <ListBox.Section
          {...groupProps}
          key={child.key ?? `command-group-${index}`}
          className={joinClasses("command__group mt-2 first:mt-0", className)}
        >
          {heading ? (
            <Header className="command__group-heading px-3 py-1 text-xs font-medium text-muted">
              {heading}
            </Header>
          ) : null}
          {renderCommandChildren(groupChildren, context)}
        </ListBox.Section>
      );
    }

    if (child.type === CommandSeparatorMarker) {
      const separator = child.props as unknown as CommandSeparatorProps;
      const { className, ...separatorProps } = separator;
      return (
        <Separator
          {...separatorProps}
          key={child.key ?? `command-separator-${index}`}
          className={joinClasses("command__separator my-2", className)}
        />
      );
    }

    if (child.type === Fragment) {
      return (
        <Fragment key={child.key}>
          {renderCommandChildren(
            (child.props as { children?: ReactNode }).children,
            context,
          )}
        </Fragment>
      );
    }

    return child;
  });
}

function hasVisibleCommandItem(
  children: ReactNode,
  context: CommandDialogContextValue,
): boolean {
  return Children.toArray(children).some((child) => {
    if (!isValidElement(child)) return false;

    if (child.type === CommandItemMarker) {
      const item = child.props as unknown as CommandItemProps;
      return context.filter(
        item.textValue ?? getTextContent(item.children),
        context.inputValue,
      );
    }

    if (child.type === CommandGroupMarker || child.type === Fragment) {
      return hasVisibleCommandItem(
        (child.props as { children?: ReactNode }).children,
        context,
      );
    }

    return false;
  });
}

function getTextContent(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      if (isValidElement(child)) {
        return getTextContent(
          (child.props as { children?: ReactNode }).children,
        );
      }

      return "";
    })
    .join(" ")
    .trim();
}

function useCommandDialogContext() {
  const context = useContext(CommandDialogContext);
  if (!context) {
    throw new Error(
      "Command input and list components must be rendered inside Command.Dialog.",
    );
  }
  return context;
}

function defaultCommandFilter(textValue: string, inputValue: string) {
  return textValue
    .toLocaleLowerCase()
    .includes(inputValue.trim().toLocaleLowerCase());
}

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const CommandInputGroupCompound = Object.assign(CommandInputGroup, {
  Prefix: CommandInputPrefix,
  Input: CommandInput,
  ClearButton: CommandInputClearButton,
  Suffix: CommandInputSuffix,
});

export const Command = Object.assign(CommandRoot, {
  Backdrop: CommandBackdrop,
  Container: CommandContainer,
  Dialog: CommandDialog,
  Header: CommandHeader,
  InputGroup: CommandInputGroupCompound,
  List: CommandList,
  Group: CommandGroupMarker,
  Item: CommandItemMarker,
  Separator: CommandSeparatorMarker,
  Footer: CommandFooter,
});
