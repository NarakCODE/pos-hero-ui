"use client";

import {
  Children,
  cloneElement,
  createContext,
  use,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
  type UIEvent,
} from "react";
import { createPortal } from "react-dom";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

type CarouselContextValue = {
  activeIndex: number;
  slideCount: number;
  loop: boolean;
  rootId: string;
  viewportId: string;
  viewportRef: RefObject<HTMLDivElement | null>;
  overlayContainer: HTMLDivElement | null;
  setOverlayContainer: (container: HTMLDivElement | null) => void;
  previousLabel: string;
  nextLabel: string;
  getSlideLabel: (index: number, count: number) => string;
  goTo: (index: number) => void;
  syncFromScroll: (viewport: HTMLDivElement) => void;
  setSlideCount: (count: number) => void;
};

type CarouselProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  defaultIndex?: number;
  loop?: boolean;
  onIndexChange?: (index: number) => void;
  scrollBehavior?: "auto" | "smooth";
  previousLabel?: string;
  nextLabel?: string;
  getSlideLabel?: (index: number, count: number) => string;
};

type CarouselContentProps = HTMLAttributes<HTMLDivElement> & {
  containerClassName?: string;
};

type CarouselItemProps = HTMLAttributes<HTMLDivElement> & {
  slideIndex?: number;
};

type CarouselButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
>;

type CarouselDotsProps = HTMLAttributes<HTMLDivElement> & {
  dotClassName?: string;
  activeDotClassName?: string;
};

type CarouselThumbnailsProps = HTMLAttributes<HTMLDivElement>;

type CarouselThumbnailProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  src?: string;
  thumbnailIndex?: number;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);
const defaultSlideLabel = (index: number, count: number) =>
  `Slide ${index + 1} of ${count}`;
const carouselControlClassName =
  "absolute top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/95 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-40";

function useCarouselContext() {
  const context = use(CarouselContext);

  if (!context) {
    throw new Error("Carousel parts must be rendered inside <Carousel>.");
  }

  return context;
}

function CarouselRoot({
  children,
  className,
  defaultIndex = 0,
  loop = false,
  onIndexChange,
  scrollBehavior = "smooth",
  previousLabel = "Previous slide",
  nextLabel = "Next slide",
  getSlideLabel = defaultSlideLabel,
  role = "group",
  "aria-label": ariaLabel = "Carousel",
  ...rootProps
}: CarouselProps) {
  const rootId = useId();
  const viewportId = `${rootId}-viewport`;
  const [slideCount, setSlideCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, Math.floor(defaultIndex)),
  );
  const [overlayContainer, setOverlayContainer] = useState<HTMLDivElement | null>(
    null,
  );
  const activeIndexRef = useRef(activeIndex);
  const viewportRef = useRef<HTMLDivElement>(null);

  const updateIndex = useCallback(
    (index: number) => {
      const nextIndex = slideCount > 0 ? clampIndex(index, slideCount) : 0;

      if (activeIndexRef.current === nextIndex) {
        return;
      }

      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      onIndexChange?.(nextIndex);
    },
    [onIndexChange, slideCount],
  );

  const goTo = useCallback(
    (index: number) => {
      if (slideCount === 0) {
        return;
      }

      const nextIndex = loop
        ? ((index % slideCount) + slideCount) % slideCount
        : clampIndex(index, slideCount);

      updateIndex(nextIndex);
      viewportRef.current
        ?.querySelector<HTMLElement>(`[data-carousel-slide="${nextIndex}"]`)
        ?.scrollIntoView({
          behavior: getScrollBehavior(scrollBehavior),
          block: "nearest",
          inline: "start",
        });
    },
    [loop, scrollBehavior, slideCount, updateIndex],
  );

  const syncFromScroll = useCallback(
    (viewport: HTMLDivElement) => {
      updateIndex(getNearestSlideIndex(viewport));
    },
    [updateIndex],
  );

  useEffect(() => {
    if (slideCount === 0) {
      return;
    }

    const nextIndex = clampIndex(activeIndexRef.current, slideCount);
    updateIndex(nextIndex);

    if (nextIndex > 0) {
      viewportRef.current
        ?.querySelector<HTMLElement>(`[data-carousel-slide="${nextIndex}"]`)
        ?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "start" });
    }
  }, [slideCount, updateIndex]);

  const contextValue = useMemo<CarouselContextValue>(
    () => ({
      activeIndex,
      slideCount,
      loop,
      rootId,
      viewportId,
      viewportRef,
      overlayContainer,
      setOverlayContainer,
      previousLabel,
      nextLabel,
      getSlideLabel,
      goTo,
      syncFromScroll,
      setSlideCount,
    }),
    [
      activeIndex,
      getSlideLabel,
      goTo,
      loop,
      nextLabel,
      overlayContainer,
      previousLabel,
      rootId,
      slideCount,
      setOverlayContainer,
      setSlideCount,
      syncFromScroll,
      viewportId,
    ],
  );

  return (
    <CarouselContext.Provider value={contextValue}>
      <div
        {...rootProps}
        aria-label={ariaLabel}
        aria-roledescription="carousel"
        className={cx("relative", className)}
        role={role}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({
  children,
  className,
  containerClassName,
  onScroll,
  onKeyDown,
  tabIndex = 0,
  role = "group",
  "aria-label": ariaLabel = "Carousel slides",
  ...contentProps
}: CarouselContentProps) {
  const {
    viewportId,
    viewportRef,
    setOverlayContainer,
    setSlideCount,
    goTo,
    activeIndex,
    slideCount,
    syncFromScroll,
  } = useCarouselContext();
  const slides = Children.toArray(children);

  useEffect(() => {
    setSlideCount(slides.length);
  }, [setSlideCount, slides.length]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);

    if (event.defaultPrevented || event.target !== event.currentTarget) {
      return;
    }

    const isRtl = window.getComputedStyle(event.currentTarget).direction === "rtl";

    if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(slideCount - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + (isRtl ? -1 : 1));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex + (isRtl ? 1 : -1));
    }
  }

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    syncFromScroll(event.currentTarget);
    onScroll?.(event);
  }

  return (
    <div
      className={cx("relative", containerClassName)}
      ref={setOverlayContainer}
    >
      <div
        {...contentProps}
        aria-label={ariaLabel}
        className={cx(
          "w-full overflow-x-auto overscroll-x-contain snap-x snap-mandatory touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          className,
        )}
        id={viewportId}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        ref={viewportRef}
        role={role}
        tabIndex={tabIndex}
      >
        <div className="flex items-stretch">
          {slides.map((slide, index) =>
            isValidCarouselItem(slide)
              ? cloneElement(slide, { slideIndex: index })
              : slide,
          )}
        </div>
      </div>
    </div>
  );
}

function CarouselItem({
  children,
  className,
  slideIndex = 0,
  id,
  role = "group",
  "aria-label": ariaLabel,
  ...itemProps
}: CarouselItemProps) {
  const { rootId, slideCount, getSlideLabel } = useCarouselContext();

  return (
    <div
      {...itemProps}
      aria-label={ariaLabel ?? getSlideLabel(slideIndex, slideCount)}
      aria-roledescription="slide"
      className={cx("w-full min-w-full flex-none snap-start", className)}
      data-carousel-slide={slideIndex}
      id={id ?? `${rootId}-slide-${slideIndex}`}
      role={role}
    >
      {children}
    </div>
  );
}

function CarouselPrevious({
  children,
  className,
  onClick,
  disabled,
  "aria-label": ariaLabel,
  ...buttonProps
}: CarouselButtonProps) {
  const {
    activeIndex,
    loop,
    slideCount,
    viewportId,
    previousLabel,
    overlayContainer,
    goTo,
  } = useCarouselContext();
  const isDisabled =
    Boolean(disabled) || slideCount <= 1 || (!loop && activeIndex === 0);

  if (!overlayContainer) {
    return null;
  }

  return createPortal(
    <button
      {...buttonProps}
      aria-controls={viewportId}
      aria-label={ariaLabel ?? previousLabel}
      className={cx(carouselControlClassName, "start-3", className)}
      disabled={isDisabled}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          goTo(activeIndex - 1);
        }
      }}
      type="button"
    >
      {children ?? (
        <IconChevronLeft
          aria-hidden="true"
          className="rtl:rotate-180"
          size={20}
        />
      )}
    </button>,
    overlayContainer,
  );
}

function CarouselNext({
  children,
  className,
  onClick,
  disabled,
  "aria-label": ariaLabel,
  ...buttonProps
}: CarouselButtonProps) {
  const {
    activeIndex,
    loop,
    slideCount,
    viewportId,
    nextLabel,
    overlayContainer,
    goTo,
  } = useCarouselContext();
  const isDisabled =
    Boolean(disabled) ||
    slideCount <= 1 ||
    (!loop && activeIndex >= slideCount - 1);

  if (!overlayContainer) {
    return null;
  }

  return createPortal(
    <button
      {...buttonProps}
      aria-controls={viewportId}
      aria-label={ariaLabel ?? nextLabel}
      className={cx(carouselControlClassName, "end-3", className)}
      disabled={isDisabled}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          goTo(activeIndex + 1);
        }
      }}
      type="button"
    >
      {children ?? (
        <IconChevronRight
          aria-hidden="true"
          className="rtl:rotate-180"
          size={20}
        />
      )}
    </button>,
    overlayContainer,
  );
}

function CarouselDots({
  className,
  dotClassName,
  activeDotClassName,
  role = "group",
  "aria-label": ariaLabel = "Choose slide",
  ...dotsProps
}: CarouselDotsProps) {
  const {
    activeIndex,
    slideCount,
    rootId,
    getSlideLabel,
    overlayContainer,
    goTo,
  } = useCarouselContext();

  if (!overlayContainer) {
    return null;
  }

  return createPortal(
    <div
      {...dotsProps}
      aria-label={ariaLabel}
      className={cx(
        "absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1",
        className,
      )}
      role={role}
    >
      {Array.from({ length: slideCount }, (_, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            aria-controls={`${rootId}-slide-${index}`}
            aria-current={isActive ? "true" : undefined}
            aria-label={getSlideLabel(index, slideCount)}
            className={cx(
              "inline-flex size-8 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              dotClassName,
            )}
            key={index}
            onClick={() => goTo(index)}
            type="button"
          >
            <span
              aria-hidden="true"
              className={cx(
                "size-2 rounded-full border border-black/10 bg-surface/90 shadow-sm motion-safe:transition-colors motion-reduce:transition-none",
                isActive && "bg-accent ring-2 ring-surface",
                isActive && activeDotClassName,
              )}
            />
          </button>
        );
      })}
    </div>,
    overlayContainer,
  );
}

function CarouselThumbnails({
  children,
  className,
  role = "group",
  "aria-label": ariaLabel = "Choose slide thumbnail",
  ...thumbnailsProps
}: CarouselThumbnailsProps) {
  const { getSlideLabel, slideCount } = useCarouselContext();
  const thumbnails = Children.toArray(children);

  return (
    <div
      {...thumbnailsProps}
      aria-label={ariaLabel}
      className={cx(
        "flex max-w-full items-center gap-2 overflow-x-auto py-1",
        className,
      )}
      role={role}
    >
      {thumbnails.map((thumbnail, index) =>
        isValidCarouselThumbnail(thumbnail)
          ? cloneElement(thumbnail, {
              thumbnailIndex: index,
              "aria-label":
                thumbnail.props["aria-label"] ?? getSlideLabel(index, slideCount),
            })
          : thumbnail,
      )}
    </div>
  );
}

function CarouselThumbnail({
  children,
  className,
  onClick,
  src,
  thumbnailIndex = 0,
  "aria-label": ariaLabel,
  ...buttonProps
}: CarouselThumbnailProps) {
  const { activeIndex, rootId, goTo, getSlideLabel, slideCount } =
    useCarouselContext();
  const isActive = thumbnailIndex === activeIndex;

  return (
    <button
      {...buttonProps}
      aria-controls={`${rootId}-slide-${thumbnailIndex}`}
      aria-label={ariaLabel ?? getSlideLabel(thumbnailIndex, slideCount)}
      aria-pressed={isActive}
      className={cx(
        "relative inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-surface text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        isActive ? "border-accent ring-2 ring-accent/30" : "border-border",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          goTo(thumbnailIndex);
        }
      }}
      type="button"
    >
      {src ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${src}")` }}
        />
      ) : (
        children ?? thumbnailIndex + 1
      )}
      {src && children ? (
        <span className="relative z-10">{children}</span>
      ) : null}
    </button>
  );
}

function isValidCarouselItem(
  element: ReactNode,
): element is ReactElement<CarouselItemProps> {
  return isElementOfType<CarouselItemProps>(element, CarouselItem);
}

function isValidCarouselThumbnail(
  element: ReactNode,
): element is ReactElement<CarouselThumbnailProps> {
  return isElementOfType<CarouselThumbnailProps>(element, CarouselThumbnail);
}

function isElementOfType<Props extends object>(
  element: ReactNode,
  component: (props: Props) => ReactNode,
): element is ReactElement<Props> {
  return Boolean(
    element &&
      typeof element === "object" &&
      "type" in element &&
      element.type === component,
  );
}

function getNearestSlideIndex(viewport: HTMLDivElement) {
  const viewportBounds = viewport.getBoundingClientRect();
  const isRtl = window.getComputedStyle(viewport).direction === "rtl";
  const slides = viewport.querySelectorAll<HTMLElement>("[data-carousel-slide]");
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    const bounds = slide.getBoundingClientRect();
    const distance = isRtl
      ? Math.abs(viewportBounds.right - bounds.right)
      : Math.abs(bounds.left - viewportBounds.left);

    if (distance < nearestDistance) {
      nearestIndex = index;
      nearestDistance = distance;
    }
  });

  return nearestIndex;
}

function getScrollBehavior(behavior: "auto" | "smooth") {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return "auto";
  }

  return behavior;
}

function clampIndex(index: number, count: number) {
  return Math.min(Math.max(0, Math.floor(index)), Math.max(0, count - 1));
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const Carousel = Object.assign(CarouselRoot, {
  Content: CarouselContent,
  Item: CarouselItem,
  Previous: CarouselPrevious,
  Next: CarouselNext,
  Dots: CarouselDots,
  Thumbnails: CarouselThumbnails,
  Thumbnail: CarouselThumbnail,
});
